import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import threadReducer from '../features/threadSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    thread: threadReducer,
  },
});
