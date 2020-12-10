import React from 'react';
import Logo from '../images/telegram.svg';
import { Button } from '@material-ui/core';
import { auth, googleProvider } from '../firebase';
import './Login.scss';
const Login = () => {
  const signin = () => {
    auth
      .signInWithPopup(googleProvider)
      .then(() => {})
      .catch((err) => alert(err.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <div className="login__logo">
          <img src={Logo} alt="Telegram Logo" />
          <h3>Telegram</h3>
        </div>
        <Button onClick={signin}>Sign-in</Button>
      </div>
    </div>
  );
};

export default Login;
