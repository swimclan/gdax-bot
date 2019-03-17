import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {refreshClicked, appMounted} from '../../actions';
import Box from '../box';
import './app.scss';

class App extends Component {
  componentDidMount() {
    this.props.onAppMounted();
  }
  render() {
    console.log(this.props.botState);
    return (
      <div className="app-container">
        <header className="app-header">
          <button onClick={this.props.onClickRefresh}>Refresh</button>
        </header>
        <section className="app-body">
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
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
