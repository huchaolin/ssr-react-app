import React, { Component } from 'react'; //eslint-disable-line
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
 Tabs, Button, List, Avatar, Input, Form, message,
} from 'antd';
import PropTypes from 'prop-types'; // 对于通过props传入的数据进行数据类型校验
import Helmet from 'react-helmet';// 解决个页面title等seo标签
import moment from 'moment';
import loginBg from '../component/images/bg1.jpg';

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
    }
))
@observer
@Form.create({})
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputToken: '',
        };
        this.inputHandler = this.inputHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
    }

    inputHandler(e) {
        this.setState({ inputToken: e.target.value });
    }

    login(token) {
        this.props.appState.login(token)
        .then((res) => {
            console.log(res);
                message.success('登陆成功')
        }).catch(() => {
            message.error('accessToken不正确')
        })
        // this.props.form.setFieldsValue({ token: '' });
        console.log(this.state.inputToken)
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.login(values.token)
          }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{
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
                            top: '42%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)',
                            padding: '0  1rem',
                            maxWidth: '30rem',
                            minWidth: '23rem',
                        }}
                    >
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
                    </div>
                </div>
                <Avatar size={64} icon="user" />
            </div>
        )
    }
}

export default User;
