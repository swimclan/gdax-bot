export const filterOutUnsoldBuys = (fills) => {
  const filtered = [];
  for (const i in fills) {
    if (fills[i].side === 'buy' && fills[i+1] && fills[i+1].side === 'sell') {
      filtered = [...filtered, fills[i], fills[i+1]];
    }
  }
  return filtered;
}

export const sumSide = (side, fills) => {
  return fills.reduce((acc, fill) => {
    if (fill.side === side) {
      return acc + fill.price;
    }
    return acc;
  }, 0);
}
