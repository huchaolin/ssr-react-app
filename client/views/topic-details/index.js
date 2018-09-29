import React, {Component} from 'react'; //eslint-disable-line
export default class TopicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      describe: '话题详情页',
    }
  }

  render() {
    return (
            <div>{this.state.describe}</div>
    )
  }
}
