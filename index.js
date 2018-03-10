const Chart = require('gdax-candles');
const { Exchange, Broker, Order } = require('gdax-flash-limit');
const fs = require('fs');

const credentials = {
  key: process.env.KEY,
  secret: process.env.SECRET,
  passphrase: process.env.PASSPHRASE
};

const product = 'ETH-USD';
const timeframe = '5m'; // supports second, minute and hour intervals (i.e. 1h, 30s, 10m, etc)
const ethereumChart = new Chart({ product, timeframe }).start();
const exchange = new Exchange({ credentials, sandbox: false });
const broker = new Broker({ exchange });

exchange.run()
.then(() => {
  broker.run();
  broker.on('fill', onOrderFill);
  broker.on('error', (error) => console.log(error));
});

let n = 0;
let periods = [10, 20, 50, 100];
let wasBullish, isBullish;
let started = false;
let position = null;
let placed = false;
let limitMargin = 1.004;
let stopMargin = 1.002;
let margin = 0; 
let size = 1;

fs.openSync('results.txt', 'w');

const onOrderFill = function(order) {
  if (order.status === 'filled' && order.side === 'buy') {
    position = order;
    placed = false;
    fs.appendFileSync('results.txt', `${new Date().toISOString()}\nBUY FILLED: ${order.price}\n`);
  } else if (order.status === 'filled' && order.side === 'sell') {
    position = null;
    placed = false;
    fs.appendFileSync('results.txt', `${new Date().toISOString()}\nSELL FILLED: ${order.price}\n`);
  }
}

const longTrend = function(candle) {
  let isLong = true;
  periods.forEach(period => {
    isLong = isLong && candle.regression[period].slope > 0;
  });
  return isLong;
}

const buy = function(candle) {
  fs.appendFileSync('results.txt', `${new Date().toISOString()}\nBUY PLACED: ${candle.price}\n`);
  broker.queueOrder(new Order({ product_id: product, size, side: 'buy' }));
  placed = true;
}

const sell = function(candle, type) {
  switch(type) {
    case 'limit':
      fs.appendFileSync('results.txt', `${new Date().toISOString()}\nLIMIT SELL PLACED: ${candle.price}\n`);
      break;

    case 'stop':
      fs.appendFileSync('results.txt', `${new Date().toISOString()}\nSTOP SELL PLACED: ${candle.price}\n`);
      break;
  }
  broker.queueOrder(new Order({product_id: product, size, side: 'sell'}));
  placed = true;
}

const changeHandler = function(candle) {
  if (position && candle.price >= (position.price * limitMargin) && !placed) {
    sell(candle, 'limit');
  } else if (position && candle.price <= (position.price / stopMargin) && !placed) {
    sell(candle, 'stop');
  }
}

const closeHandler = function(candle) {
  n++;
  console.log(`n = ${n}`);
  if (candle.ema[periods[3]]) {
    isBullish = candle.ema[periods[0]] > candle.ema[periods[3]];
    wasBullish = typeof wasBullish === 'undefined' ? isBullish : wasBullish;
    console.log(`${new Date().toISOString()} LAST: ${candle.price} EMA ${periods[0]}: ${candle.ema[periods[0]]} EMA ${periods[3]}: ${candle.ema[periods[3]]} ${isBullish ? 'BULLISH' : 'BEARISH'}`);
    if (isBullish && !wasBullish) {
      console.log('Crossover!');
      !position && !placed && longTrend(candle) && buy(candle);
    }
    wasBullish = isBullish;
    console.log('--------------------------------------------------');
  }
}

const errorHandler = function(err) {
  return console.log({error: err});
}

ethereumChart.on('change', changeHandler);
ethereumChart.on('close', closeHandler);
ethereumChart.on('error', errorHandler);
