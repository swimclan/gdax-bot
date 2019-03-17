module.exports = {
  product: 'ETH-USD',
  timeframe: '30s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [10, 100],
  limitMargin: 1.005,
  stopMargin: 1.002,
  size: 0.01
}