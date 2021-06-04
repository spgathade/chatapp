import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';
import DashBoard from './Drawers';
import { isOfflineForFirestore } from '../../Context/ProfileContext';

const DashboardToggle = () => {
  const { Open, isOpen, Close } = useModalState();
  const Mobile = useMediaQuery('(max-width: 992px)');

  const SignOut = useCallback(() => {
    database
      .ref(`/status/${auth.currentUser.uid}`)
      .set(isOfflineForFirestore)
      .then(() => {
        auth.signOut();
        Alert.info('Signed Out', 4000);
        Close();
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  }, [Close]);

  return (
    <>
      <Button block color="blue" onClick={Open}>
        <Icon icon="dashboard" />
        DashBoard
      </Button>
      <Drawer full={Mobile} show={isOpen} onHide={Close} placement="left">
        <DashBoard SignOut={SignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
