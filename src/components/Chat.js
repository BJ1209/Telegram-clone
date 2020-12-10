import React, { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import './Chat.scss';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { MicNoneOutlined, MoreHorizOutlined, SendRounded, TimerOutlined } from '@material-ui/icons';
import { selectThreadId, selectThreadName } from '../features/threadSlice';
import db from '../firebase';
import firebase from 'firebase';
import Message from './Message';
import { timeAgo } from '../utils';
import FlipMove from 'react-flip-move';
import useMutationObserver from '@rooks/use-mutation-observer';

const Chat = () => {
  //taking only these fields from the userObject
  const { uid, email, displayName, photo } = useSelector(selectUser);
  const threadId = useSelector(selectThreadId);
  const threadName = useSelector(selectThreadName);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selftDistructTime, setSelftDistructTime] = useState(0);
  const messagesRef = useRef();

  useMutationObserver(messagesRef, () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  });

  useEffect(() => {
    if (threadId) {
      db.collection('threads')
        .doc(threadId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [threadId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (threadId && input) {
      timeOut(input, uid);
      db.collection('threads').doc(threadId).collection('messages').add({
        email: email,
        photo: photo,
        uid: uid,
        displayName: displayName,
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInput('');
  };

  const timeOut = (input, uid) => {
    if (
      selftDistructTime !== null &&
      selftDistructTime !== '' &&
      selftDistructTime !== 0 &&
      !isNaN(selftDistructTime)
    ) {
      setTimeout(() => {
        db.collection('threads')
          .doc(threadId)
          .collection('messages')
          .where('message', '==', input)
          .where('uid', '==', uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref
                .delete()
                .then(() => console.log('message successfully deleted'))
                .catch((err) => console.log(err.message));
            });
          });
        setInput('');
      }, Number(selftDistructTime) * 1000);
    }
  };

  return (
    threadId && (
      <div className="chat">
        <div className="chat__header">
          <Avatar src={messages[messages.length - 1]?.data?.photo} className="chat__avatar" />
          <div className="chat__headerContent">
            <h3>{threadName}</h3>
            <p>
              Last Seen:{' '}
              {messages[messages.length - 1]?.data?.timestamp &&
                timeAgo(messages[messages.length - 1]?.data?.timestamp)}
            </p>
          </div>
          <IconButton>
            <MoreHorizOutlined />
          </IconButton>
        </div>
        <div ref={messagesRef} className="chat__messages">
          <FlipMove typeName={null}>
            {messages.map(({ id, data }) => (
              <Message key={id} id={data} content={data} />
            ))}
          </FlipMove>
        </div>
        <div className="chat__footer">
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message.."
            />
            <IconButton className="chat__buttonIcon" type="submit">
              <SendRounded />
            </IconButton>
          </form>
          <IconButton
            onClick={() =>
              setSelftDistructTime(
                prompt(
                  'Enter the delay in seconds to self destruct the message. Enter 0 if you do not want to self destruct.'
                )
              )
            }
            className="chat__buttonIcon"
          >
            <TimerOutlined />
          </IconButton>
          <IconButton className="chat__buttonIcon">
            <MicNoneOutlined />
          </IconButton>
        </div>
      </div>
    )
  );
};

export default Chat;
