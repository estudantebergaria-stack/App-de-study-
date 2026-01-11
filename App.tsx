import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppWithAuth from './AppWithAuth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
};

export default App;
