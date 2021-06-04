import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { UsecurrentRoom } from '../../../Context/CurrentRoomContext';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import EditableInput from '../../EditableInput';
import { database } from '../../../misc/firebase';

const EditRoomModal = () => {
  const { Open, isOpen, Close } = useModalState();

  const Mobile = useMediaQuery('(max-width: 992px)');

  const name = UsecurrentRoom(v => v.name);
  const description = UsecurrentRoom(v => v.description);

  const { chatId } = useParams();

  const UpdateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Sucessfully Updated', 4000);
      })
      .catch(err => Alert.error(err.message, 4000));
  };

  const onSavename = newName => {
    UpdateData('name', newName);
  };

  const onSaveDescription = newDesc => {
    UpdateData('description', newDesc);
  };

  return (
    <div>
      <Button className="br-circle" size="sm" color="red" onClick={Open}>
        a
      </Button>

      <Drawer full={Mobile} show={isOpen} onHide={Close} placement="right">
        <Drawer.Header>
          <Drawer.Title>Edit Room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onSavename}
            label={<h6 className="mb-2">Name</h6>}
            EmptyMsg="Name cannot be Empty"
          />
          <br />
          <EditableInput
            componentClass="textarea"
            onSave={onSaveDescription}
            label={<h6 className="mb-2">Description</h6>}
            initialValue={description}
            EmptyMsg="Description cannot be Empty"
            rows={5}
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={Close}>
            Close
          </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomModal);
