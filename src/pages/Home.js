import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import SideBar from '../components/DashBoard/SideBar';
import { RoomProvider } from '../Context/Romcontext';
import { useMediaQuery } from '../misc/custom-hooks';
import Chat from './Chat';

const Home = () => {
  const Desktop = useMediaQuery('(min-width: 992px)');
  const { isExact } = useRouteMatch();

  const RenderSideBar = Desktop || isExact;

  return (
    <RoomProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {RenderSideBar && (
            <Col xs={24} md={8} className="h-100">
              <SideBar />
            </Col>
          )}
          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100">
                <Chat />
              </Col>
            </Route>
            <Route>
              {Desktop && (
                <Col xs={24} md={16} className="h-100">
                  <h6 className="text-center mt-page"> Please Select Chat </h6>
                </Col>
              )}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomProvider>
  );
};

export default Home;
