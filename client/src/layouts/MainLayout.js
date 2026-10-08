import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingIntro from '../components/LandingIntro';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingIntro />
      <Navbar />
      <main className="flex-1 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
