import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import { Link, Redirect } from 'react-router-dom';
import {
List, Avatar, Row, Col, Card, Spin,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import moment from 'moment';

moment.locale('zh-cn');

@inject(stores => (
    {
        appState: stores.appState,
    }
))
@observer
class User extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.appState.getUserDetail();
        this.props.appState.getUserCollection();
    }

    render() {
        if (!this.props.appState.user.isLogin) {
            const { pathname } = this.props.history.location
            this.props.appState.setPathBeforeLogin(pathname);
            return <Redirect to="/login" />
        }
        const { recentReplies, recentTopics, syncing: syncing1 } = this.props.appState.user.detail;
        const { list: collections, syncing: syncing2 } = this.props.appState.user.collections;
        const listArr = [{
            key: 'recentTopics',
            data: recentTopics,
            title: '最近发布的话题',
            syncing: syncing1,
        }, {
            key: 'recentReplies',
            data: recentReplies,
            title: '新的回复',
            syncing: syncing1,
        }, {
            key: 'collections',
            data: collections,
            title: '收藏的话题',
            syncing: syncing2,
        }];
        return (
            <div>
            <Helmet>
            <title>用户信息页</title>
            <meta name="description" content="用户信息页 meta标签" />
            </Helmet>
            <div style={{
                margin: '1rem auto',
                maxWidth: '86rem',
                padding: '0 1rem',
            }}
            >
               <Row
                 type="flex"
                 justify="space-between"
                 gutter={{
                            xs: 8, sm: 16, md: 24, lg: 32,
                            }}
               >
                   {
                        listArr.map(listItem => (
                            <Col
                              xs={24}
                              sm={12}
                              md={8}
                              key={listItem.key}
                            >
                                    <Card title={listItem.title} bordered={false} headStyle={{ marginTop: '0.5rem' }}>
                                    {
                                         listItem.data.length === 0 ? <div style={{ textAlign: 'center', padding: '1rem 0' }}>{listItem.syncing ? <Spin /> : null}</div>
                                         : (
                                             <List
                                               itemLayout="horizontal"
                                               dataSource={listItem.data}
                                               renderItem={itemData => (
                                                     <List.Item>
                                                         <List.Item.Meta
                                                           avatar={<Avatar src={itemData.author.avatar_url} />}
                                                           title={(
                                                                 <div>
                                                                     <Link to={`/topic-details/${itemData.id}`}>{itemData.title}</Link>
                                                                 </div>
                                                             )}
                                                           description={(
                                                                 <div>
                                                                     <span style={{ paddingRight: '1rem' }}>
                                                                         最新回复：
                                                                         {moment(itemData.last_reply_at).fromNow()}
                                                                     </span>
                                                                 </div>
                                                             )}
                                                         />
                                                     </List.Item>
                                                 )}
                                             />
                                         )
                                    }
                                    </Card>
                            </Col>
                            ))
                   }
               </Row>
            </div>
            </div>
        )
    }
}
User.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
};

export default User;
