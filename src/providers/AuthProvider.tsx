import React, { createContext, ReactNode } from 'react';

export type User = {
  username: string;
  password: string;
};

export type TAuthContext = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export const AuthContext = createContext({});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  //store state
  //pass types into value
  //functions here
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
