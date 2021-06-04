import React, { useState, useCallback } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSave,
  label = 'null',
  placeholder = 'Enter your Name',
  EmptyMsg = 'Input is Empty',
  ...InputProps
}) => {
  const [inpuT, setinput] = useState(initialValue);
  const [Editable, setEditable] = useState(false);

  const InputChange = useCallback(value => {
    setinput(value);
  }, []);

  const EditClick = useCallback(() => {
    setEditable(p => !p);
    setinput(initialValue);
  }, [initialValue]);

  const OnSaveClick = async () => {
    const trimmed = inpuT.trim();
    if (trimmed === '') {
      Alert.info(EmptyMsg, 4000);
    }
    if (trimmed !== initialValue) {
      await onSave(trimmed);
    }
    setEditable(false);
  };

  return (
    <div>
      {label}
      <InputGroup>
        <Input
          {...InputProps}
          placeholder={placeholder}
          value={inpuT}
          disabled={!Editable}
          onChange={InputChange}
        />
        <InputGroup.Button onClick={EditClick}>
          <Icon icon={Editable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {Editable && (
          <InputGroup.Button onClick={OnSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
