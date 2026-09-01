import { useState } from 'react';
import { generateAavishkarPDF } from '../components/sih/generateAavishkarPDF';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Users,
  UserPlus,
  Trash2,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Scale,
  Presentation,
  Award
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const SPPU_THEMES = [
  'Engineering & Technology',
  'Pure Sciences',
  'Agriculture & Animal Husbandry',
  'Commerce, Management & Law',
  'Humanities, Languages & Fine Arts',
  'Medicine & Pharmacy'
];

const STUDY_LEVELS = [
  'Undergraduate (UG) — Age below 25',
  'Postgraduate (PG) — Age below 30',
  'Post-PG (M.Phil / Ph.D / Post-Doctoral) — No age limit'
];

const CASTE_CATEGORIES = ['OPEN', 'OBC', 'SC', 'ST', 'VJNT', 'NT', 'EWS', 'SBC'];

export const AavishkarPortal = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    projectTitle: '',
    theme: SPPU_THEMES[0],
    level: STUDY_LEVELS[0],
    guideName: '',
    guideDepartment: '',
    abstract: '',
    members: [
      { name: '', email: '', phone: '', branch: '', year: 'FE', gender: 'Male', caste: 'OPEN' },
      { name: '', email: '', phone: '', branch: '', year: 'FE', gender: 'Male', caste: 'OPEN' }
    ]
  });

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.members];
    updated[index][field] = value;
    setFormData({ ...formData, members: updated });
  };

  const addMember = () => {
    if (formData.members.length < 3) {
      setFormData({
        ...formData,
        members: [
          ...formData.members,
          { name: '', email: '', phone: '', branch: '', year: 'FE', gender: 'Male', caste: 'OPEN' }
        ]
      });
    }
  };

  const removeMember = (index) => {
    if (formData.members.length > 2) {
      const updated = formData.members.filter((_, i) => i !== index);
      setFormData({ ...formData, members: updated });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/aavishkar/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      // Generate & Download PDF
      generateAavishkarPDF(formData);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf8f6] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header Banner */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-maroon/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon/80 text-white text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> SPPU Research Convention
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-poppins tracking-tight">
              Aavishkar 2026–2027 Portal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
              Maharashtra State Inter-University Research Convention. Register your research team for Institute-level scrutiny.
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-900 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Aavishkar Registration Submitted Successfully</h4>
              <p className="text-xs text-green-700 mt-0.5">
                Your team has been recorded and your formal registration PDF has been generated.
              </p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Specifications */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
              <BookOpen className="w-5 h-5 text-maroon" />
              <h2 className="text-lg font-bold text-neutral-900">1. Research Project Specifications</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Project / Innovation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full research project title..."
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  SPPU Research Category *
                </label>
                <select
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                >
                  {SPPU_THEMES.map((theme) => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Eligibility Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                >
                  {STUDY_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Faculty Guide / Mentor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. / Dr. Full Name"
                  value={formData.guideName}
                  onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Guide Department *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Engineering"
                  value={formData.guideDepartment}
                  onChange={(e) => setFormData({ ...formData, guideDepartment: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                  Brief Abstract / Methodology (Max 100 Words) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly state the research objective, methodology, and expected societal outcome..."
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-2 focus:ring-maroon/20 focus:border-maroon bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Student Members */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-maroon" />
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">2. Research Team Members</h2>
                  <p className="text-xs text-neutral-500">Minimum 2 students, maximum 3 students allowed.</p>
                </div>
              </div>

              {formData.members.length < 3 ? (
                <button
                  type="button"
                  onClick={addMember}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-maroon bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add Member 3
                </button>
              ) : (
                <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg">
                  Maximum 3 Members Reached
                </span>
              )}
            </div>

            {formData.members.map((member, idx) => (
              <div key={idx} className="bg-[#fffdfb] p-4 sm:p-5 rounded-xl border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-maroon bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                    {idx === 0 ? 'Member 1 (Lead Presenter)' : `Member ${idx + 1}`}
                  </span>
                  {idx === 2 && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Member 3
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Student Full Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>
                  {/* Email Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Email ID *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title="Please enter a valid email address (e.g., student@gmail.com)"
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                    />
                  </div>

                  {/* Mobile Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Mobile No *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit Mobile No."
                      pattern="^[6-9]\d{9}$"
                      title="Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
                      value={member.phone}
                      onChange={(e) => {
                        // Allow only numbers
                        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleMemberChange(idx, 'phone', onlyNums);
                      }}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Branch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Engineering"
                      value={member.branch}
                      onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Year of Study *</label>
                    <select
                      value={member.year}
                      onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                    >
                      <option value="FE">First Year (FE)</option>
                      <option value="SE">Second Year (SE)</option>
                      <option value="TE">Third Year (TE)</option>
                      <option value="BE">Final Year (BE)</option>
                      <option value="ME">Master / PG</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Gender *</label>
                    <select
                      value={member.gender}
                      onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Caste Category *</label>
                    <select
                      value={member.caste}
                      onChange={(e) => handleMemberChange(idx, 'caste', e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-neutral-300 bg-white"
                    >
                      {CASTE_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-maroon text-white font-bold px-8 py-3.5 rounded-xl uppercase tracking-wider shadow-lg hover:bg-maroon-dark transition cursor-pointer text-xs sm:text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting & Generating PDF...' : 'Submit Aavishkar Registration'}
            </button>
          </div>
        </form>

        {/* Section 3: Official Guidelines */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-neutral-200 pb-3">
            <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-maroon" /> Official SPPU Aavishkar Guidelines & Framework
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Standard operating procedures and scoring criteria defined by Savitribai Phule Pune University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Poster Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-maroon font-bold text-sm border-b border-neutral-100 pb-2">
                <Presentation className="w-4 h-4" /> Poster Guidelines
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                <li>• <strong>Poster Dimensions:</strong> Exactly <strong>1 m × 1 m</strong>.</li>
                <li>• <strong>Strict Blind Review:</strong> Do <strong>NOT</strong> mention participant names, guide names, department, or college/institute names on the poster.</li>
                <li>• Only selected projects from the College Scrutiny level proceed to the Zonal Level.</li>
              </ul>
            </div>

            {/* Zonal Level Requirements */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-maroon font-bold text-sm border-b border-neutral-100 pb-2">
                <FileText className="w-4 h-4" /> Documents Required for Zonal Level
              </div>
              <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                <li>• <strong>Two Geotagged Photographs</strong> of the working model/research setup.</li>
                <li>• <strong>One 1-Minute Video Clip</strong> explaining the core concept.</li>
                <li>• <strong>One 1 m × 1 m Poster</strong> as per university format.</li>
                <li>• <strong>Abstract:</strong> Maximum 100 words in Times New Roman font.</li>
              </ul>
            </div>

            {/* Evaluation Criteria Table */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-3 md:col-span-2">
              <div className="flex items-center gap-2 text-maroon font-bold text-sm border-b border-neutral-100 pb-2">
                <Award className="w-4 h-4" /> Evaluation Criteria (100 Marks Total)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-700">
                      <th className="py-2.5 px-4 font-bold">Evaluation Criterion</th>
                      <th className="py-2.5 px-4 font-bold text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-neutral-600">
                    <tr>
                      <td className="py-2.5 px-4">Relevance of the Topic</td>
                      <td className="py-2.5 px-4 font-bold text-right text-neutral-900">20</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Methodology & Research Design</td>
                      <td className="py-2.5 px-4 font-bold text-right text-neutral-900">20</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Contribution / Research Efforts</td>
                      <td className="py-2.5 px-4 font-bold text-right text-neutral-900">20</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Innovation / Novelty</td>
                      <td className="py-2.5 px-4 font-bold text-right text-neutral-900">20</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Outcome & Societal Impact of the Project</td>
                      <td className="py-2.5 px-4 font-bold text-right text-neutral-900">20</td>
                    </tr>
                    <tr className="bg-neutral-50 font-black text-maroon border-t border-neutral-200">
                      <td className="py-2.5 px-4 uppercase">Total Evaluation Score</td>
                      <td className="py-2.5 px-4 text-right">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AavishkarPortal;