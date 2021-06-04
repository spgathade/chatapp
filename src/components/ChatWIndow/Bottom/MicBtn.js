import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, Icon, InputGroup } from 'rsuite';
import { storage } from '../../../misc/firebase';

const MicBtn = ({ AfterUpload }) => {
  const { chatId } = useParams();
  const [record, setrecord] = useState(false);
  const [loading, setloading] = useState(false);

  const onClick = useCallback(() => {
    setrecord(p => !p);
  }, []);

  const onUpload = useCallback(
    async data => {
      setloading(true);

      try {
        const snap = await storage
          .ref(`/rooms/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public , max-age = ${3600 * 24 * 3}`,
          });

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
        setloading(false);
        AfterUpload([file]);
      } catch (err) {
        setloading(false);
        Alert.error(err.message);
      }
    },
    [AfterUpload, chatId]
  );

  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={loading}
      className={record ? 'animate-blink' : ''}
    >
      <Icon icon="microphone" />
      <ReactMic
        record={record}
        className="d-none"
        onStop={onUpload}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default MicBtn;
