import AppState from './app-state';
import TopicStore from './topic-store';

export default {
  AppState,
  TopicStore,
}

// 给服务端用的
export const createStoreMap = () => ({
  appState: new AppState(),
  topicStore: new TopicStore(),
})
