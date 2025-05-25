import React, { ReactNode, useEffect, useState } from 'react';
import { AuthContext, DEFAULT_USER } from './contexts';

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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DBUser>(DEFAULT_USER);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
