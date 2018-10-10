import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import {
 Tabs, Button, List, Avatar, Tag,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import AppState from '../../store/app-state';

const { TabPane } = Tabs;
const topicTabs = [{ type: 'good', text: '精华' }, { type: 'share', text: '分享' }, { type: 'ask', text: '问答' }, { type: 'job', text: '招聘' }];
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

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
        <div style={{ margin: '0 1rem' }}>
          <Tabs tabBarExtraContent={<Button>Extra Action</Button>} animated={false}>
            {
              topicTabs.map(tabData => (
                <TabPane tab={tabData.text} key={tabData.type}>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                      <List.Item>
                        {/* <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          // title={<a href="https://ant.design">{item.title}</a>}
                          // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        /> */}
                        <div style={{ lineHeight: '2rem', textAlign: 'middle' }}>
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        <span>11/22</span>
                        <span><Tag color="#2db7f5">置顶</Tag></span>
                        aaaaaaaaaaaaaaaaaaaaaa啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊
                        <span>创建时间/最后回复时间</span>
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
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
export default TopicList;
