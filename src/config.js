module.exports = {
  product: 'ETH-USD',
  timeframe: '1m',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [20, 200],
  limitMargin: 1.01,
  stopMargin: 1.002,
  size: 5
}