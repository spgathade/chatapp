import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { UsecurrentRoom } from '../../../Context/CurrentRoomContext';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../DashBoard/ProfileAvatar';
import Presencejs from '../../Presence';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';
import ProfileBtnModal from './ProfileBtnModal';

const renderImage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-20">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your Browser doesnot support the audio element.
      </audio>
    );
  }

  return <a href={file.url}>Download {file.name}</a>;
};

const MessageItem = ({ message, HandleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, file, likes, LikeCount } = message;

  const [SelfRef, Hovered] = useHover();

  const admin = UsecurrentRoom(value => value.admin);
  const isAdmin = UsecurrentRoom(value => value.isAdmin);

  const MsgAuthorAdmin = admin.includes(author.uid);
  const Author = auth.currentUser.uid === author.uid;
  const CanMakeAdmin = isAdmin && !Author;

  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  const isMobile = useMediaQuery('(max-width: 992px)');

  const canShowIcon = isMobile || Hovered;

  return (
    <li
      className={`padded mb-1 cursor-pointer ${Hovered ? 'bg-black-02' : ''}`}
      ref={SelfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <Presencejs uid={author.uid} />

        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          size="xs"
          className="ml-1"
        />

        <ProfileBtnModal
          Profile={author}
          appearance="link"
          className="p-0 mr-2 ml-1 text-black "
        >
          {CanMakeAdmin && (
            <Button block onClick={() => HandleAdmin(author.uid)} color="blue">
              {MsgAuthorAdmin ? 'Remove as Admin' : 'Make admin'}
            </Button>
          )}
        </ProfileBtnModal>

        <TimeAgo datetime={createdAt} className="text-black-45 ml-2" />

        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcon}
          iconName="heart"
          tooltip="Like this Message"
          badgeContent={LikeCount}
          onClick={() => handleLike(message.id)}
        />
        {Author && (
          <IconBtnControl
            isVisible={canShowIcon}
            iconName="close"
            tooltip="Delete this Message"
            onClick={() => handleDelete(message.id, file)}
          />
        )}
      </div>
      {text && <div className="word-break-all">{text}</div>}
      {file && renderImage(file)}
    </li>
  );
};

export default memo(MessageItem);
