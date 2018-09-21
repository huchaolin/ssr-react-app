import React, { Component } from 'react'; //    eslint-disable-line
import { hot } from 'react-hot-loader';//   eslint-disable-line 
import { Route } from 'react-router-dom';
import TopicList from './topic-list/index';
import TopicDetails from './topic-details/index';

// class App extends Component {
//   render() {
//     return (
//       <div>
//         this is react-app
//       </div>
//     );
//   }
// };
const App = () => (
<div>
    <Route path="/" component={TopicList} exact />
    <Route path="/topic-details" component={TopicDetails} />
</div>
);


export default hot(module)(App);
