import {
  observable, computed, action,
} from 'mobx';
import { get, post } from '../util/wrapAxios';

class AppState {
  @observable user;

  constructor({ user } = {}) {
    this.user = user || ({ isLogin: false, info: '' });
  }

  // @computed get msg() {
  //   return `${this.name} say count is ${this.count}`
  // }
  // ;
  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, { accessToken })
      .then((res) => {
        if (res.success) {
          this.user.isLogin = true;
          this.user.info = res.data;
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(reject)
    })
  }

  // 服务端完成渲染时以json格式拿到数据
  toJson() {
    return {
      user: this.user,
    }
  }
}

export default AppState;
