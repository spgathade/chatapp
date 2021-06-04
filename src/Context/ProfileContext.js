import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForFirestore = {
  state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForFirestore = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [Profile, SetProfile] = useState(null);
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    let ProfileRef;
    let userStatusFirestoreRef;
    const AuthUnSub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        ProfileRef = database.ref(`/profiles/${authObj.uid}`);
        ProfileRef.on('value', snap => {
          const { name, createdAt, avatar } = snap.val();

          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };

          SetProfile(data);
          setLoading(false);
        });

        userStatusFirestoreRef = database.ref(`/status/${authObj.uid}`);
        database.ref('.info/connected').on('value', snapshot => {
          if (!!snapshot.val() === false) {
            return;
          }

          userStatusFirestoreRef
            .onDisconnect()
            .set(isOfflineForFirestore)
            .then(() => {
              userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
      } else {
        if (ProfileRef) {
          ProfileRef.off();
        }
        if (userStatusFirestoreRef) {
          userStatusFirestoreRef.off();
        }

        database.ref('.info/connected').off();
        SetProfile(null);
        setLoading(false);
      }
    });
    return () => {
      AuthUnSub();
      database.ref('.info/connected').off();
      if (ProfileRef) {
        ProfileRef.off();
      }
      if (userStatusFirestoreRef) {
        userStatusFirestoreRef.off();
      }
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ Loading, Profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
