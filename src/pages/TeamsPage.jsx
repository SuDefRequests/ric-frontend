import { useState, useEffect } from 'react';
import { Users, CheckCircle, Search, UserPlus, Shield, Sparkles, Plus, X, Eye, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE, supabase } from '../lib/supabase';

export const TeamsPage = ({ setActiveTab }) => {
  const { user, profile, authedFetch } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('confirmed');
  const [confirmedTeams, setConfirmedTeams] = useState([]);
  const [recruitingTeams, setRecruitingTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [requestStatus, setRequestStatus] = useState({});

  // Modal State for creating a recruiting squad
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [neededSkills, setNeededSkills] = useState('');
  const [currentSize, setCurrentSize] = useState(1);
  const [creatingSquad, setCreatingSquad] = useState(false);

  // 1. Fetch Confirmed SIH Submissions
  const fetchConfirmedTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sih/submissions`);
      if (res.ok) {
        const data = await res.json();
        setConfirmedTeams(data);
      } else {
        const { data } = await supabase
          .from('sih_submissions')
          .select(`
            id, team_name, department, edition, category,
            sih_members (s_no, is_leader, name, branch, year)
          `)
          .order('created_at', { ascending: false });
        setConfirmedTeams(data || []);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem('confirmed_sih_teams') || '[]');
      setConfirmedTeams(local);
    }
  };

  // 2. Fetch Recruiting Squads
  const fetchRecruitingTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/teams`);
      if (res.ok) {
        const data = await res.json();
        setRecruitingTeams(data.filter((t) => t.status === 'open' || !t.status));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchConfirmedTeams(), fetchRecruitingTeams()]).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoinRequest = async (teamId) => {
    if (!user) {
      alert('Please sign in to send a join request.');
      return;
    }
    if (!profile?.full_name) {
      alert('Please complete your profile in "My Account" first.');
      return;
    }

    try {
      setRequestStatus((prev) => ({ ...prev, [teamId]: 'sending' }));
      const res = await authedFetch(`${API_BASE}/api/teams/${teamId}/request`, {
        method: 'POST',
      });
      if (res.ok) {
        setRequestStatus((prev) => ({ ...prev, [teamId]: 'sent' }));
        alert('Join request sent successfully!');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to send request.');
        setRequestStatus((prev) => ({ ...prev, [teamId]: 'idle' }));
      }
    } catch {
      alert('Network error.');
      setRequestStatus((prev) => ({ ...prev, [teamId]: 'idle' }));
    }
  };

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in first.');
      return;
    }
    if (!newSquadName.trim()) {
      alert('Please enter a team name.');
      return;
    }

    setCreatingSquad(true);
    try {
      const tagsArray = neededSkills
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const res = await authedFetch(`${API_BASE}/api/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSquadName.trim(),
          needed_skills: tagsArray,
          target_size: 6,
          current_size: Number(currentSize),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewSquadName('');
        setNeededSkills('');
        setCurrentSize(1);
        fetchRecruitingTeams();
        alert('Recruiting squad created!');
      } else {
        alert(data.error || 'Failed to create squad');
      }
    } catch {
      alert('Error creating squad.');
    } finally {
      setCreatingSquad(false);
    }
  };


  const handleMarkComplete = async (teamId) => {
    if (!confirm('Mark this squad as locked / complete?')) return;
    try {
      const res = await authedFetch(`${API_BASE}/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });
      if (res.ok) fetchRecruitingTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!confirm(`Are you sure you want to delete squad "${teamName}"?`)) return;
    try {
      const res = await authedFetch(`${API_BASE}/api/teams/${teamId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchRecruitingTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredConfirmed = confirmedTeams.filter((t) =>
    (t.team_name || t.teamDetails?.teamName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.department || t.teamDetails?.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecruiting = recruitingTeams.filter((t) =>
    (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.competition_name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Registered Teams
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600">
          See who's already formed a team — or find one still looking for your skills.
        </p>
      </div>

      {/* Navigation Sub-Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('confirmed')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeSubTab === 'confirmed'
              ? 'bg-white text-maroon shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
              }`}
          >
            <CheckCircle className="w-4 h-4 text-green-600" /> Confirmed Teams ({confirmedTeams.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recruiting')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeSubTab === 'recruiting'
              ? 'bg-white text-maroon shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
              }`}
          >
            <UserPlus className="w-4 h-4 text-maroon" /> Recruiting Squads ({recruitingTeams.length})
          </button>
        </div>

        {/* Search + Context-Aware Action Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search team or competition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-300 bg-white"
            />
          </div>

          {activeSubTab === 'confirmed' ? (
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('sih')}
              className="shrink-0 bg-maroon hover:bg-maroon-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> + Register Full Team (6/6)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 bg-maroon hover:bg-maroon-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> + Register Your Team
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Confirmed Teams View */}
      {activeSubTab === 'confirmed' && (
        <div>
          {loading ? (
            <p className="text-center py-12 text-xs text-neutral-500">Loading registered teams...</p>
          ) : filteredConfirmed.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-800">No Confirmed Teams Yet</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Completed 6-member internal SIH submissions will automatically be displayed here.
              </p>
              <button
                onClick={() => setActiveTab && setActiveTab('sih')}
                className="mt-4 inline-flex items-center gap-1.5 bg-maroon text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Submit SIH Registration
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConfirmed.map((team, idx) => {
                const teamName = team.team_name || team.teamDetails?.teamName;
                const dept = team.department || team.teamDetails?.department;
                const edition = team.edition || team.teamDetails?.edition || 'Software';
                const members = team.sih_members || team.members || [];

                return (
                  <div
                    key={team.id || idx}
                    className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                          Verified 6/6
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-500 uppercase">
                          {edition} Track
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-neutral-900 mb-1">{teamName}</h3>
                      <p className="text-xs font-medium text-maroon mb-4">{dept}</p>

                      <div className="pt-3 border-t border-neutral-100">
                        <span className="text-[11px] font-bold text-neutral-700 block mb-2">Team Members:</span>
                        <ul className="space-y-1">
                          {members.map((m, mIdx) => (
                            <li key={mIdx} className="text-xs text-neutral-600 flex items-center justify-between">
                              <span className="truncate max-w-[170px]">
                                {mIdx + 1}. {m.name} {m.is_leader ? '👑' : ''}
                              </span>
                              <span className="text-[10px] text-neutral-400 shrink-0">{m.branch || m.year}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Roster Locked</span>
                      <span className="text-neutral-500 font-semibold">SIH 2026</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Recruiting Squads View */}
      {activeSubTab === 'recruiting' && (
        <div>
          {loading ? (
            <p className="text-center py-12 text-xs text-neutral-500">Loading open squads...</p>
          ) : filteredRecruiting.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200">
              <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-800">No Open Squads Currently Recruiting</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Need more members for your idea? Click "+ Register Your Team" to post an opening.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 bg-maroon text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Register Your Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecruiting.map((team) => {
                const status = requestStatus[team.id];
                const isOwner = user?.id === team.created_by;
                const isMember = (team.members_ids || []).includes(user?.id);

                const neededSkills = Array.isArray(team.needed_skills)
                  ? team.needed_skills
                  : typeof team.needed_skills === 'string' && team.needed_skills.trim()
                    ? team.needed_skills.split(',').map((s) => s.trim()).filter(Boolean)
                    : [];

                const memberList = team.members_names && team.members_names.length > 0
                  ? team.members_names
                  : ['Squad Lead'];

                const maxMembers = team.target_size || 6;
                const openSpots = Math.max(0, maxMembers - memberList.length);

                return (
                  <div
                    key={team.id}
                    className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-black text-neutral-900 tracking-tight">{team.name}</h3>
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 tracking-wider">
                          LOOKING FOR TEAMMATES
                        </span>
                      </div>

                      <p className="text-[11px] font-extrabold text-maroon uppercase tracking-wider mb-4">
                        {team.competition_name || 'SMART INDIA HACKATHON 2026'}
                      </p>

                      {/* Team Members List with Spot Counter */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            MEMBERS ({memberList.length} / {maxMembers})
                          </span>
                          {openSpots > 0 ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {openSpots} spots open
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                              Full
                            </span>
                          )}
                        </div>
                        <ul className="text-xs font-semibold text-neutral-700 space-y-1">
                          {memberList.map((mName, i) => (
                            <li key={i} className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0"></span>
                              <span className="truncate">{mName}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Looking For Skill Badges */}
                      {neededSkills.length > 0 && (
                        <div className="mb-5">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                            LOOKING FOR
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {neededSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      {isOwner ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab && setActiveTab('account')}
                              className="inline-flex items-center justify-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2 rounded-lg transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Requests
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkComplete(team.id)}
                              className="inline-flex items-center justify-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-2 rounded-lg transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Complete
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteTeam(team.id, team.name)}
                            className="w-full inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-1.5 rounded-lg transition border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Squad
                          </button>
                        </div>
                      ) : isMember ? (
                        <div className="text-center text-xs font-bold text-green-700 bg-green-50 py-2.5 rounded-lg border border-green-200">
                          ✓ You are in this squad
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleJoinRequest(team.id)}
                          disabled={status === 'sent' || status === 'sending' || openSpots === 0}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer ${status === 'sent'
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : openSpots === 0
                              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                              : 'bg-maroon hover:bg-maroon-dark text-white'
                            }`}
                        >
                          {status === 'sent'
                            ? 'Request Sent ✓'
                            : status === 'sending'
                              ? 'Sending...'
                              : openSpots === 0
                                ? 'Squad Full'
                                : 'Request to Join'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Register Your Recruiting Squad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-maroon mb-1">Register Recruiting Squad</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Post your squad requirement to discover teammates with missing technical roles.
            </p>

            <form onSubmit={handleCreateSquad} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Squad / Team Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. ApexInnovators"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-maroon focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Current Team Size</label>
                  <select
                    value={currentSize}
                    onChange={(e) => setCurrentSize(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-maroon focus:outline-hidden"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Required Vacancy</label>
                  <div className="text-xs p-2.5 rounded-lg border border-neutral-200 bg-neutral-100 font-bold text-neutral-700">
                    {6 - currentSize} Needed
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Looking For / Required Roles (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Backend Dev, UI/UX Designer, IoT Specialist"
                  value={neededSkills}
                  onChange={(e) => setNeededSkills(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-maroon focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSquad}
                  className="flex-1 bg-maroon hover:bg-maroon-dark text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-60 cursor-pointer"
                >
                  {creatingSquad ? 'Posting...' : 'Create Squad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};