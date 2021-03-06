import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
 Tabs, List, Avatar, Tag, Spin, Pagination,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import moment from 'moment';

moment.locale('zh-cn');
const { TabPane } = Tabs;
const topicTabs = [{ type: 'all', text: '全部' }, { type: 'good', text: '精华' }, { type: 'share', text: '分享' }, { type: 'ask', text: '问答' }, { type: 'job', text: '招聘' }];
const topicBook = {
  all: '全部',
  good: '精华',
  share: '分享',
  ask: '问答',
  job: '招聘',
};
const total = 2500;
const pageSize = 39;

@inject(stores => (
  {
    topicStore: stores.topicStore,
  }
))
@observer
class TopicList extends Component {
  constructor(props) {
    super(props);
    this.bootstrap = this.bootstrap.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.getQueryTabName = this.getQueryTabName.bind(this);
    this.pageChangeHandler = this.pageChangeHandler.bind(this);
    this.state = {
      currentPage: 1,
    }
  }

  componentDidMount() {
    const tab = this.getQueryTabName();
    const { currentPage: page } = this.state;
    this.props.topicStore.fetchTopics(tab, page);
  }

  getQueryTabName() {
    const key = this.props.location.search.split('=')[1];
    if (topicBook[key]) {
      return key;
    };
    return 'all'
  }

  handleTabChange(tab) {
    this.props.history.push(`/list?tab=${tab}`)
    const { currentPage: page } = this.state;
    this.props.topicStore.fetchTopics(tab, page);
  }

  pageChangeHandler(page) {
    const tab = this.getQueryTabName();
    this.props.topicStore.fetchTopics(tab, page);
    this.setState({
      currentPage: page,
    })
  }

  // 服务端渲染时先调用这个钩子函数在进行数据返回
  bootstrap() {
    // const tab = this.getQueryTabName();
    // return this.props.topicStore.fetchTopics(tab, this.state.currentPage);
    // 网速快的环境可以考虑服务端渲染时将需要请求的数据先在此请求后再返回前端html
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

  render() {
    const { topicStore } = this.props;
    const { topics, syncing } = topicStore;
    const activeTab = this.getQueryTabName();
    return (
      <div style={{
        margin: '1rem auto',
        maxWidth: '86rem',
      }}
      >
        <Helmet>
          <title>话题列表页</title>
          <meta name="description" content="话题列表页 meta标签" />
        </Helmet>
        <div style={{
          margin: '1rem',
          backgroundColor: 'white',
          borderRadius: '5px',
          padding: '0 1rem',
        }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={this.handleTabChange}
            size="large"
            tabBarStyle={{ margin: '0 0 5px 0' }}
            animated={false}
          >
            {topicTabs.map(tabData => (
              <TabPane tab={tabData.text} key={tabData.type}>
                {
                  topics[tabData.type].length === 0 ? <div style={{ textAlign: 'center', padding: '1rem 0' }}>{syncing ? <Spin /> : null}</div>
                    : (
                    <List
                      itemLayout="horizontal"
                      dataSource={topics[tabData.type]}
                      renderItem={topicsItem => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={topicsItem.author.avatar_url} />}
                            title={(
                              <div>
                                {

                                  topicsItem.top ? <Tag color="#2db7f5">置顶</Tag>
                                    : (
                                      topicsItem.good ? <Tag color="#2db7f5">精华</Tag>
                                        : <Tag color="#bfbcbc">{topicBook[topicsItem.tab]}</Tag>
                                    )
                                }

                                <Link to={`/topic-details/${topicsItem.id}`}>{topicsItem.title}</Link>
                              </div>
                            )}
                            description={(
                              <div>
                                <span style={{ paddingRight: '1rem' }}>{topicsItem.author.loginname}</span>
                                <span style={{ paddingRight: '1rem' }}>{`${topicsItem.reply_count}/${topicsItem.visit_count}`}</span>
                                <span style={{ paddingRight: '1rem' }}>{moment(topicsItem.create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                              </div>
                            )}
                          />
                          <div style={{ height: '2.9rem', lineHeight: '2.9rem' }}>
                            {moment(topicsItem.last_reply_at).fromNow()}
                          </div>
                        </List.Item>
                      )}
                    />
                  )
                }
              </TabPane>
            ))
            }
          </Tabs>
          <div style={{ padding: '1rem 0' }}>
            <Pagination current={this.state.currentPage} total={total} pageSize={pageSize} onChange={this.pageChangeHandler} />
          </div>
        </div>
      </div>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
};

export default TopicList;
