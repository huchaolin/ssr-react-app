import React, { Component } from 'react';
import { Button, Avatar, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

@withRouter
@inject(stores => (
    {
        appState: stores.appState,
    }
))
@observer
class TopBar extends Component {
    constructor(props) {
        super(props);
        this.redirectToLogin = this.redirectToLogin.bind(this);
    }

    redirectToLogin() {
        const { pathname } = this.props.history.location
        this.props.appState.setPathBeforeLogin(pathname);
        this.props.history.push('/login');
    }

    render() {
        const { isLogin, info } = this.props.appState.user;
        return (
            <div style={{
                maxWidth: '89rem',
                height: '100%',
                overflow: 'hidden',
                color: 'white',
                margin: '0 auto',
            }}
            >
                <div key="homelogo" style={{ float: 'left', height: '100%', fontSize: '2rem' }}>
                    <Link to="/list" style={{ color: '#fff' }}>
                        <Icon type="home" theme="outlined" />
                        <span style={{ marginLeft: '0.5rem' }}>Hnode</span>
                    </Link>
                </div>
                <div key="signin" style={{ float: 'right', height: '100%', marginLeft: '1rem' }}>
                    {
                        isLogin && info ? (
                            <div style={{ position: 'relative' }}>
                                <Link to="/user">
                                <span style={{
                                    margin: '0 0.5rem', marginRight: '3.5rem', fontSize: '1.2rem', color: '#c7c7c7',
                                    }}
                                >
{info.loginname}
                                </span>
                                    <Avatar
                                      size={36}
                                      src={info.avatar_url}
                                      style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '0',
                                    transform: 'translateY(-50%)',
                                    }}
                                    />
                                </Link>
                            </div>
                            )
                        : <Button onClick={this.redirectToLogin} type="primary" ghost>登陆</Button>
                    }
                </div>
                <div key="topic" style={{ float: 'right', height: '100%' }}>
                    <Button ghost>发表话题</Button>
                </div>
            </div>
    )
  }
}

TopBar.wrappedComponent.propTypes = {
    appState: PropTypes.object.isRequired,
  };

export default TopBar;
