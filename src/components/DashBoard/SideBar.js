import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'rsuite';
import ChatRoomList from '../Rooms/ChatRoomList';
import CreateModalButton from './CreateModalButton';
import DashboardToggle from './DashboardToggle';

const SideBar = () => {
  const TopSideBarRef = useRef();
  const [Height, setHeight] = useState(0);

  useEffect(() => {
    if (TopSideBarRef.current) {
      setHeight(TopSideBarRef.current.scrollHeight);
    }
  }, [TopSideBarRef]);

  return (
    <div className="h-100 pt-2">
      <div ref={TopSideBarRef}>
        <DashboardToggle />
        <CreateModalButton />
        <Divider>Join Conversation</Divider>
      </div>
      <ChatRoomList aboveElHeight={Height} />
    </div>
  );
};

export default SideBar;
