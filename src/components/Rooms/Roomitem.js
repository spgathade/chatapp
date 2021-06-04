import React from 'react';
import TimeAgo from 'timeago-react';
import ProfileAvatar from '../DashBoard/ProfileAvatar';

const Roomitem = ({ room }) => {
  const { createdAt, name, lastMessage } = room;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear"> {name}</h3>
        <TimeAgo
          datetime={
            lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)
          }
          className="text-black-45"
        />
      </div>

      <div className="d-flex align-items-center text-black-70">
        {lastMessage ? (
          <>
            <div className="d-flex align-items-center text-black-70">
              <ProfileAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.name}
                size="sm"
              />
            </div>
            <div className="text-disappear ml-2">
              <div className="italic">{lastMessage.author.name}</div>
              <span>
                <b>{lastMessage.text || lastMessage.file.name}</b>
              </span>
            </div>
          </>
        ) : (
          <span>x</span>
        )}
      </div>
    </div>
  );
};

export default Roomitem;