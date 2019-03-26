const Chart = require('gdax-candles');
const { Exchange, Broker } = require('gdax-flash-limit');
const getHandlers = require('./handlers');
const config = require('./config');

module.exports = function botstart(state) {
  const ethereumChart = new Chart({
    product: state.product,
    timeframe: state.timeframe
  }).start();
  
  const exchange = new Exchange({
    credentials: config.credentials,
    sandbox: false
  });
  
  const broker = new Broker({
    exchange
  });
  
  const handlers = getHandlers(state, broker);
  
  exchange.run()
  .then(() => {
    setInterval(() => {
      state.set('exchangeSocket', exchange.websocket.socket.readyState);
      state.set('orderbookSocket', exchange.orderbooks[state.product] ? exchange.orderbooks[state.product].websocket.socket.readyState : null);
    }, (60000));
    broker.run();
    broker.on('placed', handlers.placedHandler);
    broker.on('fill', handlers.fillHandler);
    broker.on('error', (error) => handlers.errorHandler(error, 'gdax-flash-limit'));
    state.set('queue', broker.queues);
  });
  
  ethereumChart.on('change', handlers.changeHandler);
  ethereumChart.on('close', handlers.closeHandler);
  ethereumChart.on('error', (error) => handlers.errorHandler(error, 'gdax-candles'));
}