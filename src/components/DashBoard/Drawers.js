import React from 'react';
import { Button, Drawer, Divider, Alert } from 'rsuite';
import { useProfile } from '../../Context/ProfileContext';
import { database } from '../../misc/firebase';
import { GetUserUpdate } from '../../misc/Helper';
import EditableInput from '../EditableInput';
import Provider from './Provider';
import UploadAvatar from './UploadAvatar';

const DashBoard = ({ SignOut }) => {
  const { Profile } = useProfile();

  const onSave = async newData => {
    try {
      const Updates = await GetUserUpdate(
        Profile.uid,
        'name',
        newData,
        database
      );

      await database.ref().update(Updates);

      Alert.success('Nickname is Updated', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h4>Hey, {Profile.name}</h4>
        <Provider />
        <Divider />
        <EditableInput
          name="Nickname"
          initialValue={Profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <UploadAvatar />
      </Drawer.Body>
      <div>
        <Drawer.Footer>
          <Button block color="red" onClick={SignOut}>
            Sign Out
          </Button>
        </Drawer.Footer>
      </div>
    </>
  );
};

export default DashBoard;
