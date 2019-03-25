import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, mapDispatchToProps } from 'react-redux';
import {ENTER_KEY} from '../../constants';
import 'font-awesome/scss/font-awesome.scss';
import './box.scss';

class Box extends Component {
  constructor(props) {
    super();
    this.state = {
      editing: false,
      userValue: null
    }
    this.onClickEdit = this.onClickEdit.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.onBoxInputChange = this.onBoxInputChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.boxInputRef = React.createRef();
  }

  componentDidMount() {
    const { body } = this.props;
    this.setState({ userValue: body });
  }

  onClickEdit() {
    const { body } = this.props;
    this.setState({ editing: true, userValue: body }, () => this.boxInputRef.current.focus());
  }

  updateValue() {
    const { onEdit } = this.props;
    const { userValue } = this.state;
    if (onEdit) {
      onEdit(userValue);
    }
    this.setState({ editing: false });
  }

  onKeyUp({keyCode}) {
    if (keyCode === ENTER_KEY) {
      this.updateValue();
    }
  }

  onBoxInputChange({target: { value }}) {
    this.setState({ userValue: value });
  }

  render() {
    const { title, body, editable, color } = this.props;
    const { userValue } = this.state;
    return (
      <article className="box-container">
        <section className="box-title-section">
          <span className="box-title">{title}</span>
        </section>
        <section className="box-data-section">
          {!this.state.editing && <span className="box-data" style={color && {color}}>{body}</span>}
          {this.state.editing && <input ref={this.boxInputRef} onBlur={this.updateValue} onKeyUp={this.onKeyUp} value={userValue} onChange={this.onBoxInputChange} className="box-data-input" />}
        </section>
        <section className="box-action-section">
          {editable &&<button onClick={this.onClickEdit} className="box-action-button">Edit</button>}
        </section>
      </article>
    );
  }
}

Box.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  editable: PropTypes.bool,
  onEdit: PropTypes.func,
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