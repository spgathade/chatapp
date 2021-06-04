import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { UsecurrentRoom } from '../../../Context/CurrentRoomContext';
import { useMediaQuery } from '../../../misc/custom-hooks';
import EditRoomModal from './EditRoomModal';
import GroupModalBtn from './GroupModalBtn';
import SendfcmBtnModal from './SendfcmBtnModal';

const Top = () => {
  const name = UsecurrentRoom(value => value.name);
  const Mobile = useMediaQuery('(max-width : 992px)');
  const Admin = UsecurrentRoom(value => value.isAdmin);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="d-flex align-items-center text-disappear">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              Mobile
                ? 'd-inline block text-blue link-unstyled p-0 mr-2'
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        <ButtonToolbar className="ws-nowrap">
          {Admin && <EditRoomModal />}
        </ButtonToolbar>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        {Admin && <SendfcmBtnModal />}
        <GroupModalBtn />
      </div>
    </div>
  );
};

export default memo(Top);
