import ReactDOM from 'react-dom';
// import EventComponent from './events/EventComponent';
// import UserSearch from './state/UserSearch';
import UserSearch from './classes/UserSearch';


const App = () => {
  return <div>
    <UserSearch users={[{name: 'kingsley', age: 34}]} />
  </div>
};

ReactDOM.render(<App />, document.querySelector('#root'))