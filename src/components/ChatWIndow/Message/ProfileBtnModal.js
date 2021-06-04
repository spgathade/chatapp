import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../DashBoard/ProfileAvatar';

const ProfileBtnModal = ({ Profile, children, ...Btnprops }) => {
  const { Open, isOpen, Close } = useModalState();
  const ShortName = Profile.name.split(' ')[0];

  const { name, avatar, createdAt } = Profile;

  const MemberSince = new Date(createdAt).toLocaleDateString();

  return (
    <div>
      <Button {...Btnprops} onClick={Open}>
        {ShortName}
      </Button>

      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>{ShortName} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>
          <p>Member since {MemberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileBtnModal;
