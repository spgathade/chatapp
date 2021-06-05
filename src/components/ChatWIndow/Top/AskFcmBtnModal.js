import React from 'react';
import { useParams } from 'react-router';
import { Button, Icon, IconButton, Modal } from 'rsuite';
import { UsecurrentRoom } from '../../../Context/CurrentRoomContext';
import { useModalState } from '../../../misc/custom-hooks';
import { auth, database } from '../../../misc/firebase';

const AskFcmBtnModal = () => {
  const isRecieving = UsecurrentRoom(v => v.isRecieving);
  const { Open, Close, isOpen } = useModalState();
  const { chatId } = useParams();

  const onCancel = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .remove();
  };

  const onAccept = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .set(true);
  };

  return (
    <>
      <IconButton
        icon={<Icon icon="podcast" />}
        circle
        size="sm"
        color="blue"
        appearance={isRecieving ? 'default' : 'ghost'}
        onClick={Open}
      />

      <Modal show={isOpen} onHide={Close} size="xs" backdrop="static">
        <Modal.Header>
          <Modal.Title>Notification Permission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isRecieving ? (
            <div className="text-center">
              <Icon icon="check-circle" className="text-green mb-3" size="5x" />
              <h6>You are subscribed to the Broadcast Message</h6>
            </div>
          ) : (
            <div className="text-center">
              <Icon
                icon="question-circle"
                className="text-blue mb-3"
                size="5x"
              />
              <h6>Do you want to subscibe to the Broadcast Message ?</h6>
            </div>
          )}
          <p className="mt-2">
            To recieve notification make sure you allow the notification in your
            browser.
          </p>
          <p>
            Permission :{' '}
            {Notification.permission === 'granted' ? (
              <span className="text-green">Granted</span>
            ) : (
              <span className="text-red">Not Granted</span>
            )}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {isRecieving ? (
            <Button color="green" onClick={onCancel}>
              I changed my mind
            </Button>
          ) : (
            <Button color="green" onClick={onAccept}>
              Yes, I do
            </Button>
          )}
          <Button onClick={Close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AskFcmBtnModal;
