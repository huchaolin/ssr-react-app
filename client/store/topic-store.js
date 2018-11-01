import {
    observable,
    toJS,
    action,
    extendObservable,
} from 'mobx';

import { get, post } from '../util/wrapAxios';
import { topicSchema, replySchema } from '../config/variable-config';// 事先定义好的接口下的变量

class Reply {
    constructor(data) {
        extendObservable(this, data); // 把对象data所有属性变为Reply的observable属性
    };
}

class Topic {
    constructor(data) {
        extendObservable(this, data); // 把对象data所有属性变为Topic的observable属性
    }
;
}

const createTopic = topic => new Topic({ ...topicSchema, ...topic });
const createReply = reply => new Reply({ ...replySchema, ...reply });

class TopicStore {
    @observable topics = {
        all: [],
        good: [],
        share: [],
        ask: [],
        job: [],
    };

    @observable replys;// 我的回复

    @observable syncing;

    @observable topicDetails;

    @observable tab;

    @observable page;

    constructor({
        syncing = false,
        topics = {},
        replys = [],
        topicDetails = {},
        tab = 'all',
        page = 1,
    } = {}) {
        this.syncing = syncing;
        this.topicDetails = topicDetails;
        this.tab = tab;
        this.page = page;
        this.replys = replys.map(reply => createReply(reply));
        // 初始化每一个标签页所对应的数组
        const topicsKeys = Object.keys(topics);
        if (topicsKeys.length > 0) {
            topicsKeys.forEach((key) => {
                if (topics[key].length > 0) {
                    this.topics[key] = topics[key].map(topic => createTopic(topic));
                }
            })
        }
    };

    @action fetchTopics(tab = 'all', page = 1) {
        this.syncing = true;
        return new Promise((resolve, reject) => {
            if (this.tab === tab && this.page === page && this.topics[tab].length !== 0) {
                resolve();
                this.syncing = false;
            } else {
                this.tab = tab;
                this.page = page;
                const params = { mdrender: false, page };
                if (!!tab && tab !== 'all') {
                    params.tab = tab;
                };
                get('/topics', params).then((res) => {
                    if (res.success) {
                        // 防止多次变化导致的重复渲染
                        let topicsArr = [];
                        topicsArr = res.data.map(topic => createTopic(topic));
                        this.topics[tab] = topicsArr;
                        resolve();
                    } else {
                        reject();
                    }
                    this.syncing = false;
                }).catch((err) => {
                    reject(err);
                    this.syncing = false;
                })
            }
        })
    }

    @action initTopicDetails() {
        this.topicDetails = {};
    }

    @action fetchTopicDetail(id, isLogin = false) {
        return new Promise((resolve, reject) => {
            if (this.topicDetails[id]) {
                resolve(this.topicDetails[id]);
            } else {
                this.syncing = true;
                const params = { mdrender: false };
                if (isLogin) {
                    params.needAccessToken = true;
                }
                get(`/topic/${id}`, params).then((res) => {
                    if (res.success) {
                        this.topicDetails[res.data.id] = res.data;
                        resolve(res.data);
                    } else {
                        reject();
                    };
                    this.syncing = false;
                }).catch((err) => {
                        reject(err);
                        this.syncing = false;
                })
            }
        })
    }

    @action replyNewComment(topic_id, content) {
        return new Promise((resolve, reject) => {
            post(`/topic/${topic_id}/replies`, { needAccessToken: true }, { content })
                .then((res) => {
                    if (res.success) {
                        this.replys.unshift(createReply({
                            id: res.reply_id,
                            create_at: Date.now(),
                            content,
                        }))
                        resolve();
                    } else {
                        reject();
                    };
                }).catch((err) => {
                    reject(err);
                })
        })
    }

    @action topicCollect(topic_id, isCollect) {
        return new Promise((resolve, reject) => {
            post(`/topic_collect/${isCollect ? 'collect' : 'de_collect'}`, { needAccessToken: true }, { topic_id })
                .then((res) => {
                    if (res.success) {
                        this.topicDetails[topic_id].is_collect = isCollect;
                        resolve(res);
                    } else {
                        reject(res);
                    };
                }).catch((err) => {
                    reject(err);
                })
        })
    }

    @action createTopic(tab, title, content) {
        return new Promise((resolve, reject) => {
            post('/topics', { needAccessToken: true }, { title, tab, content })
                .then((res) => {
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    };
                }).catch((err) => {
                    reject(err);
                })
        })
    }

    toJson() {
        return {
          topics: toJS(this.topics),
          syncing: this.syncing,
          topicDetails: toJS(this.topicDetails),
          replys: toJS(this.replys),
          tab: this.tab,
          page: this.page,
        }
      }
}

export default TopicStore;
