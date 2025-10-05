import React, { createContext, useState, useContext } from 'react';

const PreRegistrationContext = createContext();

export const usePreRegistration = () => useContext(PreRegistrationContext);

export const PreRegistrationProvider = ({ children }) => {
  const [preRegData, setPreRegData] = useState(null);

  const value = { preRegData, setPreRegData };

  return (
    <PreRegistrationContext.Provider value={value}>
      {children}
    </PreRegistrationContext.Provider>
  );
};
