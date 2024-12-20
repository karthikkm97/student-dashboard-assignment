import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentsTable from './components/StudentsTable';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">
          <StudentsTable />
          
        </main>
      </div>
    </div>
  );
};

export default App;

