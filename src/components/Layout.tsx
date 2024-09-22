import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Button } from './ui/button';

const Layout: React.FC = () => {
  const { user, signIn, signOut } = useSupabase();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Inventory App</Link>
          <nav>
            <Link to="/" className="mr-4">Browse</Link>
            <Link to="/upload" className="mr-4">Upload</Link>
            {user ? (
              <Button onClick={signOut}>Sign Out</Button>
            ) : (
              <Button onClick={signIn}>Sign In with GitHub</Button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          &copy; 2024 Inventory App. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;