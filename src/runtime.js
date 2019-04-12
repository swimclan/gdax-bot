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
      const orderbook = exchange.orderbooks[state.product];
      const orderbookSocket = orderbook ? orderbook.websocket.socket : null;
      const exchangeSocket = exchange.websocket.socket; 
      exchangeSocket && state.set('exchangeSocket', exchangeSocket.readyState);
      orderbookSocket && state.set('orderbookSocket', orderbookSocket.readyState);
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