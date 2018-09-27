import {
  observable, computed, action,
} from 'mobx';

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'Jack' }) {
    this.count = count;
    this.name = name;
  }

  @observable count;

  @observable name;

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  ;
  @action add() {
    this.count += 1
  }

  // 服务端完成渲染时以json格式拿到数据
  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}

// const appState = new AppState();
// autorun(() => {
//   console.log(AppState.msg)
// });
// setInterval(() => {
//   appState.add()
// }, 1000);

// export default appState;
