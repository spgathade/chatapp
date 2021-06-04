import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MaxFileSize = 1000 * 1024 * 5;

const AttachmentModal = ({ AfterUpload }) => {
  const { chatId } = useParams();
  const { Open, Close, isOpen } = useModalState();
  const [FileList, setFileList] = useState([]);
  const [Loading, setLoading] = useState(false);

  const onChange = FileArr => {
    const Filtered = FileArr.filter(
      el => el.blobFile.size <= MaxFileSize
    ).slice(0, 5);

    setFileList(Filtered);
  };

  const Upload = async () => {
    try {
      const UploadPromises = FileList.map(f => {
        return storage
          .ref(`/rooms/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, {
            cacheControl: `public , max-age = ${3600 * 24 * 3}`,
          });
      });

      const UploadSnap = await Promise.all(UploadPromises);

      const ShapePromises = UploadSnap.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const Files = await Promise.all(ShapePromises);

      await AfterUpload(Files);

      setLoading(false);
      Close();
    } catch (err) {
      setLoading(false);
      Alert.error(err.message);
    }
  };

  return (
    <div>
      <InputGroup.Button onClick={Open}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            action=""
            draggable
            onChange={onChange}
            disabled={Loading}
            autoUpload={false}
            multiple
            listType="picture-text"
            fileList={FileList}
          >
            <div style={{ lineHeight: '200px' }}>
              Click or Drag files to this area to upload
            </div>
          </Uploader>
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={Loading} onClick={Upload}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AttachmentModal;
