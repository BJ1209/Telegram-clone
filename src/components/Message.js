import React, { forwardRef } from 'react';
import { Avatar } from '@material-ui/core';
import './Message.scss';
import { selectUser } from '../features/userSlice';
import { useSelector } from 'react-redux';
import { timeAgo } from '../utils';
const Message = forwardRef(({ id, content: { email, photo, message, timestamp } }, ref) => {
  const user = useSelector(selectUser);
  return (
    <div ref={ref} className={`message ${user?.email === email ? 'user--message' : ''}`}>
      <Avatar src={photo} className="message__avatar" />
      <p>
        {message}
        {timestamp && (
          <small className={`timestamp ${user?.email === email ? 'user--timestamp' : ''}`}>
            {timeAgo(timestamp)}
          </small>
        )}
      </p>
    </div>
  );
});

export default Message;
