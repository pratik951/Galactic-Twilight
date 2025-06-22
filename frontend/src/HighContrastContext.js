import React, { createContext, useContext, useState } from 'react';

const HighContrastContext = createContext();

export function HighContrastProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);
  return (
    <HighContrastContext.Provider value={{ highContrast, setHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  return useContext(HighContrastContext);
}
