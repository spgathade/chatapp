import React from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Col, Container, Grid, Icon, Panel, Row } from 'rsuite';
import { auth, database } from '../misc/firebase';

const Signin = () => {
  const SignInProvider = async provider => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
      Alert.success('Signed In', 4000);
    } catch (err) {
      Alert.info(err.message, 4000);
    }
  };

  const FacebookLogin = () => {
    SignInProvider(new firebase.auth.FacebookAuthProvider());
  };

  const GoogleLogin = () => {
    SignInProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to ChatApp</h2>
                <p>Chat, Connect, Confidence</p>
              </div>
              <div className="mt-3">
                <Button block onClick={GoogleLogin}>
                  <Icon icon="google" />
                  <> </>
                  Continue with Google
                </Button>
                <Button block color="blue" onClick={FacebookLogin}>
                  <Icon icon="facebook" />
                  <> </>
                  Continue with Facebook
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default Signin;
