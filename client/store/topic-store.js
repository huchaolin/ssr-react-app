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

    constructor({ syncing, topics } = { syncing: false, topics: [] }) {
        this.syncing = syncing;
        this.topics = topics.map(topic => createTopic(topic));
    };

    @action fetchTopics() {
        this.syncing = true;
        return new Promise((resolve, reject) => {
            get('/topics', {
                mdrender: false,
            }).then((res) => {
                if (res.success) {
                    // 防止多次变化导致的重复渲染
                    let topicsArr = [];
                    topicsArr = res.data.map(topic => createTopic(topic));
                    this.topics = this.topics.concat(topicsArr);
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

    toJson() {
        return {
          topics: this.topics,
          syncing: this.syncing,
        }
      }
}

export default TopicStore;
