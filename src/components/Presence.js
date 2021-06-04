import React from 'react';
import { Badge, Tooltip, Whisper } from 'rsuite';
import { usePresence } from '../misc/custom-hooks';

const getColor = Presence => {
  if (!Presence) {
    return 'gray';
  }
  switch (Presence.state) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';

    default:
      return 'gray';
  }
};

const getText = Presence => {
  if (!Presence) {
    return 'Undefined';
  }

  return Presence.state === 'online'
    ? `online`
    : `Last Seen ${new Date(Presence.last_changed).toLocaleDateString()}`;
};

const Presencejs = ({ uid }) => {
  const Presence = usePresence(uid);

  return (
    <div>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>{getText(Presence)}</Tooltip>}
      >
        <Badge
          className="cursor-hover"
          style={{ backgroundColor: getColor(Presence) }}
        />
      </Whisper>
    </div>
  );
};

export default Presencejs;
