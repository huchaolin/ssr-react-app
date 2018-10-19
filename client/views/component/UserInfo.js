import React, { Component } from 'react';
import { Button } from 'antd';

class UserInfo extends Component {
    render() {
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
                    Hnode
                </div>
                <div key="signin" style={{ float: 'right', height: '100%', marginLeft: '1rem' }}>
                   <Button type="primary" ghost>登陆</Button>
                </div>
                <div key="topic" style={{ float: 'right', height: '100%' }}>
                    <Button ghost>发表话题</Button>
                </div>
            </div>
    )
  }
}
export default UserInfo;
