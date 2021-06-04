import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
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
import { useModalState } from '../../../misc/custom-hooks';
import { functions } from '../../../misc/firebase';

const SendfcmBtnModal = () => {
  const { chatId } = useParams();

  const { StringType } = Schema.Types;

  const Model = Schema.Model({
    title: StringType().isRequired('Title is required'),
    message: StringType().isRequired('Message is required'),
  });

  const initialState = {
    title: '',
    message: '',
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

    try {
      const sendFcm = functions.httpsCallable('sendFcm');
      await sendFcm({ chatId, ...FormValue });

      setLoading(false);
      setFormValue(initialState);
      Close();

      Alert.info('Notification has been send', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };

  return (
    <>
      <Button appearance="primary" size="xs" onClick={Open}>
        <Icon icon="podcast" /> Broadcast Message
      </Button>

      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>Send notification to group users</Modal.Title>
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
              <ControlLabel>Title</ControlLabel>
              <FormControl name="title" placeholder="Enter message Title..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Message</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="message"
                placeholder="Enter notification Message..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={Submit} disabled={Loading}>
            Publish Message
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendfcmBtnModal;
