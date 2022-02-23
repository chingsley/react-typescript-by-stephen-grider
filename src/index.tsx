import ReactDOM from 'react-dom';
// import EventComponent from './events/EventComponent';
// import UserSearch from './state/UserSearch';
// import UserSearch from './classes/UserSearch';
import UserSearch from './refs/UserSearch';


const App = () => {
  return <div>
    <UserSearch  />
  </div>
};

ReactDOM.render(<App />, document.querySelector('#root'))