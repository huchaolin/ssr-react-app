import {
    observable,
    // toJs,
    // computed,
    action,
    extendObservable,
} from 'mobx';

import { get, post } from '../util/wrapAxios';
import { topicSchema } from '../config/variable-config';

const createTopic = topic => ({ ...topicSchema, ...topic })

class Topic {
    constructor(data) {
        extendObservable(this, data); // 把对象data所有属性变为Topic的observable属性
    }
;
    @observable syncing = false;
}
class TopicStore {
    @observable topics;

    @observable syncing;

    constructor({ syncing, topics } = { syncing: false, topics: [] }) {
        this.syncing = syncing;
        this.topics = topics.map(topic => new Topic(createTopic(topic)));
    }
;
    addTopic(topic) {
        this.topics.push(new Topic(createTopic(topic)))
    }

    @action fetchTopics() {
        this.syncing = true;
        return new Promise((resolve, reject) => {
            get('/topics', {
                mdrender: false,
            }).then((res) => {
                if (res.success) {
                    res.data.forEach((topic) => {
                        this.addTopic(topic);
                    });
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
