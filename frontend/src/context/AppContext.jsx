import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    notifications: [],
    settings: {},
  });

  const addNotification = (notification) => {
    setGlobalState((prev) => ({
      ...prev,
      notifications: [...prev.notifications, notification],
    }));
  };

  const clearNotifications = () => {
    setGlobalState((prev) => ({
      ...prev,
      notifications: [],
    }));
  };

  return (
    <AppContext.Provider value={{ globalState, addNotification, clearNotifications }}>
      {children}
    </AppContext.Provider>
  );
};
