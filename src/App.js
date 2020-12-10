import React, { useEffect } from 'react';
import Login from './components/Login';
import { useDispatch, useSelector } from 'react-redux';
import Telegram from './components/Telegram';
import { login, logout, selectUser } from './features/userSlice';
import { auth } from './firebase';
const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // logged in
        const userData = {
          displayName: authUser?.displayName,
          email: authUser?.email,
          photo: authUser?.photoURL,
          phonoNumber: authUser?.phoneNumber,
          uid: authUser?.uid,
        };
        dispatch(login(userData));
      } else {
        // logged out
        dispatch(logout());
      }
    });
  }, []);
  return <div className="app">{!user ? <Login /> : <Telegram />}</div>;
};

export default App;
