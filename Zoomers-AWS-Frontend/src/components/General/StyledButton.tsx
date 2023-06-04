/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Button from '@mui/material/Button';

interface IStyledButton {
  buttonText:string;
  handleClick:React.MouseEventHandler<HTMLButtonElement> | undefined;
  [defaultButtonProps:string]: any;
}

function StyledButton({ buttonText, handleClick, ...props }:IStyledButton) {
  return (
    <Button color="secondary" onClick={handleClick} {...props}>{buttonText}</Button>
  );
}

export default StyledButton;
