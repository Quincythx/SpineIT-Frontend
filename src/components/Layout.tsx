import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../context/AuthContext';

export function Layout() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-bg flex">
        <Sidebar />
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
