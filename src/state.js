class State {
  constructor({
    product,
    timeframe,
    periods,
    limitMargin,
    stopMargin,
    size
  } = {}) {
    this.product = product;
    this.timeframe = timeframe;
    this.n = 0;
    this.periods = periods;
    this.wasBullish = null;
    this.isBullish = null;
    this.started = false;
    this.position = null;
    this.placed = false;
    this.placing = false;
    this.limitMargin = limitMargin;
    this.stopMargin = stopMargin;
    this.sellType = null;
    this.limitPrice = null;
    this.stopPrice = null;
    this.bestPrice = 0;
    this.size = size;
    this.queue = {};
    this.candle = null;
  }

  set(key, value) {
    this[key] = value;
  }
}

let instance;

module.exports = function getState(config=null) {
  if (!instance) {
    instance = new State(config);
  }
  return instance;
}

// product: 'ETH-USD',
// timeframe: '10s',
// credentials: {
//   key: process.env.KEY,
//   secret: process.env.SECRET,
//   passphrase: process.env.PASSPHRASE,
// },
// n: 0,
// periods: [10, 20, 50, 100, 500],
// wasBullish: null,
// isBullish: null,
// started: false,
// position: null,
// placed: false,
// limitMargin: 1.0025,
// stopMargin: 1.0015,
// size: 0.01