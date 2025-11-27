import React from 'react';

export const NavigationContext = React.createContext<{
  currentPage: string;
  navigate: (page: string) => void;
  currentItemId?: string;
  setCurrentItemId: (id: string) => void;
}>({
  currentPage: 'home',
  navigate: () => {},
  currentItemId: undefined,
  setCurrentItemId: () => {},
});
