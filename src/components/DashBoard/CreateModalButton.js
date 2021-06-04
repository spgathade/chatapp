import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import firebase from 'firebase/app';
import { useModalState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';

const CreateModalButton = () => {
  const { StringType } = Schema.Types;

  const Model = Schema.Model({
    name: StringType().isRequired('Group name is required'),
    description: StringType().isRequired('Description is required'),
  });

  const initialState = {
    name: '',
    description: '',
  };
  const { Open, isOpen, Close } = useModalState();
  const [FormValue, setFormValue] = useState(initialState);
  const [Loading, setLoading] = useState(false);
  const FormRef = useRef();

  const FormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const Submit = async () => {
    if (!FormRef.current.check()) {
      return;
    }

    setLoading(true);

    const NewRoomData = {
      ...FormValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admin: {
        [auth.currentUser.uid]: true,
      },
    };
    try {
      await database.ref('rooms').push(NewRoomData);
      setLoading(false);
      setFormValue(initialState);
      Close();
      Alert.success(`${FormValue.name} has been created`, 4000);
    } catch (err) {
      setLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-2">
      <Button block color="green" onClick={Open}>
        <Icon icon="creative" /> Create New Chat Group
      </Button>

      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>New Chat Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={FormChange}
            formValue={FormValue}
            model={Model}
            ref={FormRef}
          >
            <FormGroup>
              <ControlLabel>Group Name</ControlLabel>
              <FormControl name="name" placeholder="Enter Chat Group Name" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter Group Description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={Submit} disabled={Loading}>
            Create New Chat Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateModalButton;
