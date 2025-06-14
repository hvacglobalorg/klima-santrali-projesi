// src/context/ProjectContext.js
import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedCityData, setSelectedCityData] = useState(null);

  return (
    <ProjectContext.Provider value={{ selectedCityData, setSelectedCityData }}>
      {children}
    </ProjectContext.Provider>
  );
};
