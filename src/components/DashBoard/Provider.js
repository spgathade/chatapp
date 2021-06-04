import React, { useState } from 'react';
import firebase from 'firebase/app';
import { Alert, Button, Icon, Tag } from 'rsuite';
import { auth } from '../../misc/firebase';

const Provider = () => {
  const [Connected, setConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });

  const UpdateConnected = (providerId, value) => {
    setConnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unLink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You cannot disconnect from ${providerId}`);
      }
      await auth.currentUser.unlink(providerId);
      UpdateConnected(providerId, false);
      Alert.info(`Disconnted from ${providerId}`, 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  const unLinkGoogle = () => {
    unLink('google.com');
  };
  const unLinkFacebook = () => {
    unLink('facebook.com');
  };

  const link = async provider => {
    try {
      await auth.currentUser.linkWithPopup(provider);
      Alert.info(`Linked to ${provider.providerId}`, 4000);

      UpdateConnected(provider.providerId, true);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };
  const LinkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };
  const LinkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };

  return (
    <div>
      {Connected['google.com'] && (
        <Tag closable onClose={unLinkGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {Connected['facebook.com'] && (
        <Tag closable color="blue" onClose={unLinkFacebook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!Connected['google.com'] && (
          <Button block onClick={LinkGoogle}>
            <Icon icon="google" /> Link to Google
          </Button>
        )}
        {!Connected['facebook.com'] && (
          <Button block color="blue" onClick={LinkFacebook}>
            <Icon icon="facebook" /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default Provider;
