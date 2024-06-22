import React from 'react';
import { SnackbarProvider } from 'notistack';
import EmailForm from './EmailForm'; // Adjust path as necessary

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className="App">
        <EmailForm />
      </div>
    </SnackbarProvider>
  );
};

export default App;
