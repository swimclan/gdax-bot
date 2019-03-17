module.exports = {
  product: 'ETH-USD',
  timeframe: '30s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [10, 1000],
  limitMargin: 1.0001,
  stopMargin: 1.0001,
  size: 0.01
}