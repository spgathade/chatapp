import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../Context/ProfileContext';
import { database } from '../../../misc/firebase';
import AttachmentModal from './AttachmentModal';
import MicBtn from './MicBtn';

function AssembleMessgage(Profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: Profile.name,
      uid: Profile.uid,
      createdAt: Profile.createdAt,
      ...(Profile.avatar ? { avatar: Profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    LikeCount: 0,
  };
}

const Bottom = () => {
  const [input, setInput] = useState('');
  const [Loading, setLoading] = useState(false);

  const { Profile } = useProfile();
  const { chatId } = useParams();

  const ChangeMessage = useCallback(value => {
    setInput(value);
  }, []);

  const onSend = async () => {
    if (input.trim() === '') {
      return;
    }
    const MessageData = AssembleMessgage(Profile, chatId);
    MessageData.text = input;

    const Update = {};

    const messageId = database.ref('messages').push().key;

    Update[`/messages/${messageId}`] = MessageData;
    Update[`rooms/${chatId}/lastMessage`] = {
      ...MessageData,
      msgId: messageId,
    };

    setLoading(true);

    try {
      await database.ref().update(Update);

      setInput('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Alert.error(err.message);
    }
  };

  const KeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSend();
    }
  };

  const AfterUpload = useCallback(
    async files => {
      setLoading(true);

      const updates = {};

      files.forEach(file => {
        const MessageData = AssembleMessgage(Profile, chatId);
        MessageData.file = file;

        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = MessageData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        Alert.error(err.message);
      }
    },

    [Profile, chatId]
  );

  return (
    <InputGroup>
      <AttachmentModal AfterUpload={AfterUpload} />
      <MicBtn AfterUpload={AfterUpload} />
      <Input
        placeholder="Type a Message"
        value={input}
        onChange={ChangeMessage}
        onKeyDown={KeyDown}
      />
      <InputGroup.Button
        color="blue"
        appearance="primary"
        onClick={onSend}
        disabled={Loading}
      >
        <Icon icon="send" />
      </InputGroup.Button>
    </InputGroup>
  );
};

export default Bottom;
