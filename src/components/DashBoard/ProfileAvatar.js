import React from 'react';
import { Avatar } from 'rsuite';
import { GetInitials } from '../../misc/Helper';

const ProfileAvatar = ({ name, ...AvatarProps }) => {
  return (
    <div>
      <Avatar circle {...AvatarProps}>
        {GetInitials(name)}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
