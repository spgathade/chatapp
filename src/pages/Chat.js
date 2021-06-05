import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import Message from '../components/ChatWIndow/Message/Message';
import Top from '../components/ChatWIndow/Top/Top';
import Bottom from '../components/ChatWIndow/Bottom/Bottom';
import { useRooms } from '../Context/Romcontext';
import { CurrentRoomProvider } from '../Context/CurrentRoomContext';
import { TransformtoArr } from '../misc/Helper';
import { auth } from '../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical content="Loading" size="md" speed="slow" />;
  }

  const CurrentRooms = rooms.find(room => room.id === chatId);

  if (!CurrentRooms) {
    return <h6 className="text-center mt-page">Chat Not Found.</h6>;
  }

  const { name, description } = CurrentRooms;

  const admin = TransformtoArr(CurrentRooms.admin);

  const isAdmin = admin.includes(auth.currentUser.uid);
  const fcmUsers = TransformtoArr(CurrentRooms.fcmUsers);
  const isRecieving = fcmUsers.includes(auth.currentUser.uid);

  const currentRoomData = {
    name,
    description,
    admin,
    isAdmin,
    isRecieving,
  };

  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <Top />
      </div>
      <div className="chat-middle">
        <Message />
      </div>
      <div className="chat-bottom">
        <Bottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
