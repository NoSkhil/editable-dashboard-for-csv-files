import React from 'react';
import AppBar from './component/AppBar';
import EditableTable from './component/EditableTable';
import Footer from './component/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <AppBar />
      <EditableTable />
      <Footer />
    </div>
  );
}

export default App;