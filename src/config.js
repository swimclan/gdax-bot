module.exports = {
  product: 'ETH-USD',
  timeframe: '1s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [100, 1000],
  limitMargin: 1.005,
  stopMargin: 1.002,
  size: 1
}