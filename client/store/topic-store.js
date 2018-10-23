import {
    observable,
    // toJs,
    // computed,
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
    @observable syncing = false;
}


const createTopic = topic => new Topic({ ...topicSchema, ...topic });
const createReply = reply => new Reply({ ...replySchema, ...reply });

class TopicStore {
    @observable topics;

    @observable replys;// 我的回复

    @observable syncing;

    @observable topicDetails;

    // constructor({ syncing, topics, topicDetails } = { syncing: false, topics: [], topicDetails: [] }) {
    //     this.syncing = syncing;
    //     this.topics = topics.map(topic => createTopic(topic));
    // };
     constructor({
 syncing = false, topics = [], replys = [], topicDetails = {},
} = {}) {
        this.syncing = syncing;
        this.topicDetails = topicDetails;
        this.replys = replys.map(reply => createReply(reply));
        this.topics = topics.map(topic => createTopic(topic));
    };

    @action fetchTopics(tab = 'all', page = 1) {
        this.syncing = true;
        this.topics = [];
        const params = { mdrender: false, page };
        if (!!tab && tab !== 'all') {
            params.tab = tab;
        };
        return new Promise((resolve, reject) => {
            get('/topics', params).then((res) => {
                if (res.success) {
                    // 防止多次变化导致的重复渲染
                    let topicsArr = [];
                    topicsArr = res.data.map(topic => createTopic(topic));
                    this.topics = topicsArr;
                    resolve();
                } else {
                    reject();
                }
                this.syncing = false;
            }).catch((err) => {
                    reject(err);
                    this.syncing = false;
            })
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

    toJson() {
        return {
          topics: this.topics,
          syncing: this.syncing,
          topicDetails: this.topicDetails,
          replys: this.replys,
        }
      }
}

export default TopicStore;
