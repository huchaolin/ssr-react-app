import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import {
  Button, Input, Form, message, Row, Col,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import moment from 'moment';
import loginBg from '../component/images/bg1.jpg';
import './index.css';

const FormItem = Form.Item;

moment.locale('zh-cn');
const topicBook = {
  all: '全部',
  good: '精华',
  share: '分享',
  ask: '问答',
  job: '招聘',
};

@inject(stores => (
    {
        appState: stores.appState,
        topicStore: stores.topicStore,
    }
))
@observer
@Form.create({})
class Login extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
    }

    componentWillMount() {
        if (this.props.appState.user.isLogin) {
            this.props.history.push('/user');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.login(values.token.trim());
            }
        })
    }

    login(token) {
        this.props.appState.login(token)
        .then((res) => {
            console.log(res);
            message.success('登陆成功');
            this.props.topicStore.initTopicDetails();
            const { pathBeforeLogin } = this.props.appState;
            let path = '/user';
            if (pathBeforeLogin) {
                path = pathBeforeLogin;
            };
            this.props.history.push(path);
            }).catch((err) => {
                console.log('err', err)
                message.error('accessToken不正确')
            })
        // this.props.form.setFieldsValue({ token: '' });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return this.props.appState.user.isLogin ? <Redirect to="user" /> : (
            <div>
            <Helmet>
            <title>用户登陆页</title>
            <meta name="description" content="用户登陆页 meta标签" />
            </Helmet>
        <div
          style={{
                margin: '1rem auto',
                maxWidth: '86rem',
                padding: '0 1rem',
            }}
        >
                <div
                  style={{
                        boxShadow: '2px 2px 10px #000',
                        borderRadius: '5px',
                        position: 'relative',
                    }}
                >
                    <img src={loginBg} style={{ width: '100%', borderRadius: '5px', boxShadow: '1px 1px 5px #005' }} alt="" />
                    <div
                      style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            left: '0',
                            top: '0',
                        }}
                    >
                    <Row className="show-later" style={{ height: '90%', opacity: '0' }} type="flex" align="middle" justify="center">
                        <Col xs={20} sm={12} md={8}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem>
                                    {getFieldDecorator('token', {
                                        rules: [{ required: true, message: 'accessToken不能为空' }],
                                    })(
                                        <Input
                                          style={{
                                                marginBottom: '1rem',
                                                textAlign: 'center',
                                                width: '100%',
                                            }}
                                          placeholder="请输入Cnode accessToken"
                                        />,
                                    )}
                                </FormItem>
                                <Button
                                  htmlType="submit"
                                  style={{
                                        marginBottom: '1rem',
                                        width: '100%',
                                    }}
                                  ghost
                                >
                                    登陆
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    </div>
                </div>
        </div>
            </div>
        );
    }
}

Login.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
    topicStore: PropTypes.object.isRequired,
  };

export default Login;
