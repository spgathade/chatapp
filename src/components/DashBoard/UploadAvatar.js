import React, { useState, useRef } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { useProfile } from '../../Context/ProfileContext';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from './ProfileAvatar';
import { GetUserUpdate } from '../../misc/Helper';

const getBlob = canvas => {
  return new Promise((resolve, reject) =>
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process Error'));
      }
    })
  );
};

const UploadAvatar = () => {
  const { Open, Close, isOpen } = useModalState();
  const [Loading, setLoading] = useState(false);
  const Inputfiletype = '.png, .jpg, .jpeg';
  const AvatarRef = useRef();

  const { Profile } = useProfile();

  const Acceptedfiletype = ['image/png', 'image/jpg', 'image/jpeg'];
  const ValidFile = file => Acceptedfiletype.includes(file.type);

  const [Image, setImage] = useState(null);

  const FileInputChange = ev => {
    const currentFiles = ev.target.files;
    if (currentFiles.length === 1) {
      const file = currentFiles[0];

      if (ValidFile(file)) {
        setImage(file);

        Open();
      } else {
        Alert.warning(`Wrong File type Selected ${file.type}`, 4000);
      }
    }
  };

  const OnUploadClick = async () => {
    const canvas = AvatarRef.current.getImageScaledToCanvas();
    setLoading(true);
    try {
      const blob = await getBlob(canvas);

      const AvatarFileRef = storage
        .ref(`/profiles/${Profile.uid}`)
        .child('avatar');

      const UploadAvatarResult = await AvatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadURL = await UploadAvatarResult.ref.getDownloadURL();

      const Updates = await GetUserUpdate(
        Profile.uid,
        'avatar',
        downloadURL,
        database
      );

      await database.ref().update(Updates);
      setLoading(false);
      Alert.success('Avatar has been uploaded', 4000);
      setLoading(false);
      Close();
    } catch (err) {
      setLoading(false);
      Alert.error(err.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={Profile.avatar}
        name={Profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
      <div>
        <label htmlFor="avatar" className="d-block cursor-pointer padded">
          Select New Avatar
          <input
            id="avatar"
            type="file"
            className="d-none"
            accept={Inputfiletype}
            onChange={FileInputChange}
          />
        </label>
        <Modal show={isOpen} onHide={Close}>
          <Modal.Header>
            <Modal.Title>Upload New Avatar</Modal.Title>
          </Modal.Header>
          <div className="d-flex justify-content-center h-100 align-items-center">
            <Modal.Body>
              {Image && (
                <AvatarEditor
                  ref={AvatarRef}
                  image={Image}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </Modal.Body>
          </div>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={OnUploadClick}
              disabled={Loading}
            >
              Upload Avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UploadAvatar;
