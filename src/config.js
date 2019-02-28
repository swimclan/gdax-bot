module.exports = {
  product: 'ETH-USD',
  timeframe: '1s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  n: 0,
  periods: [10, 20],
  wasBullish: null,
  isBullish: null,
  started: false,
  position: null,
  placed: false,
  limitMargin: 1.0025,
  stopMargin: 1.001,
  size: 0.01
}