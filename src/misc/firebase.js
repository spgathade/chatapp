import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBgIhIXfB-F-h71CJSpA-RzKThkU98i4JI',
  authDomain: 'chatapp-be541.firebaseapp.com',
  projectId: 'chatapp-be541',
  storageBucket: 'chatapp-be541.appspot.com',
  messagingSenderId: '392823410338',
  appId: '1:392823410338:web:1f9dc765918d845b9911fb',
  measurementId: 'G-0XMMPVD12K',
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();

export const messaging = firebase.messaging.isSupported()
  ? app.messaging()
  : null;

if (messaging) {
  messaging.usePublicVapidKey(
    'BL5bg8ZpgMYRxmq-tZ5zLnZnNDMLpBlZx3sgK5Wn-jmIVu4EwBLvU6uLsQUPLQs6fIJtcux2EgLgHpGbgKT-BwU'
  );

  messaging.onMessage(data => {
    console.log(data);
  });
}
