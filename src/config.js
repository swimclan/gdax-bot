module.exports = {
  product: 'ETH-USD',
  timeframe: '20m',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [500, 1000],
  limitMargin: 1.01,
  stopMargin: 1.002,
  size: 5
}