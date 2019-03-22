module.exports = {
  product: 'ETH-USD',
  timeframe: '1s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [10, 20],
  limitMargin: 1.0001,
  stopMargin: 1.0001,
  size: 5
}