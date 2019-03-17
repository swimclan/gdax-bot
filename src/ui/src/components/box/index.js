import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'react-redux';
import './box.scss';

class Box extends Component {
  constructor(props) {
    super();
    this.state = {
      editing: false
    }
  }

  render() {
    return (
      <article className="box-container">
        <section className="box-title-section">
          <span className="box-title">Percent Change</span>
        </section>
        <section className="box-data-section">
          <span className="box-data">1.02%</span>
        </section>
        <section className="box-action-section">
          <button className="box-action-button">Edit</button>
        </section>
      </article>
    );
  }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClickRefresh: () => {
//       dispatch(refreshClicked())
//     }
//   }
// }

export default Box;