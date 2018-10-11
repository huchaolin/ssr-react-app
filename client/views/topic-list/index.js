import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import {
 Tabs, Button, List, Avatar, Tag, Spin,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签

const { TabPane } = Tabs;
const topicTabs = [{ type: 'good', text: '精华' }, { type: 'share', text: '分享' }, { type: 'ask', text: '问答' }, { type: 'job', text: '招聘' }];
const topicBook = {
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
class TopicList extends Component {
  constructor(props) {
    super(props);
    this.bootstrap = this.bootstrap.bind(this);
  }

  componentDidMount() {
    this.props.topicStore.fetchTopics();
  }

  // 调用完了该函数dev--static才会进行渲染的工作, 放在componentDidMount后面
  bootstrap() {
    // this.props.topicStore.fetchTopics();
    setTimeout(() => {
      this.a = 'a'
      console.log('1111111111')
    })
  }

  render() {
    const { topicStore } = this.props;
    const { topics, syncing } = topicStore;
    console.log('刷新')
    console.log('topics', topics)
    if (topics.length === 0) {
      return <div style={{ textAlign: 'center', padding: '1rem 0' }}>{syncing ? <Spin /> : null}</div>
    };
    return (
      <div>
        <Helmet>
          <title>话题列表页title</title>
          <meta name="description" content="话题列表页 meta标签" />
        </Helmet>
        <div style={{
          margin: '1rem', backgroundColor: 'white', borderRadius: '5px', padding: '0 1rem',
        }}
        >
          <Tabs size="large" tabBarStyle={{ margin: '0 0 5px 0' }} tabBarExtraContent={<div style={{ height: '3.4rem', lineHeight: '3.4rem' }}><Button>Extra Action</Button></div>} animated={false}>
            {
              topicTabs.map(tabData => (
                <TabPane tab={tabData.text} key={tabData.type}>
                  <List
                    itemLayout="horizontal"
                    dataSource={topics}
                    renderItem={topicsItem => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={topicsItem.avatar_url} />}
                          title={(
                            <div>
                              {

                                topicsItem.top ? <Tag color="#2db7f5">置顶</Tag>
                                : (
                                  topicsItem.good ? <Tag color="#2db7f5">精华</Tag>
                                : <Tag color="#2db7f5">{topicBook[topicsItem.tab]}</Tag>
                              )
                              }

                              <a href="https://ant.design">{topicsItem.title}</a>
                            </div>
                          )}
                          description={(
                            <div>
                              <span style={{ paddingRight: '1rem' }}>{topicsItem.author.loginname}</span>
                              <span style={{ paddingRight: '1rem' }}>{`${topicsItem.reply_count}/${topicsItem.visit_count}`}</span>
                              <span style={{ paddingRight: '1rem' }}>{topicsItem.create_at}</span>
                            </div>
                          )}
                        />
                        <div style={{ height: '2.9rem', lineHeight: '2.9rem' }}>
                          最后回复：
{topicsItem.last_reply_at}
                        </div>
                      </List.Item>
                    )}
                  />
                </TabPane>
              ))
            }
          </Tabs>
        </div>
      </div>
    )
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
}

export default TopicList;
