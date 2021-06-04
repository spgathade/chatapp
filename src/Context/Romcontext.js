import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../misc/firebase';
import { TransformToArraywithID } from '../misc/Helper';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [Room, setRoom] = useState(null);

  useEffect(() => {
    const RoomListRef = database.ref('rooms');

    RoomListRef.on('value', snap => {
      const Data = TransformToArraywithID(snap.val());
      setRoom(Data);
    });
    return () => {
      RoomListRef.off();
    };
  }, []);

  return <RoomContext.Provider value={Room}>{children}</RoomContext.Provider>;
};

export const useRooms = () => useContext(RoomContext);
