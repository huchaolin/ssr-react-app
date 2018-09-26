import AppStateClass from './app-state';

export const AppState = AppStateClass;

export default {
  AppState,
}

// 给服务端用的
export const createStoreMap = () => ({
  appState: new AppState(),
})
