import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBgIhIXfB-F-h71CJSpA-RzKThkU98i4JI',
  authDomain: 'chatapp-be541.firebaseapp.com',
  projectId: 'chatapp-be541',
  storageBucket: 'chatapp-be541.appspot.com',
  messagingSenderId: '392823410338',
  appId: '1:392823410338:web:1f9dc765918d845b9911fb',
  measurementId: 'G-0XMMPVD12K',
});

getMessaging(firebaseApp);
