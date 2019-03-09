class State {
  constructor({
    product,
    timeframe,
    n,
    periods,
    wasBullish,
    isBullish,
    started,
    position,
    placed,
    limitMargin,
    stopMargin,
    size
  } = {}) {
    this.product = product;
    this.timeframe = timeframe;
    this.n = n;
    this.periods = periods;
    this.wasBullish = wasBullish;
    this.isBullish = isBullish;
    this.started = started;
    this.position = position;
    this.placed = placed;
    this.placing = false;
    this.limitMargin = limitMargin;
    this.stopMargin = stopMargin;
    this.size = size;
    this.candle = null;
    this.sellType = null;
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