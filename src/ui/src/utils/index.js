export const filterOutUnsoldBuys = (fills) => {
  let buys = [];
  let ret = [];
  for (const i in fills) {
    if (fills[i].side === 'buy') {
      buys.push(fills[i]);
    } else if (fills[i].side === 'sell') {
      ret = [...ret, ...buys, fills[i]];
      buys = [];
    }
  }
  return ret;
}

export const sumSide = (side, fills) => {
  return fills.reduce((acc, fill) => {
    if (fill.side === side) {
      return acc + (fill.price * fill.size);
    }
    return acc;
  }, 0);
}

export const computeProfit = (fills) => {
  const countedFills = filterOutUnsoldBuys(fills);
  const totalBuys = sumSide('buy', countedFills);
  const totalSells = sumSide('sell', countedFills);
  return totalSells - totalBuys;
}

export const computeProfitPercent = (fills) => {
  const countedFills = filterOutUnsoldBuys(fills);
  const totalBuys = sumSide('buy', countedFills);
  const totalProfit = computeProfit(fills);
  const percentProfit = totalBuys ? (totalProfit / totalBuys) * 100 : 0;
  return percentProfit;
}
