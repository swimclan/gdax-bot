module.exports = {
  product: 'ETH-USD',
  timeframe: '30s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  n: 0,
  periods: [10, 500],
  wasBullish: null,
  isBullish: null,
  started: false,
  position: null,
  placed: false,
  limitMargin: 1.0025,
  stopMargin: 1.0015,
  size: 0.01
}