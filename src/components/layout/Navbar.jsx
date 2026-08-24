import { useState, useRef, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import sansthaLogo from '/sanstha-logo.png';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, profile, signInWithGoogle, signOut } = useAuth();

  const isHome = activeTab === 'home';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'directory', label: 'Find Innovators' },
    { key: 'teams', label: 'Registered Teams' },
    { key: 'comps', label: 'Live Hackathons' },
    { key: 'sih', label: 'SIH 2026 Portal' },
    { key: 'account', label: 'My Account' },
  ];

  const handleNavClick = (key) => {
    setActiveTab(key);
    setIsMobileOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header
      className={`w-full z-40 transition-colors duration-300 ${isHome
          ? 'lg:absolute top-0 left-0 bg-neutral-950/90 lg:bg-transparent text-white'
          : 'relative bg-[#fffdfb] text-neutral-900 border-b border-neutral-200 shadow-sm'
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 lg:pt-6 pb-3">

        {/* Top Centered Section: Official College Header Structure */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer text-center flex flex-col items-center justify-center select-none mb-3 lg:mb-5"
        >
          <div className="flex flex-row items-center justify-between sm:justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-5xl px-2">
            {/* Left: College Logo */}
            <img
              src="/logo.png"
              alt="LoGMIEER Logo"
              onError={(e) => { e.target.style.display = 'none'; }}
              className="h-10 sm:h-12 md:h-16 w-auto object-contain drop-shadow-sm shrink-0"
            />

            {/* Center: Official Typography */}
            <div className="flex flex-col items-center text-center">
              {/* Sanstha Name */}
              <span className={`text-[8.5px] sm:text-[11px] md:text-xs font-semibold tracking-wider uppercase leading-tight ${isHome ? 'text-blue-200' : 'text-[#1e3a8a]'
                }`}>
                Krantiveer Vasantrao Narayanrao Naik Shikshan Prasarak Sanstha's
              </span>

              {/* College Name Main Title */}
         {/* Main Title */}
<span className="text-[12px] sm:text-[16px] md:text-[20px] font-black text-[#b91c1c] uppercase tracking-tight leading-tight mt-0.5 font-poppins">
  LOKNETE GOPINATHJI MUNDE
</span>

{/* College Subtitle */}
<span className="text-[9px] sm:text-[12px] md:text-[13px] font-bold text-[#b91c1c] uppercase tracking-tight leading-tight">
  Institute of Engineering Education &amp; Research
</span>

              {/* Accreditation Tagline */}
              <span className={`text-[7.5px] sm:text-[9.5px] md:text-[11px] font-semibold tracking-wide mt-0.5 ${isHome ? 'text-neutral-300' : 'text-[#1e3a8a]'
                }`}>
                Approved by AICTE, Accredited &apos;B&apos; Grade By NAAC
              </span>
            </div>

            {/* Right: Sanstha Crest Logo */}
            <img
              src={sansthaLogo}
              alt="Sanstha Logo"
              onError={(e) => { e.target.style.display = 'none'; }}
              className="h-10 sm:h-12 md:h-16 w-auto object-contain drop-shadow-sm shrink-0"
            />
          </div>
        </div>

        {/* Lower Row: Desktop Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between border-t border-white/20 pt-3.5">
          <div className="w-28"></div> {/* Left spacer */}

          <nav className="flex items-center gap-8 xl:gap-10 text-[14px] md:text-[15px] font-semibold tracking-wide">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`transition pb-1 whitespace-nowrap cursor-pointer ${isActive
                      ? isHome
                        ? 'text-white border-b-2 border-white font-bold'
                        : 'text-maroon border-b-2 border-maroon font-bold'
                      : isHome
                        ? 'text-neutral-300 hover:text-white'
                        : 'text-neutral-600 hover:text-maroon'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Dropdown or Sign In */}
          <div className="flex items-center justify-end w-28">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 py-1 px-3 rounded-xl border transition cursor-pointer text-left ${isHome
                      ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                    }`}
                >
                  <div className="w-6 h-6 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-[10px]">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[70px]">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-neutral-200 text-neutral-800 animate-in fade-in zoom-in-95 duration-100 z-50">
                    <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {profile?.full_name || 'Innovator'}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('account')}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition cursor-pointer ${activeTab === 'account' ? 'bg-maroon text-white' : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                    >
                      <User className="w-4 h-4" />
                      Your Account Profile
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleNavClick('admin');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left hover:bg-neutral-100 text-neutral-700 transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-maroon" />
                      Admin Login
                    </button>

                    <div className="pt-1 mt-1 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 text-xs bg-maroon text-white px-4 py-1.5 rounded-full shadow hover:bg-maroon-dark font-bold uppercase tracking-wider transition border border-red-400/30 whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Header Bar (Clean hamburger trigger) */}
        <div className="flex lg:hidden justify-between items-center border-t border-white/20 pt-2 mt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
            Explore Portal
          </span>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="text-current p-1 focus:outline-none cursor-pointer"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-neutral-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col pt-6 px-6 lg:hidden ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-neutral-700 mb-6">
          <span className="font-bold text-sm tracking-wider uppercase text-neutral-300">Navigation</span>
          <button onClick={() => setIsMobileOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-3 text-left">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`text-sm font-semibold py-2 text-left transition cursor-pointer ${activeTab === item.key ? 'text-white pl-2 border-l-2 border-maroon font-bold' : 'text-neutral-400 hover:text-white'
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pb-8 pt-6 border-t border-neutral-800">
          {user ? (
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-red-400 font-bold text-xs py-3 rounded-lg border border-neutral-700 uppercase cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 bg-maroon text-white font-bold text-xs py-3.5 rounded-xl shadow uppercase tracking-wider cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Sign In with Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
};