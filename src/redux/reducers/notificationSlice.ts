import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export type NotificationProps = {
  alerts: number[];
  show: boolean;
  authAlert: boolean;
};

const initialState: NotificationProps = {
  alerts: [1, 1, 3, 4, 5],
  show: false,
  authAlert: false
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addAlert: (state) => {
      state.alerts = [...state.alerts, state.alerts.length];
    },
    deleteAlert: (state, action: PayloadAction<number>) => {
      const updatedAlerts = [...state.alerts];
      updatedAlerts.splice(action.payload, 1);
      state.alerts = updatedAlerts;
    },
    toggleAlerts: (state) => {
      state.show = !state.show;
    },
    toggleAuthAlert: (state, action: PayloadAction<boolean>) => {
      state.authAlert = action.payload;
    },
  },
});

export const { addAlert, deleteAlert, toggleAlerts, toggleAuthAlert } =
  notificationSlice.actions;

export default notificationSlice.reducer;
