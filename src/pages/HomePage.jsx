import { useState, useEffect } from 'react';
import { UserCheck, Users, FileText, ArrowRight } from 'lucide-react';

// Automatically import all images placed in src/assets/slideshow/ (if using src)
// or fallback gracefully to public assets
const importedSlideImages = import.meta.glob('/src/assets/slideshow/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const autoSlides = Object.values(importedSlideImages);
const defaultSlides = ['/assets/a.jpg', '/assets/b.jpg'];
const finalSlides = autoSlides.length > 0 ? autoSlides : defaultSlides;

export const HomePage = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (finalSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % finalSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

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
    <div className="w-full overflow-x-hidden">
      
      {/* Full-Viewport Hero with dynamic top spacing */}
     {/* Full-Viewport Hero: Centered and fitted cleanly for mobile + desktop */}
      <section className="relative w-full min-h-[calc(100vh-140px)] lg:min-h-screen flex flex-col justify-center items-center text-center bg-neutral-950 px-4 pt-4 pb-10 sm:py-16">
        
        {/* Background Image Slideshow */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {finalSlides.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="Club Background"
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

        {/* Foreground Content - Centered in viewport */}
        <div className="relative z-20 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl font-poppins leading-tight">
            Collaborate. Innovate. Dominate.
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto font-medium drop-shadow-md leading-relaxed px-2">
            The central hub for hackathon squads, innovator matchmaking, and internal SIH team registrations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2 sm:pt-4 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('sih')}
              className="w-full sm:w-auto bg-maroon text-white font-bold px-8 py-3 rounded-xl uppercase tracking-wider shadow-xl hover:bg-maroon-dark transition cursor-pointer text-xs sm:text-sm"
            >
              SIH 2026 Portal
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className="w-full sm:w-auto bg-white/10 text-white border border-white/60 font-bold px-8 py-3 rounded-xl uppercase tracking-wider shadow-xl hover:bg-white/20 transition backdrop-blur-xs cursor-pointer text-xs sm:text-sm"
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

      {/* Hall of Achievements Carousel */}
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