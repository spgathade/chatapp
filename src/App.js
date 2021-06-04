import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css';
import Privateroute from './components/privateroute';
import Publicroute from './components/publicroute';
import { ProfileProvider } from './Context/ProfileContext';
import Home from './pages/Home';
import Signin from './pages/Signin';
import './styles/main.scss';

function App() {
  return (
    <ProfileProvider>
      <Switch>
        <Publicroute path="/signin">
          <Signin />
        </Publicroute>
        <Privateroute path="/">
          <Home />
        </Privateroute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
