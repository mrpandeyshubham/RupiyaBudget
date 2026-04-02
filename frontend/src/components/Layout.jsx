import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col pt-[72px] pb-24 md:pb-8">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
        <Outlet />
      </main>
    </div>
  );
}
