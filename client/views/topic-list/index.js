import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import AppState from '../../store/app-state';

@inject('appState')
@observer
class TopicList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  // 调用完了该函数dev--static才会进行渲染的工作, 放在componentDidMount后面
  bootstrap() {
    return new Promise(((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      }, 100)
    }))
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>话题列表页title</title>
          <meta name="description" content="话题列表页 meta标签" />
        </Helmet>
      <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
export default TopicList;
