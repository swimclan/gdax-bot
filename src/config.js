module.exports = {
  product: 'ETH-USD',
  timeframe: '2s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  n: 0,
  periods: [50, 500],
  wasBullish: null,
  isBullish: null,
  started: false,
  position: null,
  placed: false,
  limitMargin: 1.005,
  stopMargin: 1.001,
  size: 0.01
}