import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import {
 Tabs, Button, List, Avatar, Tag, Spin, Pagination, Card,
} from 'antd';
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
  }
))
@observer
class TopicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: null,
    }
  }

  componentDidMount() {
    const { params } = this.props.match
    this.props.topicStore.fetchTopicDetail(params.id)
      .then((detail) => {
        console.log(detail)
        this.setState({ detail });
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  render() {
    const { detail } = this.state;
    const { topicStore } = this.props;
    const { syncing } = topicStore;
    if (!detail) {
      return <div style={{ textAlign: 'center', padding: '1rem 0' }}>{syncing ? <Spin /> : null}</div>
    }
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
            title={(
              <div>
                <div style={{ marginBottom: '12px' }}>
                  <span>
                    {
                      detail.top ? <Tag color="#2db7f5">置顶</Tag>
                        : (
                          detail.good ? <Tag color="#2db7f5">精华</Tag>
                            : <Tag color="#bfbcbc">{topicBook[detail.tab]}</Tag>
                        )
                    }
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{detail.title}</span>
                </div>
                <div>
                  <span className="topic-detail-subtitle">{`发布于 ${moment(detail.create_at).fromNow()}`}</span>
                  <span className="topic-detail-subtitle">{`作者 ${detail.author.loginname}`}</span>
                  <span className="topic-detail-subtitle">{`${detail.visit_count} 次浏览`}</span>
                  <span className="topic-detail-subtitle">{`来自 ${topicBook[detail.tab]}`}</span>
                </div>
              </div>
            )}
          >
            <div style={{ fontSize: '1.2rem' }} dangerouslySetInnerHTML={{ __html: marked(detail.content) }} />
          </Card>
        </div>
        <div style={{
          margin: '0 1rem',
          backgroundColor: 'white',
          borderRadius: '5px',
        }}
        >
          <Card
            bordered={false}
            title={`${detail.reply_count} 回复`}
            extra={`${moment(detail.last_reply_at).fromNow()}`}
          >
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
};

export default TopicDetails;
