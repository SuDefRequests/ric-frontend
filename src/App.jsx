import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { TeamsPage } from './pages/TeamsPage';
import { SihPortalPage } from './pages/SihPortalPage';
import { HackathonPage } from './pages/HackathonPage';
import { AccountPage } from './pages/AccountPage';
import { AavishkarPortal } from './pages/AavishkarPortal';

const TAB_ROUTES = {
  '/home': 'home',
  '/': 'home',
  '/directory': 'directory',
  '/teams': 'teams',
  '/sih': 'sih',
  '/comps': 'comps',
  '/account': 'account',
  '/aavishkar': 'aavishkar',
};

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if (TAB_ROUTES[rawPath]) {
      return TAB_ROUTES[rawPath];
    }
    return localStorage.getItem('ric_active_tab') || 'home';
  });

  
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('ric_active_tab', tab);

   
    const path = tab === 'home' ? '/home' : `/${tab}`;
    if (window.location.pathname !== path || window.location.hash) {
      window.history.pushState({ tab }, '', path);
    }
  };


  useEffect(() => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if (rawPath === '/' || rawPath === '') {
      window.history.replaceState({ tab: 'home' }, '', '/home');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const matchedTab = TAB_ROUTES[rawPath] || 'home';
      setActiveTabState(matchedTab);
      localStorage.setItem('ric_active_tab', matchedTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-[#fffdfb]">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="grow w-full">
          {activeTab === 'home' && <HomePage setActiveTab={setActiveTab} />}
          {activeTab === 'directory' && <DirectoryPage />}
          {activeTab === 'teams' && <TeamsPage setActiveTab={setActiveTab} />}
          {activeTab === 'sih' && <SihPortalPage />}
          {activeTab === 'comps' && <HackathonPage />}
          {activeTab === 'account' && <AccountPage setActiveTab={setActiveTab} />}
          {activeTab === 'aavishkar' && <AavishkarPortal setActiveTab={setActiveTab} />}
        </main>

        <footer className="w-full text-center py-8 border-t border-neutral-200 bg-[#fffdfb] space-y-2">
          <p className="text-sm md:text-base text-neutral-700 font-bold tracking-tight">
            Computer Engineering Department, <span className="text-maroon">SE</span>
          </p>
          <p className="text-xs md:text-sm text-neutral-600 font-medium">
            Creation by{' '}
            <span className="font-extrabold text-neutral-900">Flowstate Labs</span> —{' '}
            <a
              href="https://www.linkedin.com/in/suraj-prajapati-a30b83255/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon hover:underline font-bold transition-colors"
            >
              Suraj Prajapati
            </a>{' '}
            &amp;{' '}
            <a
              href="https://www.linkedin.com/in/kunal-patil-38a36337a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon hover:underline font-bold transition-colors"
            >
              Kunal Patil
            </a>
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}