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
    const { title, body, editable, color } = this.props;
    return (
      <article className="box-container">
        <section className="box-title-section">
          <span className="box-title">{title}</span>
        </section>
        <section className="box-data-section">
          <span className="box-data" style={color && {color}}>{body}</span>
        </section>
        <section className="box-action-section">
          {editable &&<button className="box-action-button">Edit</button>}
        </section>
      </article>
    );
  }
}

Box.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  editable: PropTypes.bool,
  color: PropTypes.string
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClickRefresh: () => {
//       dispatch(refreshClicked())
//     }
//   }
// }

export default Box;