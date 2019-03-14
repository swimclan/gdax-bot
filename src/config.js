module.exports = {
  product: 'ETH-USD',
  timeframe: '2s',
  credentials: {
    key: process.env.KEY,
    secret: process.env.SECRET,
    passphrase: process.env.PASSPHRASE,
  },
  periods: [50, 500],
  limitMargin: 1.005,
  stopMargin: 1.001,
  size: 0.01
}