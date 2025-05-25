import { createContext } from 'react';
import { TAuthContext } from './AuthProvider';

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export const DEFAULT_USER = {
  id: '',
  username: '',
  password: '',
};
