import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
