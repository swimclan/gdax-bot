const {Order} = require('gdax-flash-limit');
const getModel = require('./models');

module.exports = function getHandlers(state, broker) {
  // let {
  //   n,
  //   product,
  //   size,
  //   periods,
  //   position,
  //   limitMargin,
  //   stopMargin,
  //   placed,
  //   isBullish,
  //   wasBullish
  // } = state;

  const HistoryModel = getModel('history');
  const ErrorModel = getModel('error');

  const longTrend = function(candle) {
    let isLong = true;
    state.periods.forEach(period => {
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
    broker.queueOrder(new Order({ product_id: state.product, size: state.size, side: 'buy' }));
    state.set('placed', true);
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
    broker.queueOrder(new Order({product_id: state.product, size: state.size, side: 'sell'}));
    state.set('placed', true);
  }

  return {
    fillHandler(order) {
      if (order.status === 'filled' && order.side === 'buy') {
        state.set('position', order);
        state.set('placed', false);
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
        state.set('position', null);
        state.set('placed', false);
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
      if (state.position && candle.price >= (state.position.price * state.limitMargin) && !state.placed) {
        sell(candle, 'limit');
      } else if (state.position && candle.price <= (state.position.price / state.stopMargin) && !state.placed) {
        sell(candle, 'stop');
      }
    },
    
    closeHandler(candle) {
      state.set('n', state.n + 1);
      console.log(`n = ${state.n}`);
      if (candle.ema[state.periods[state.periods.length-1]]) {
        state.set('isBullish', candle.ema[state.periods[0]] > candle.ema[state.periods[state.periods.length-1]]);
        state.set('wasBullish', typeof state.wasBullish === 'undefined' ? state.isBullish : state.wasBullish);
        console.log(`
          ${new Date().toISOString()}
          ${state.isBullish ? 'BULLISH' : 'BEARISH'}
          LAST: ${candle.price}
          EMA ${state.periods[0]}: ${candle.ema[state.periods[0]]}
          EMA ${state.periods[state.periods.length-1]}: ${candle.ema[state.periods[state.periods.length-1]]}
          POSITION: ${state.position ? state.position.price : 'none'}
          LIMIT: ${state.position ? state.position.price * state.limitMargin : 'none'}
          STOP: ${state.position ? state.position.price / state.stopMargin : 'none'}
        `);
        if (state.isBullish && !state.wasBullish) {
          console.log('Crossover!');
          !state.position && !state.placed && longTrend(candle) && buy(candle);
        }
        state.set('wasBullish', state.isBullish);
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