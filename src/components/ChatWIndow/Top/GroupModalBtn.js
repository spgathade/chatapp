import React, { memo } from 'react';
import { Button, Modal } from 'rsuite';
import { UsecurrentRoom } from '../../../Context/CurrentRoomContext';
import { useModalState } from '../../../misc/custom-hooks';

const GroupModalBtn = () => {
  const name = UsecurrentRoom(value => value.name);
  const description = UsecurrentRoom(value => value.description);

  const { Open, Close, isOpen } = useModalState();

  return (
    <div>
      <Button className="px-0 text-black" onClick={Open} appearance="link">
        Group Information
      </Button>
      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default memo(GroupModalBtn);
