import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      {!user && <Footer />}
    </div>
  );
}
