import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {refreshClicked, appMounted} from '../../actions';
import Box from '../box';
import {filterOutUnsoldBuys, sumSide} from '../../utils';
import './app.scss';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      overallPercent: 0,
      overallProfit: 0
    }
  }
  componentDidMount() {
    this.props.onAppMounted();
  }
  calculateOverallChange() {
    const { botState: { fills } } = this.props;
    const countedFills = filterOutUnsoldBuys(fills);
    const totalBuys = sumSide('buy', countedFills);
    const totalSells = sumSide('sell', countedFills);
    const percentChange = totalBuys ? ((totalSells - totalBuys) / totalBuys) * 100 : 0;
    return percentChange.toFixed(2);
  } 
  render() {
    return (
      <div className="app-container">
        <header className="app-header">
          <button onClick={this.props.onClickRefresh}>Refresh</button>
        </header>
        <section className="app-body">
          <Box title="Overall Change" body={`${this.calculateOverallChange()}%`} editable={false}/>
          <Box title="Overall Profit" body="$2.68" editable={false}/>
          <Box title="Current Position" body="$137.82" editable={false}/>
          <Box title="Current Price" body="$137.89" editable={false}/>
          <Box title="Limit Price" body="$138.62" editable={false}/>
          <Box title="Stop Price" body="$137.08" editable={false}/>
          <Box title="Trade Size" body="8" editable={true}/>
          <Box title="Limit Margin" body="0.5%" editable={true}/>
          <Box title="Stop Margin" body="0.1%" editable={true}/>
          <Box title="Crossover Periods" body="50, 500" editable={true}/>
          <Box title="Product" body="ETH-USD" editable={false}/>
          <Box title="Timeframe" body="2s" editable={false}/>
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
