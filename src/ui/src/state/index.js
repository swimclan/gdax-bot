export default {
  bot: {
    product: null,
    timeframe: null,
    n: 0,
    periods: [],
    wasBullish: false,
    isBullish: false,
    started: false,
    position: null,
    placed: false,
    placing: false,
    limitMargin: null,
    stopMargin: null,
    sellType: null,
    limitPrice: null,
    stopPrice: null,
    bestPrice: null,
    size: null,
    queue: {},
    candle: {}
  },
  fills: [],
  errors: []
}