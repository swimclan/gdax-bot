const {Order} = require('gdax-flash-limit');
const getModel = require('./models');

module.exports = function getHandlers(options, broker) {
  let {
    n,
    product,
    size,
    periods,
    position,
    limitMargin,
    stopMargin,
    placed,
    isBullish,
    wasBullish
  } = Object.assign({}, options);

  const HistoryModel = getModel('history');
  const ErrorModel = getModel('error');

  const longTrend = function(candle) {
    let isLong = true;
    periods.forEach(period => {
      isLong = isLong && candle.regression[period].slope > 0;
    });
    return isLong;
  }
  
  const buy = function(candle) {
    console.log(`
      ${new Date().toISOString()}
      BUY PLACED: ${candle.price}
    `);
    HistoryModel.create({
      side: 'buy',
      action: 'placed',
      price: candle.price,
      type: 'limit'
    });
    broker.queueOrder(new Order({ product_id: product, size, side: 'buy' }));
    placed = true;
  }
  
  const sell = function(candle, type) {
    switch(type) {
      case 'limit':
        console.log(`
          ${new Date().toISOString()}
          LIMIT SELL PLACED: ${candle.price}\n
        `);
        HistoryModel.create({
          side: 'sell',
          action: 'placed',
          price: candle.price,
          type: 'limit'
        });
        break;
  
      case 'stop':
        console.log(`
          ${new Date().toISOString()}
          STOP SELL PLACED: ${candle.price}\n
        `);
        HistoryModel.create({
          side: 'sell',
          action: 'placed',
          price: candle.price,
          type: 'stop'
        });
        break;
    }
    broker.queueOrder(new Order({product_id: product, size, side: 'sell'}));
    placed = true;
  }

  return {
    fillHandler(order) {
      console.log('FILLED: ', order.status, order.side);
      if (order.status === 'filled' && order.side === 'buy') {
        position = order;
        placed = false;
        console.log(`
          ${new Date().toISOString()}
          BUY FILLED: ${order.price}
        `);
        HistoryModel.create({
          side: 'buy',
          action: 'filled',
          price: order.price,
          type: null
        });
      } else if (order.status === 'filled' && order.side === 'sell') {
        position = null;
        placed = false;
        console.log(`
          ${new Date().toISOString()}
          SELL FILLED: ${order.price}\n
        `);
        HistoryModel.create({
          side: 'sell',
          action: 'filled',
          price: order.price,
          type: null
        });
      }
    },
    changeHandler(candle) {
      if (position && candle.price >= (position.price * limitMargin) && !placed) {
        sell(candle, 'limit');
      } else if (position && candle.price <= (position.price / stopMargin) && !placed) {
        sell(candle, 'stop');
      }
    },
    
    closeHandler(candle) {
      n++;
      console.log(`n = ${n}`);
      if (candle.ema[periods[periods.length-1]]) {
        isBullish = candle.ema[periods[0]] > candle.ema[periods[periods.length-1]];
        wasBullish = typeof wasBullish === 'undefined' ? isBullish : wasBullish;
        console.log(`
          ${new Date().toISOString()}
          ${isBullish ? 'BULLISH' : 'BEARISH'}
          LAST: ${candle.price}
          EMA ${periods[0]}: ${candle.ema[periods[0]]}
          EMA ${periods[periods.length-1]}: ${candle.ema[periods[periods.length-1]]}
          POSITION: ${position ? position.price : 'none'}
          LIMIT: ${position ? position.price * limitMargin : 'none'}
          STOP: ${position ? position.price / stopMargin : 'none'}
        `);
        if (isBullish && !wasBullish) {
          console.log('Crossover!');
          !position && !placed && longTrend(candle) && buy(candle);
        }
        wasBullish = isBullish;
        console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
      }
    },
    
    errorHandler(error, sourceModule = 'gdax-bot') {
      const message = `${sourceModule} - ${typeof error === 'object' ? JSON.stringify(error) : error}`;
      ErrorModel.create({
        message
      });
      console.error(message);
    }
  }
}