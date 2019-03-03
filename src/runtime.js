const Chart = require('gdax-candles');
const { Exchange, Broker } = require('gdax-flash-limit');
const getHandlers = require('./handlers');
const config = require('./config');

module.exports = function botstart() {
  const ethereumChart = new Chart({
    product: config.product,
    timeframe: config.timeframe
  }).start();
  
  const exchange = new Exchange({
    credentials: config.credentials,
    sandbox: false
  });
  
  const broker = new Broker({
    exchange
  });
  
  const handlers = getHandlers(config, broker);
  
  exchange.run()
  .then(() => {
    broker.run();
    broker.on('fill', handlers.fillHandler);
    broker.on('error', (error) => handlers.errorHandler(error, 'gdax-flash-limit'));
  });
  
  ethereumChart.on('change', handlers.changeHandler);
  ethereumChart.on('close', handlers.closeHandler);
  ethereumChart.on('error', (error) => handlers.errorHandler(error, 'gdax-candles'));
}