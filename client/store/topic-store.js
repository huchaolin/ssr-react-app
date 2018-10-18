import {
    observable,
    // toJs,
    // computed,
    action,
    extendObservable,
} from 'mobx';

import { get, post } from '../util/wrapAxios';
import { topicSchema } from '../config/variable-config';// 事先定义好的接口下的变量


class Topic {
    constructor(data) {
        extendObservable(this, data); // 把对象data所有属性变为Topic的observable属性
    }
    ;
    @observable syncing = false;
}

const createTopic = topic => new Topic({ ...topicSchema, ...topic });

class TopicStore {
    @observable topics;

    @observable syncing;

    @observable topicDetails;

    // constructor({ syncing, topics, topicDetails } = { syncing: false, topics: [], topicDetails: [] }) {
    //     this.syncing = syncing;
    //     this.topics = topics.map(topic => createTopic(topic));
    // };
     constructor({ syncing = false, topics = [], topicDetails = {} } = {}) {
        this.syncing = syncing;
        this.topicDetails = topicDetails;
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

    @action fetchTopicDetail(id) {
        return new Promise((resolve, reject) => {
            if (this.topicDetails[id]) {
                resolve(this.topicDetails[id]);
            } else {
                this.syncing = true;
                const params = { mdrender: false };
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

    toJson() {
        return {
          topics: this.topics,
          syncing: this.syncing,
        }
      }
}

export default TopicStore;
