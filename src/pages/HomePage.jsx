import { useState, useEffect } from 'react';
import { UserCheck, Users, FileText, ArrowRight, X } from 'lucide-react';

const defaultSlides = ['/assets/a.jpg', '/assets/b.jpg'];

// Lazy dynamic glob import (non-blocking, resolves in the background)
const slideGlob = import.meta.glob('/src/assets/slideshow/*.{jpg,jpeg,png,webp}');

export const HomePage = ({ setActiveTab }) => {
  const [slides, setSlides] = useState(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Trigger modal on first mount with smooth CSS transitions
  useEffect(() => {
    const hasDismissed = sessionStorage.getItem('dismissed_aavishkar_popup');
    if (!hasDismissed) {
      const openTimer = setTimeout(() => {
        setShowPosterModal(true);
        requestAnimationFrame(() => {
          setTimeout(() => setAnimateIn(true), 50);
        });
      }, 400);

      return () => clearTimeout(openTimer);
    }
  }, []);

  const handleDismissModal = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setShowPosterModal(false);
      sessionStorage.setItem('dismissed_aavishkar_popup', 'true');
    }, 200);
  };

  const handleGoToAavishkar = () => {
    handleDismissModal();
    if (setActiveTab) {
      setActiveTab('aavishkar');
    }
  };

  // Resolve slideshow images asynchronously in background
  useEffect(() => {
    const loadSlides = async () => {
      const globKeys = Object.keys(slideGlob);
      if (globKeys.length === 0) return;

      try {
        const modules = await Promise.all(
          Object.values(slideGlob).map((importer) => importer())
        );
        const resolvedUrls = modules.map((mod) => mod.default || mod);
        if (resolvedUrls.length > 0) {
          setSlides(resolvedUrls);
        }
      } catch (err) {
        console.error('Failed to load dynamic slides, using defaults:', err);
      }
    };

    loadSlides();
  }, []);

  // Carousel rotation interval
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const quickGuides = [
    {
      title: 'Looking for Teammates?',
      desc: 'Browse individual innovator profiles by skill or branch to complete your squad.',
      cta: 'Find Innovators',
      action: () => setActiveTab('directory'),
      icon: UserCheck,
    },
    {
      title: 'Incomplete Squad?',
      desc: 'Post an open squad requirement or join teams currently recruiting specific tech roles.',
      cta: 'View Open Teams',
      action: () => setActiveTab('teams'),
      icon: Users,
    },
    {
      title: 'Ready for Internal SIH?',
      desc: 'Submit your 6-member team details and export the official HOD-approved PDF registration form.',
      cta: 'Submit SIH Registration',
      action: () => setActiveTab('sih'),
      icon: FileText,
    },
  ];

  const achievements = [
    { title: 'META × HF × PyTorch × SST', location: 'BENGALURU', icon: '🚀', tagClass: 'bg-maroon text-white' },
    { title: 'India Innovates Finalists', location: 'DELHI', icon: '🇮🇳', tagClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
    { title: 'Jal Shakti Hackathon Winners', location: '1ST PLACE', icon: '🏆', tagClass: 'bg-yellow-100 text-yellow-800 border border-yellow-300' },
    { title: 'SIH National Finalists', location: 'SMART INDIA HACKATHON', icon: '💡', tagClass: 'bg-purple-50 text-purple-700 border border-purple-200' },
    { title: 'SRCAS Hackathon Finalists', location: 'COIMBATORE', icon: '⚙️', tagClass: 'bg-green-50 text-green-700 border border-green-200' },
    { title: 'Smart Horizon Int. Hackathon', location: 'BENGALURU', icon: '🌍', tagClass: 'bg-orange-50 text-orange-700 border border-orange-200' },
  ];

  return (
    <div className="w-full overflow-x-hidden relative">
      {/* Aavishkar Announcement Modal */}
      {showPosterModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs transition-opacity duration-300 ease-out ${
            animateIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Backdrop dismissal */}
          <div className="fixed inset-0" onClick={handleDismissModal} />

          {/* Modal Card */}
          <div
            className={`relative flex flex-col max-h-[88vh] w-auto overflow-hidden rounded-2xl bg-white shadow-2xl border border-neutral-200 transition-all duration-300 ease-out transform ${
              animateIn
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            {/* Top Close Button */}
            <button
              onClick={handleDismissModal}
              aria-label="Close Announcement"
              className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/90 text-white rounded-full p-1.5 backdrop-blur-md transition cursor-pointer shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Poster Container */}
            <div className="flex-1 min-h-0 flex items-center justify-center bg-neutral-900 overflow-hidden">
              <img
                src="/aavishkar-poster.jpg"
                alt="Aavishkar 2026 Announcement"
                onError={(e) => {
                  e.target.src = '/Aavishkar.jpg';
                }}
                className="max-h-[calc(88vh-55px)] w-auto object-contain block select-none"
              />
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-2.5 sm:p-3 bg-white border-t border-neutral-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleDismissModal}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 px-2 py-1.5 cursor-pointer transition"
              >
                Dismiss
              </button>
              <button
                onClick={handleGoToAavishkar}
                className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow cursor-pointer"
              >
                Go to Aavishkar Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Viewport Hero */}
      <section className="relative w-full min-h-[calc(100vh-140px)] lg:min-h-screen flex flex-col justify-center items-center text-center bg-neutral-950 px-4 pt-4 pb-10 sm:py-16">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {slides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Club Background"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/75 z-10" />
        </div>

        <div className="relative z-20 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl font-poppins leading-tight">
            Collaborate. Innovate. Dominate.
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed px-2">
            The central hub for hackathon squads, innovator matchmaking, and internal SIH team registrations.
          </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 pt-2 sm:pt-4 w-full sm:w-auto">
  {/* SIH Portal - Maroon Glass */}
  <button
    onClick={() => setActiveTab('sih')}
    className="w-full sm:w-auto bg-red-950/40 hover:bg-red-900/50 text-red-200 hover:text-white border border-red-500/30 hover:border-red-400/60 font-bold px-7 py-3 rounded-xl uppercase tracking-wider shadow-lg hover:shadow-red-950/30 backdrop-blur-md transition-all cursor-pointer text-xs sm:text-sm"
  >
    SIH 2026 Portal
  </button>

  {/* Aavishkar Portal - Amber Glass */}
  <button
    onClick={() => setActiveTab('aavishkar')}
    className="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/40 hover:border-amber-400/70 font-bold px-7 py-3 rounded-xl uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 backdrop-blur-md transition-all cursor-pointer text-xs sm:text-sm"
  >
    Aavishkar 2026 Portal
  </button>

  {/* Find Innovators - Neutral Glass */}
  <button
    onClick={() => setActiveTab('directory')}
    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/40 hover:border-white/60 font-bold px-7 py-3 rounded-xl uppercase tracking-wider shadow-xl backdrop-blur-md transition-all cursor-pointer text-xs sm:text-sm"
  >
    Find Innovators
  </button>
</div>
        </div>
      </section>

      {/* Quick Action Guides */}
      <section className="bg-white border-b border-neutral-200 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickGuides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div
                key={idx}
                className="bg-[#fffdfb] border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-maroon flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base sm:text-lg text-neutral-900 mb-2">{guide.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-6">{guide.desc}</p>
                </div>
                <button
                  onClick={guide.action}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon hover:text-maroon-dark uppercase tracking-wider transition cursor-pointer"
                >
                  {guide.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hall of Achievements */}
      <section className="bg-[#fffdfb] w-full pt-12 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="border-b border-neutral-200 pb-3 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-maroon uppercase tracking-wide">
                Hall of Achievements
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                Celebrating our national stages and hackathon podiums.
              </p>
            </div>
          </div>

          <div className="w-full overflow-hidden py-4">
            <div className="marquee-track flex gap-4">
              {[...achievements, ...achievements].map((item, idx) => (
                <div
                  key={idx}
                  className="w-64 sm:w-72 bg-white rounded-xl p-5 border border-neutral-200 shadow-xs flex flex-col items-center text-center shrink-0 hover:shadow-md transition"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-sm text-neutral-900 mb-3">{item.title}</h4>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded ${item.tagClass}`}>
                    {item.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};