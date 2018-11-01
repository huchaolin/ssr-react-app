import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import {
 message, Button, List, Avatar, Tag, Spin, Card, Divider, Icon,
} from 'antd';
import SimpleMDE from 'react-simplemde-editor';
// import 'simplemde/dist/simplemde.min.css';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import moment from 'moment';
import marked from 'marked';
import './index.css';

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
  all: '全部',
  good: '精华',
  share: '分享',
  ask: '问答',
  job: '招聘',
};

@inject(stores => (
  {
    topicStore: stores.topicStore,
    appState: stores.appState,
  }
))
@observer
class TopicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: null,
      newReply: null,
      isCollect: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.replyHandler = this.replyHandler.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
    this.handleCollect = this.handleCollect.bind(this);
  }

  componentDidMount() {
    const { params } = this.props.match;
    const { isLogin } = this.props.appState.user;
    this.props.topicStore.fetchTopicDetail(params.id, isLogin)
    .then((detail) => {
      this.setState({ isCollect: detail.is_collect, detail });
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  handleChange(newReply) {
    this.setState({ newReply })
  }

  handleCollect() {
    const { isLogin } = this.props.appState.user;
    if (!isLogin) {
      return message.info('请先登陆');
    };
    const { params } = this.props.match;
    const { topicDetails } = this.props.topicStore;
    this.setState((state, props) => {
      this.props.topicStore.topicCollect(params.id, !state.isCollect).then((res) => {

      }).catch((res) => {
        this.setState((state1, props1) => ({
          isCollect: !state1.isCollect,
        }));
      });
      return {
        isCollect: !state.isCollect,
      }
    });
    return null
  }

  redirectToLogin() {
    const { pathname } = this.props.history.location
    this.props.appState.setPathBeforeLogin(pathname);
    this.props.history.push('/login');
  }

  replyHandler() {
    const content = this.state.newReply;
    if (!content) {
      message.info('评论不能为空');
    } else {
      const { params } = this.props.match;
      this.props.topicStore.replyNewComment(params.id, content).then(() => {
        this.setState({ newReply: '' })
      });
    }
  }

  render() {
    const { detail, isCollect } = this.state;
    const { replys: myReplys, syncing } = this.props.topicStore;
    const { user } = this.props.appState;
    const { isLogin } = user;
    if (!detail) {
      return <div style={{ textAlign: 'center', padding: '1rem 0' }}>{syncing ? <Spin /> : null}</div>
    };
    return (
      <div style={{
        margin: '1rem auto',
        maxWidth: '86rem',
      }}
      >
        <Helmet>
          <title>话题详情页</title>
          <meta name="description" content="话题列表页 meta标签" />
        </Helmet>
        <div style={{
          margin: '1rem',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
        >
          <Card
            bordered={false}
            extra={isLogin ? (
            <div
              onClick={this.handleCollect}
              className="collect-btn"
            >
            {
              isCollect ? (
                <Icon
                  type="star"
                  theme="filled"
                  style={{
                    position: 'absolute', left: '0', fontSize: '2rem', color: '#fadb14',
                  }}
                />
              ) : (
                <Icon
                  type="star"
                  theme="filled"
                  style={{
                    position: 'absolute', left: '0', fontSize: '2rem', color: 'gray',
                  }}
                />
              )
            }
            </div>
          ) : null}
            title={(
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span>
                    {
                      detail.top ? <Tag color="#2db7f5">置顶</Tag>
                        : (
                          detail.good ? <Tag color="#2db7f5">精华</Tag>
                            : <Tag color="#bfbcbc">{topicBook[detail.tab] ? topicBook[detail.tab] : '测试'}</Tag>
                        )
                    }
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{detail.title}</span>
                </div>
                <div>
                  <span className="topic-detail-subtitle">{`发布于 ${moment(detail.create_at).fromNow()}`}</span>
                  <span className="topic-detail-subtitle">{`作者 ${detail.author.loginname}`}</span>
                  <span className="topic-detail-subtitle">{`${detail.visit_count} 次浏览`}</span>
                  <span className="topic-detail-subtitle">{`来自 ${topicBook[detail.tab] ? topicBook[detail.tab] : '测试'}`}</span>
                </div>
              </div>
            )}
          >
            <div style={{ fontSize: '1.2rem' }} dangerouslySetInnerHTML={{ __html: marked(detail.content) }} />
          </Card>
        </div>
        {
          myReplys.length === 0 ? null
          : (
        <div style={{
          margin: '0 1rem',
          marginBottom: '1rem',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
        >
          <Card
            bordered={false}
            title="我的最新回复"
            extra={`${myReplys.length} 回复`}
          >
              <List
                itemLayout="horizontal"
                dataSource={myReplys}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={user.info.avatar_url} />}
                      title={<div style={{ fontSize: '1.2rem' }}>{user.info.loginname}</div>}
                      description={<div style={{ fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: marked(item.content) }} />}
                    />
                    {moment(item.create_at).fromNow()}
                  </List.Item>
                )}
              />
          </Card>
        </div>
          )
        }
        <div style={{
          margin: '0 1rem',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
        >
          <Card
            bordered={false}
            title={`${detail.reply_count} 回复`}
            extra={`最后回复： ${moment(detail.last_reply_at).fromNow()}`}
          >
          {
            isLogin ? (
          <div style={{ position: 'relative' }}>
            <SimpleMDE
              onChange={this.handleChange}
              value={this.state.newReply}
              options={{
                toolbar: false,
                autoFocus: false,
                spellChecker: false,
                placeholder: '添加新的回复',
              }}
            />
            <Button
              style={{
              position: 'absolute',
              zIndex: '99',
              right: '1rem',
              bottom: '4rem',
              }}
              type="primary"
              onClick={this.replyHandler}
              ghost
            >
              回复
            </Button>
            <Divider />
          </div>
            ) : (
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" ghost onClick={this.redirectToLogin}>
              登陆并回复
              </Button>
            </div>
            )
          }
            {!detail.replies.length ? '暂无回复' : (
              <List
                itemLayout="horizontal"
                dataSource={detail.replies}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.author.avatar_url} />}
                      title={<div style={{ fontSize: '1.2rem' }}>{item.author.loginname}</div>}
                      description={<div style={{ fontSize: '1.1rem' }} dangerouslySetInnerHTML={{ __html: marked(item.content) }} />}
                    />
                    {moment(item.create_at).fromNow()}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
      </div>
    )
  }
}
TopicDetails.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  appState: PropTypes.object.isRequired,
};

export default TopicDetails;
