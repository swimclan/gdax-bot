import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {refreshClicked, appMounted, updateBotState} from '../../actions';
import Box from '../box';
import {
  computeProfit,
  computeProfitPercent,
  parsePercentFromString,
  parsePeriodsValuesFromString} from '../../utils';
import './app.scss';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      overallPercent: 0,
      overallProfit: 0
    }
    this.onChangeSize = this.onChangeSize.bind(this);
    this.onChangeLimitMargin = this.onChangeLimitMargin.bind(this);
    this.onChangeStopMargin = this.onChangeStopMargin.bind(this);
    this.onChangeCrossoverPeriods = this.onChangeCrossoverPeriods.bind(this);
  }
  componentDidMount() {
    this.props.onAppMounted();
  }
  calculateOverallChange() {
    const { botState: { fills } } = this.props;
    const profitPercent = computeProfitPercent(fills);
    return profitPercent.toFixed(2);
  } 
  calculateOverallProfit() {
    const { botState: { fills } } = this.props;
    const profit = computeProfit(fills);
    return profit.toFixed(2);
  }
  getCurrentPosition() {
    const { botState: { bot: { position } } } = this.props;
    return position && position.price.toFixed(2);
  }
  getCurrentPrice() {
    const { botState: { bot: { candle } } } = this.props;
    return candle && candle.price ? candle.price.toFixed(2) : null;
  }
  getLimitPrice(type) {
    const { botState: { bot: { limitPrice, stopPrice } } } = this.props;
    if (!limitPrice && !stopPrice) {
      return null;
    }
    return type === 'limit' ? limitPrice.toFixed(2) : stopPrice.toFixed(2);
  }
  getTradeSize() {
    const { botState: { bot: { size } } } = this.props;
    return size;
  }
  getMargin(type) {
    const { botState: { bot: { limitMargin, stopMargin } } } = this.props;
    const ret = type === 'limit' ? (limitMargin-1) * 100 : (stopMargin-1) * 100;
    return ret.toFixed(2);
  }
  getCrossoverPeriods() {
    const { botState: { bot: { periods } } } = this.props;
    let ret = periods.reduce((acc, period) => {
      return `${acc}${period},`
    }, '');
    return ret.slice(0, -1);
  }
  getProduct() {
    const { botState: { bot: { product } } } = this.props;
    return product;
  }
  getTimeframe() {
    const { botState: { bot: { timeframe } } } = this.props;
    return timeframe;
  }

  onChangeSize(size) {
    const { onBoxUpdate } = this.props;
    onBoxUpdate({size: +size})
  }

  onChangeLimitMargin(marginString) {
    const { onBoxUpdate } = this.props;
    onBoxUpdate({limitMargin: 1 + parsePercentFromString(marginString)});
  }

  onChangeStopMargin(marginString) {
    const { onBoxUpdate } = this.props;
    onBoxUpdate({stopMargin: 1 + parsePercentFromString(marginString)});
  }

  onChangeCrossoverPeriods(periodsString) {
    const { onBoxUpdate } = this.props;
    onBoxUpdate({periods: parsePeriodsValuesFromString(periodsString)});
  }
  render() {
    const overallChange = this.calculateOverallChange();
    const overallProfit = this.calculateOverallProfit();
    const currentPosition = this.getCurrentPosition();
    const currentPrice = this.getCurrentPrice();
    const limitPrice = this.getLimitPrice('limit');
    const stopPrice = this.getLimitPrice('stop');
    const tradeSize = this.getTradeSize();
    const limitMargin = this.getMargin('limit');
    const stopMargin = this.getMargin('stop');
    const periods = this.getCrossoverPeriods();
    const product = this.getProduct();
    const timeframe = this.getTimeframe();
    return (
      <div className="app-container">
        <header className="app-header">
          <button className="app-refresh" onClick={this.props.onClickRefresh}>Refresh</button>
        </header>
        <section className="app-body">
          <Box
            title="Overall Change"
            body={`${overallChange > 0 ? '+' : ''}${overallChange}%`}
            editable={false}
            color={overallChange >= 0 ? 'green' : 'red'}
          />
          <Box
            title="Overall Profit"
            body={`$${overallProfit}`}
            editable={false}
            color={overallProfit >= 0 ? 'green' : 'red'}
          />
          <Box
            title="Current Position"
            body={`$${currentPosition || '--'}`}
            editable={false}
          />
          <Box
            title="Current Price"
            body={`$${currentPrice || '--'}`}
            editable={false}
          />
          <Box
            title="Limit Price"
            body={`$${limitPrice || '--'}`}
            editable={false}
          />
          <Box
            title="Stop Price"
            body={`$${stopPrice || '--'}`}
            editable={false}/>
          <Box
            title="Trade Size"
            body={`${tradeSize}`}
            editable={true}
            onEdit={this.onChangeSize}
          />
          <Box 
            title="Limit Margin"
            body={`${limitMargin}%`}
            editable={true}
            onEdit={this.onChangeLimitMargin}
          />
          <Box
            title="Stop Margin"
            body={`${stopMargin}%`}
            editable={true}
            onEdit={this.onChangeStopMargin}
          />
          <Box
            title="Crossover Periods"
            body={`${periods}`}
            editable={true}
            onEdit={this.onChangeCrossoverPeriods}
          />
          <Box
            title="Product"
            body={product}
            editable={false}
          />
          <Box
            title="Timeframe"
            body={timeframe}
            editable={false}
          />
        </section>
        

      </div>
    );
  }
}

App.propTypes = {

}

const mapStateToProps = (state) => {
  return {
    botState: state
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAppMounted: () => {
      dispatch(appMounted())
    },
    onClickRefresh: () => {
      dispatch(refreshClicked())
    },
    onBoxUpdate: (options) => {
      dispatch(updateBotState(options));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
