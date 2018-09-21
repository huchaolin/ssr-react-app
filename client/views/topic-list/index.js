import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import { AppState } from '../../store/app-state';

@inject('appState')
@observer
class TopicList extends Component {
  render() {
    return (
      <div>
        {this.props.appState.msg}
      </div>
    )
  }
}
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
}
export default TopicList;
