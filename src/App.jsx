import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { TeamsPage } from './pages/TeamsPage';
import { SihPortalPage } from './pages/SihPortalPage';
import { HackathonPage } from './pages/HackathonPage';
import { AccountPage } from './pages/AccountPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

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