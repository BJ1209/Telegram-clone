import React from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import './Telegram.scss';

const Telegram = () => {
  return (
    <div className="telegram">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default Telegram;
