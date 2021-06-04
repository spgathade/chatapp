import React from 'react';
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../Context/ProfileContext';

const Privateroute = ({ children, ...routeProps }) => {
  const { Loading, Profile } = useProfile();

  if (Loading && !Profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (!Profile && !Loading) {
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default Privateroute;
