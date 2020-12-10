import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import './SidebarThread.scss';
import { useDispatch } from 'react-redux';
import { setThread } from '../features/threadSlice';
import db from '../firebase';
import { timeAgo } from '../utils';

const SidebarThread = ({ id, name }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (id) {
      db.collection('threads')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));
    }
  }, [id]);
  return (
    <div
      className="sidebarThread"
      onClick={() =>
        dispatch(
          setThread({
            threadId: id,
            threadName: name,
          })
        )
      }
    >
      <Avatar src={messages[0]?.photo} className="sidebarThread_avatar" />
      <div className="sidebarThread__info">
        <h3>{name}</h3>
        <p>{messages[0]?.message}</p>
      </div>
      {messages[0]?.timestamp && (
        <small className="sidebarThread__timestamp">{timeAgo(messages[0]?.timestamp)}</small>
      )}
    </div>
  );
};

export default SidebarThread;
