import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import {
 message, Button, Select, Input, Row, Col,
} from 'antd';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import marked from 'marked';
import './index.css';

const { Option } = Select;

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
});

const topicBook = {
  share: '分享',
  ask: '问答',
  job: '招聘',
  dev: '测试',
};

@inject(stores => (
  {
    topicStore: stores.topicStore,
    appState: stores.appState,
  }
))
@observer
class CreateTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
        title: '',
        content: '',
        tab: 'dev',
    };
    this.uploadTopic = this.uploadTopic.bind(this);
  }

  componentWillMount() {
    const { user } = this.props.appState;
    const { isLogin } = user;
    if (!isLogin) {
        this.redirectToLogin();
    }
  }

  redirectToLogin() {
    const { pathname } = this.props.history.location
    this.props.appState.setPathBeforeLogin(pathname);
    this.props.history.push('/login');
}

  handleChange(key, v) {
      console.log(v);
    this.setState({
        [key]: v,
    })
  }

  uploadTopic() {
    const { user } = this.props.appState;
    const { isLogin } = user;
    if (!isLogin) {
        return message.info('请先登陆')
    };
    const { title, content, tab } = this.state;
    if (!title) {
        return message.info('标题不能为空')
    };
    if (!content) {
        return message.info('内容不能为空')
    };
    this.props.topicStore.createTopic(tab, title, content).then((res) => {
        message.success('发布成功!');
        this.props.history.push('/user');
    });
    return true;
  }

  render() {
      const selectBefore = (
        <Select defaultValue="dev" onChange={v => this.handleChange('tab', v)}>
        {
            Object.keys(topicBook).map(key => <Option value={key}>{topicBook[key]}</Option>)
        }
        </Select>
      );
    return (
        <div style={{
            margin: '1rem auto',
            maxWidth: '86rem',
        }}
        >
            <Helmet>
                <title>用话题创建页</title>
                <meta name="description" content="话题创建页 meta标签" />
            </Helmet>
            <Row gutter={8} type="flex" justify="center">
                <Col className="gutter-row" xs={22} sm={20} md={18}>
                    <div className="create-topic">
                        <Input style={{ marginBottom: '1rem' }} addonBefore={selectBefore} onChange={e => this.handleChange('title', e.target.value)} placeholder="请输入标题" />
                        <SimpleMDE
                          onChange={v => this.handleChange('content', v)}
                          options={{
                                toolbar: false,
                                autoFocus: false,
                                spellChecker: false,
                                placeholder: '编辑话题内容',
                            }}
                        />
                        <Button
                          style={{
                                position: 'absolute',
                                zIndex: '99',
                                right: '1rem',
                                bottom: '4rem',
                            }}
                          icon="enter"
                          type="primary"
                          onClick={this.uploadTopic}
                          ghost
                        >
                            发布
                        </Button>
                    </div>
                </Col>
            </Row>

        </div>
    )
  }
}

CreateTopic.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

export default CreateTopic;
