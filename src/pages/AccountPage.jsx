import { useState, useEffect } from 'react';
import { User, Shield, Check, X, Edit2, CheckCircle2, Globe, Lock, Send, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../lib/supabase';

const BRANCH_OPTIONS = [
  'Computer Engineering',
  'Information Technology',
  'Artificial Intelligence & Machine Learning',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
];

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const AccountPage = ({ setActiveTab }) => {
  const { user, profile, signInWithGoogle, authedFetch, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    branch: 'Computer Engineering',
    year: '1st Year',
    roll_no: '',
    mobile_no: '',
    pitch: '',
    tags: '',
    is_public: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);

  // Teams & Requests States
  const [myTeams, setMyTeams] = useState([]);
  const [teamRequests, setTeamRequests] = useState({});
  const [mySentRequests, setMySentRequests] = useState([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        branch: profile.branch || 'Computer Engineering',
        year: profile.year || '1st Year',
        roll_no: profile.roll_no || '',
        mobile_no: profile.mobile_no || profile.phone || '',
        pitch: profile.pitch || '',
        tags: Array.isArray(profile.tags) ? profile.tags.join(', ') : profile.tags || '',
        is_public: profile.is_public !== false,
      });

      if (!profile.full_name) {
        setIsEditing(true);
      }
    }
  }, [profile]);

  const loadAccountData = async () => {
    try {
      // 1. Load squads created/managed by me
      const res = await authedFetch(`${API_BASE}/api/teams`);
      if (res.ok) {
        const allTeams = await res.json();
        const createdByMe = allTeams.filter((t) => t.created_by === user?.id);
        setMyTeams(createdByMe);

        createdByMe.forEach(async (team) => {
          const reqRes = await authedFetch(`${API_BASE}/api/teams/${team.id}/requests`);
          if (reqRes.ok) {
            const reqData = await reqRes.json();
            setTeamRequests((prev) => ({ ...prev, [team.id]: reqData }));
          }
        });
      }

      // 2. Load outgoing requests sent by me
      const sentRes = await authedFetch(`${API_BASE}/api/teams/my-requests`);
      if (sentRes.ok) {
        const sentData = await sentRes.json();
        setMySentRequests(sentData);
      }
    } catch (e) {
      console.error('Error loading account team data:', e);
    }
  };

  useEffect(() => {
    if (user) {
      loadAccountData();
    }
  }, [user]);

  const handleMobileChange = (e) => {
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile_no: sanitized }));
  };

  const handleToggleVisibility = async () => {
    if (!profile?.full_name && !formData.full_name.trim()) {
      alert('Please fill out and save your profile details first before listing.');
      return;
    }

    if (togglingVisibility) return;
    const nextState = !formData.is_public;

    setTogglingVisibility(true);
    setFormData((prev) => ({ ...prev, is_public: nextState }));

    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean)
        : (profile?.tags || []);

      const res = await authedFetch(`${API_BASE}/api/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name.trim() || profile?.full_name || null,
          branch: formData.branch || profile?.branch || 'Computer Engineering',
          year: formData.year || profile?.year || '1st Year',
          roll_no: formData.roll_no.trim() || profile?.roll_no || null,
          mobile_no: formData.mobile_no || profile?.mobile_no || profile?.phone || null,
          pitch: formData.pitch.trim() || profile?.pitch || null,
          tags: tagsArray,
          is_public: nextState,
        }),
      });

      if (res.ok) {
        await refreshProfile();
      } else {
        setFormData((prev) => ({ ...prev, is_public: !nextState }));
      }
    } catch (e) {
      console.error('Error toggling visibility:', e);
      setFormData((prev) => ({ ...prev, is_public: !nextState }));
    } finally {
      setTogglingVisibility(false);
    }
  };

  const handleDecision = async (teamId, reqId, decision) => {
    try {
      const res = await authedFetch(`${API_BASE}/api/teams/${teamId}/requests/${reqId}/${decision}`, {
        method: 'POST',
      });
      if (res.ok) {
        loadAccountData();
      }
    } catch {
      alert('Error updating request status.');
    }
  };

  const handleStatusUpdate = async (teamId, newStatus) => {
    try {
      const res = await authedFetch(`${API_BASE}/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadAccountData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.mobile_no.trim())) {
      setMsg('Validation Error: Please enter a valid 10-digit mobile number starting with 6-9.');
      return;
    }

    setLoading(true);

    const formattedTags = formData.tags
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: formattedTags,
    };

    try {
      const res = await authedFetch(`${API_BASE}/api/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg('Profile Updated Successfully!');
        setIsEditing(false);
        await refreshProfile();
      } else {
        const err = await res.json();
        setMsg(err.error || 'Error saving profile.');
      }
    } catch {
      setMsg('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm text-center">
        <User className="w-12 h-12 text-maroon mx-auto mb-4" />
        <h3 className="text-xl font-bold text-neutral-900 mb-2">My Account Profile</h3>
        <p className="text-xs text-neutral-600 mb-6">
          Sign in to manage your college registration details and innovator presence.
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-maroon text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider hover:bg-maroon-dark transition cursor-pointer"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const tagsList = Array.isArray(profile?.tags)
    ? profile.tags
    : typeof profile?.tags === 'string'
    ? profile.tags.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      
      {/* 1. Account & Profile Card */}
      <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm max-w-2xl mx-auto">
        
        {/* Card Header */}
        <div className="flex items-start justify-between border-b border-neutral-100 pb-4 mb-6">
          <div>
            <h3 className="text-xl font-black text-neutral-900">Account & Innovator Profile</h3>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
          {profile?.full_name && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setMsg('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon hover:bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          )}
        </div>

        {/* Directory Visibility Toggle */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-center justify-between mb-6">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              {formData.is_public ? (
                <Globe className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-400" />
              )}
              <span className="text-xs font-bold text-neutral-800">
                List in Innovator Directory
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {formData.is_public
                ? 'Visible to students seeking teammates.'
                : 'Hidden from public student discovery.'}
            </p>
          </div>

          <button
            type="button"
            disabled={togglingVisibility}
            onClick={handleToggleVisibility}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              formData.is_public ? 'bg-maroon' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                formData.is_public ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Read-Only Profile View */}
        {!isEditing && profile?.full_name ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Full Name
                </span>
                <p className="text-sm font-bold text-neutral-800">{profile.full_name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Roll / Enrollment
                </span>
                <p className="text-sm font-bold text-neutral-800">{profile.roll_no || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Academic Branch
                </span>
                <p className="text-xs font-semibold text-neutral-700">{profile.branch}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Year
                </span>
                <p className="text-xs font-semibold text-neutral-700">{profile.year}</p>
              </div>
            </div>

            {profile.pitch && (
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Innovator Pitch
                </span>
                <p className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-100 italic">
                  "{profile.pitch}"
                </p>
              </div>
            )}

            {tagsList.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Skills & Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tagsList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase border border-neutral-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Profile Active & Verified
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name</label>
              <input
                required
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-maroon"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Branch</label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
                >
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Roll / Enrollment No</label>
                <input
                  required
                  type="text"
                  value={formData.roll_no}
                  onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
                  placeholder="e.g. 24CO101"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Mobile No</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={formData.mobile_no}
                  onChange={handleMobileChange}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-700 block mb-1">Innovator Pitch (Max 140 chars)</label>
              <textarea
                maxLength={140}
                rows={2}
                value={formData.pitch}
                onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                placeholder="e.g. Full-stack developer experienced with React & Python."
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Skills / Tags (comma separated)</label>
              <input
                type="text"
                placeholder="React, IoT, AI, UI/UX"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-maroon text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider hover:bg-maroon-dark transition mt-4 disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Saving Profile...' : 'Save Profile'}
            </button>

            {msg && (
              <p
                className={`text-xs text-center font-bold mt-2 ${
                  msg.includes('Success') ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {msg}
              </p>
            )}
          </form>
        )}
      </div>

      {/* 2. Sent Join Requests Dashboard */}
      <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 pb-3">
          <Send className="w-5 h-5 text-maroon" />
          <h3 className="text-lg font-bold text-neutral-900">Your Sent Join Requests</h3>
        </div>

        {mySentRequests.length === 0 ? (
          <p className="text-xs text-neutral-500">
            You haven't requested to join any squads yet.{' '}
            <button
              onClick={() => setActiveTab && setActiveTab('directory')}
              className="text-maroon font-bold hover:underline ml-1 cursor-pointer"
            >
              Find open squads
            </button>
          </p>
        ) : (
          <div className="space-y-3">
            {mySentRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">
                    {req.teams?.name || 'Recruiting Squad'}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-medium">
                    {req.teams?.competition_name || 'SIH 2026'}
                  </p>
                </div>

                <div>
                  {req.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Accepted
                    </span>
                  ) : req.status === 'rejected' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
                      <X className="w-3 h-3" /> Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Managed Squads & Applicant Review */}
      {myTeams.length > 0 && (
        <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-3">
            <Shield className="w-5 h-5 text-maroon" />
            <h3 className="text-lg font-bold text-neutral-900">Squads You Manage</h3>
          </div>

          <div className="space-y-6">
            {myTeams.map((team) => {
              const requests = teamRequests[team.id] || [];
              return (
                <div key={team.id} className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-base text-neutral-900">{team.name}</h4>
                      <p className="text-xs text-maroon font-semibold">{team.competition_name || 'SIH 2026'}</p>
                    </div>

                    <select
                      value={team.status || 'open'}
                      onChange={(e) => handleStatusUpdate(team.id, e.target.value)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-white border border-neutral-300 text-neutral-800 uppercase focus:outline-hidden cursor-pointer"
                    >
                      <option value="open">Looking for Teammates</option>
                      <option value="verified">Verified Squad</option>
                      <option value="closed">Roster Locked / Complete</option>
                    </select>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <span className="text-xs font-bold text-neutral-700 block mb-2">
                      Incoming Join Requests ({requests.length})
                    </span>
                    {requests.length === 0 ? (
                      <p className="text-xs text-neutral-400">No pending join requests for this squad.</p>
                    ) : (
                      <div className="space-y-2">
                    {requests.map((req) => (
                        <div
                          key={req.id}
                          className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-neutral-300 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-900">
                                {req.details?.full_name || req.email || 'Applicant'}
                              </span>
                              {req.details?.roll_no && (
                                <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                                  {req.details.roll_no}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-neutral-500 font-medium">
                              <span>{req.details?.branch || 'Department'} • {req.details?.year || 'Year'}</span>
                              
                              {(req.details?.email || req.email) && (
                                <>
                                  <span className="text-neutral-300">•</span>
                                  <a 
                                    href={`mailto:${req.details?.email || req.email}`}
                                    className="text-neutral-600 hover:text-maroon underline transition"
                                  >
                                    {req.details?.email || req.email}
                                  </a>
                                </>
                              )}

                              {(req.details?.phone || req.details?.mobile_no) && (
                                <>
                                  <span className="text-neutral-300">•</span>
                                  <a 
                                    href={`tel:${req.details?.phone || req.details?.mobile_no}`}
                                    className="text-neutral-700 font-bold hover:text-maroon transition"
                                  >
                                     {req.details?.phone || req.details?.mobile_no}
                                  </a>
                                </>
                              )}
                            </div>

                            {req.details?.pitch && (
                              <p className="text-[11px] text-neutral-600 italic pt-1 line-clamp-2">
                                "{req.details.pitch}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                            <button
                              onClick={() => handleDecision(team.id, req.id, 'accept')}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleDecision(team.id, req.id, 'reject')}
                              className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};