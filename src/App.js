import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Login from './Account/Login';
import Register from './Account/Register';
import Profile from './Account/Profile';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-grow p-4">
          {/* Main content area */}
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile/:userId" component={Profile} />
            {/* Add other routes here */}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;