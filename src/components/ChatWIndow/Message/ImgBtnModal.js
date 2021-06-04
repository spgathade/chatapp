import React from 'react';
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

const ImgBtnModal = ({ src, fileName }) => {
  const { Open, isOpen, Close } = useModalState();

  return (
    <div>
      <input
        type="image"
        alt="file"
        src={src}
        className="mw-100 mh-100 w-auto"
        onClick={Open}
      />

      <Modal show={isOpen} onHide={Close}>
        <Modal.Header>
          <Modal.Title>{fileName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <img height="100%" width="100%" alt="file" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <a href={src} target="_blank" rel="noreferrer noopener">
            View Original
          </a>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImgBtnModal;
