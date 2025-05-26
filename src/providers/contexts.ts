import { createContext } from 'react';
import { DBUser, TAuthContext } from './AuthProvider';

export const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export const DEFAULT_IMAGE: string = '/public/assets/react.svg';

export const DEFAULT_USER: DBUser = {
  id: '',
  username: '',
  password: '',
  image: DEFAULT_IMAGE,
  alias: '',
  daysUntilEntryExpires: 'never',
  daysUntilListExpires: 'never',
  theme: 'default',
};
