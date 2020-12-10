import React, { useEffect, useState } from 'react';
import {
  BorderColorOutlined,
  PhoneOutlined,
  QuestionAnswerOutlined,
  SearchOutlined,
  Settings,
} from '@material-ui/icons';
import './Sidebar.scss';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import SidebarThread from './SidebarThread';
import db, { auth } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import firebase from 'firebase';

const Sidebar = () => {
  const user = useSelector(selectUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    db.collection('threads').onSnapshot((snapshot) =>
      setThreads(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, []);

  const createThread = () => {
    const threadName = prompt('Please Enter Group Name:');
    if (threadName?.trim()) {
      db.collection('threads').add({
        threadName: threadName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: {
          email: user.email,
          displayName: user.displayName,
        },
      });
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__search">
          <SearchOutlined />
          <input type="text" placeholder="search" />
        </div>
        <IconButton onClick={createThread}>
          <BorderColorOutlined />
        </IconButton>
      </div>
      <div className="sidebar__threads">
        {threads.map(({ id, data: { threadName } }) => (
          <SidebarThread key={id} id={id} name={threadName} />
        ))}
      </div>
      <div className="sidebar__bottom">
        <Avatar
          src={user?.photo}
          className="sidebar__bottomAvatar"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>My account</MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              auth.signOut();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        <IconButton className="sidebar__bottomIcon">
          <PhoneOutlined />
        </IconButton>
        <IconButton className="sidebar__bottomIcon">
          <QuestionAnswerOutlined />
        </IconButton>
        <IconButton className="sidebar__bottomIcon">
          <Settings />
        </IconButton>
      </div>
    </div>
  );
};

export default Sidebar;
