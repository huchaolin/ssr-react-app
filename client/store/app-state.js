import {
  observable, computed, action, toJS,
} from 'mobx';
import { get, post } from '../util/wrapAxios';

class AppState {
  @observable user = {
    isLogin: false,
    info: null,
    detail: { recentReplies: [], recentTopics: [], syncing: false },
    collections: { list: [], syncing: false },
  };

  @observable pathBeforeLogin = ''

  constructor({ user, pathBeforeLogin } = {}) {
    if (user) {
      this.user = user;
    };
    if (pathBeforeLogin) {
      this.pathBeforeLogin = pathBeforeLogin;
    }
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, { accessToken })
      .then((res) => {
        if (res.success) {
          // 注意先后顺序
          this.user.info = res.data;
          this.user.isLogin = true;
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`).then((res) => {
        if (res.success) {
          this.user.detail.recentReplies = res.data.recent_replies;
          this.user.detail.recentTopics = res.data.recent_topics;
          resolve();
        } else {
          reject();
        }
        this.user.detail.syncing = false;
      }).catch((err) => {
        this.user.detail.syncing = false;
        reject(err);
      })
    })
  }

  @action getUserCollection() {
    this.user.collections.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`).then((res) => {
        if (res.success) {
          this.user.collections.list = res.data;
          resolve();
        } else {
          reject();
        }
        this.user.collections.syncing = false;
      }).catch((err) => {
        this.user.collections.syncing = false;
        reject(err);
      })
    })
  }

  @action setPathBeforeLogin(path) {
      this.pathBeforeLogin = path;
  }

  // 服务端完成渲染时以json格式拿到数据
  toJson() {
    return {
      user: toJS(this.user),
      pathBeforeLogin: this.pathBeforeLogin,
    }
  }
}

export default AppState;
