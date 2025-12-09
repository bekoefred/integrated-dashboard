import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationSlice";
import widgetsReducer from "./reducers/widgetsSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    widgets: widgetsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
