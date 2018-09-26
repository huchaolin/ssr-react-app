import {
  observable, computed, action,
} from 'mobx';

export default class AppState {
  @observable count = 0;

  @observable name = 'Jack';

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  ;
  @action add() {
    this.count += 1
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
