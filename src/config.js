module.exports = {
  product: 'ETH-USD',
  timeframe: '2s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [10, 200],
  limitMargin: 1.0001,
  stopMargin: 1.0001,
  size: 5
}