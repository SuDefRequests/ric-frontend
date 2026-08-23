import { useState, useEffect } from 'react';
import { Search, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../lib/supabase';

export const DirectoryPage = () => {
  const { user, hasAccountDetails, authedFetch, signInWithGoogle } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [revealedContacts, setRevealedContacts] = useState({});

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const url = search ? `${API_BASE}/api/profiles?q=${encodeURIComponent(search)}` : `${API_BASE}/api/profiles`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProfiles(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProfiles, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleReveal = async (id, name) => {
    if (!user) {
      alert("🔒 Please 'Sign in with Google' to access student contact information.");
      return;
    }
    if (!hasAccountDetails) {
      alert("🔒 Please fill your details in 'My Account' before accessing collaborator contacts.");
      return;
    }

    try {
      const res = await authedFetch(`${API_BASE}/api/profiles/${id}/reveal`);
      if (res.ok) {
        const data = await res.json();
        setRevealedContacts((prev) => ({ ...prev, [id]: data }));
      }
    } catch (e) {
      alert("Failed to fetch contact details.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-maroon mb-2">Innovator Directory</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Discover active students and connect across branches for upcoming hackathons.
        </p>

        <div className="relative w-full">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by branch, skill (AI, UI/UX, Web), or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm focus:outline-none focus:border-maroon shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-400 text-sm">Loading innovator profiles...</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 text-sm">
          No innovator profiles found. Head to <strong>My Account</strong> to list yours!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => {
            const revealed = revealedContacts[p.id];
            const tags = Array.isArray(p.tags) ? p.tags : (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-maroon flex items-center justify-center font-bold text-sm">
                      {(p.full_name || 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-neutral-900">{p.full_name}</h4>
                      <p className="text-[11px] font-bold text-maroon uppercase">
                        {p.branch} • {p.year}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                    {p.pitch || 'Looking to collaborate on innovative projects.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium border border-neutral-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  {revealed ? (
                    <div className="text-center space-y-2">
                      <p className="text-xs font-bold text-maroon">{revealed.email}</p>
                      {revealed.phone && <p className="text-xs text-neutral-600 font-medium">+{revealed.phone}</p>}
                      {revealed.phone && (
                        <a
                          href={`https://wa.me/${revealed.phone}?text=${encodeURIComponent(`Hi ${p.full_name}, I saw your profile on RIC Teammate Finder!`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Message on WhatsApp
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReveal(p.id, p.full_name)}
                      className="w-full text-xs font-bold text-neutral-600 hover:text-maroon py-2 text-center uppercase tracking-wider transition"
                    >
                      Access Contact 🔒
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};