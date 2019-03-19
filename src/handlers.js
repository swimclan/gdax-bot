const {Order} = require('gdax-flash-limit');
const getModel = require('./models');

module.exports = function getHandlers(state, broker) {
  const HistoryModel = getModel('history');
  const ErrorModel = getModel('error');

  const longTrend = function(candle) {
    let isLong = true;
    state.periods.forEach(period => {
      isLong = isLong && candle.regression[period].slope > 0;
    });
    return isLong;
  }
  
  const buy = function() {
    if (state.placing) return;
    broker.queueOrder(new Order({ product_id: state.product, size: state.size, side: 'buy' }));
    state.set('placing', true);
  }
  
  const sell = function() {
    if (state.placing) return;
    broker.queueOrder(new Order({product_id: state.product, size: state.size, side: 'sell'}));
    state.set('placing', true);
  }

  return {
    placedHandler(order) {
      state.set('placing', false);
      state.set('placed', true);
      if (order.side === 'buy') {
        console.log(`
          ${new Date().toISOString()}
          BUY PLACED: ${order.price}\n
        `);
        HistoryModel.create({
          side: 'buy',
          action: 'placed',
          price: order.price,
          type: 'limit',
          size: order.remaining,
          fee: order.fee
        });
      } else {
        switch(state.sellType) {
          case 'limit':
            console.log(`
              ${new Date().toISOString()}
              LIMIT SELL PLACED: ${order.price}\n
            `);
            HistoryModel.create({
              side: 'sell',
              action: 'placed',
              price: order.price,
              type: 'limit',
              size: order.remaining,
              fee: order.fee
            });
            break;
      
          case 'stop':
            console.log(`
              ${new Date().toISOString()}
              STOP SELL PLACED: ${order.price}\n
            `);
            HistoryModel.create({
              side: 'sell',
              action: 'placed',
              price: order.price,
              type: 'stop',
              size: order.remaining,
              fee: order.fee
            });
            break;
        }
      }
    },
    fillHandler(order) {
      if (order.status === 'filled' && order.side === 'buy') {
        state.set('position', order);
        state.set('placed', false);
        state.set('bestPrice', order.price);
        state.set('stopPrice', order.price / state.stopMargin);
        state.set('limitPrice', order.price * state.limitMargin);
        console.log(`
          ${new Date().toISOString()}
          BUY FILLED: ${order.price}
        `);
        HistoryModel.create({
          side: 'buy',
          action: 'filled',
          price: order.price,
          type: null,
          size: state.remaining,
          fee: order.fee
        });
      } else if (order.status === 'filled' && order.side === 'sell') {
        state.set('position', null);
        state.set('placed', false);
        state.set('bestPrice', null);
        state.set('limitPrice', null);
        state.set('stopPrice', null);
        state.set('sellType', null);
        console.log(`
          ${new Date().toISOString()}
          SELL FILLED: ${order.price}\n
        `);
        HistoryModel.create({
          side: 'sell',
          action: 'filled',
          price: order.price,
          type: null,
          size: state.remaining,
          fee: order.fee
        });
      }
    },
    changeHandler(candle) {
      state.set('candle', candle);
      if (state.position && candle.price > state.bestPrice) {
        state.set('bestPrice', candle.price);
        state.set('stopPrice', state.bestPrice / state.stopMargin);
      }

      if (state.position && candle.price <= state.stopPrice && !state.placed) {
        state.set('sellType', 'stop');
        sell();
      } else if (state.position && candle.price >= state.limitPrice && !state.placed) {
        state.set('sellType', 'limit');
        sell();
      }
    },
    
    closeHandler(candle) {
      state.set('candle', candle);
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
          !state.position && !state.placed && longTrend(candle) && buy();
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