import React, { createContext, ReactNode, useState } from 'react';

export type TUser = {
  username: string;
  password: string;
};

export type DBUser = {
  id: string;
  username: string;
  password: string;
};

export type TAuthContext = {
  user: DBUser;
  setUser: React.Dispatch<React.SetStateAction<DBUser>>;
};

const DEFAULT_USER = {
  id: '',
  username: '',
  password: '',
};

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  //store state
  const [user, setUser] = useState<DBUser>(DEFAULT_USER);
  //pass types into value
  //functions here
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
