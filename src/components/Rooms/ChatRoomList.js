import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite';
import { useRooms } from '../../Context/Romcontext';
import Roomitem from './Roomitem';

const ChatRoomList = ({ aboveElHeight }) => {
  const rooms = useRooms();
  const Location = useLocation();

  return (
    <div className="h-100">
      <Nav
        appearance="subtle"
        vertical
        reversed
        className="overflow-y-scroll custom-scroll overflow-auto"
        style={{
          height: `calc(100% - ${aboveElHeight}px)`,
        }}
        activeKey={Location.pathname}
      >
        {!rooms && (
          <Loader center vertical content="Loading" speed="slow" size="md" />
        )}
        {rooms &&
          rooms.length > 0 &&
          rooms.map(room => (
            <Nav.Item
              key={room.id}
              componentClass={Link}
              to={`/chat/${room.id}`}
              eventKey={`/chat/${room.id}`}
            >
              <Roomitem room={room} />
            </Nav.Item>
          ))}
      </Nav>
    </div>
  );
};
export default ChatRoomList;
