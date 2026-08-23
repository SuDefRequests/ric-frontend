import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Sparkles, FileDown, AlertTriangle, Users, BookOpen } from 'lucide-react';
import { SihPdfDocument } from '../components/sih/SihPdfDocument';
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

export const SihPortalPage = () => {
    const { user, authedFetch } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [teamDetails, setTeamDetails] = useState({
        department: 'Computer Engineering',
        teamName: '',
        edition: 'Software',
        psId: '',
        psTitle: '',
        category: 'Smart Automation',
        mentorName: '',
        mentorContact: '',
        mentorEmail: '',
    });

    const [members, setMembers] = useState([
        { sNo: 1, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Male', contact: '' },
        { sNo: 2, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Female', contact: '' },
        { sNo: 3, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Male', contact: '' },
        { sNo: 4, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Male', contact: '' },
        { sNo: 5, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Male', contact: '' },
        { sNo: 6, name: '', branch: 'Computer Engineering', year: '1st Year', rollNo: '', email: '', gender: 'Male', contact: '' },
    ]);

    const handleMemberChange = (index, field, value) => {
        // Restrict mobile contact numbers strictly to 10 digits
        if (field === 'contact') {
            const sanitized = value.replace(/\D/g, '').slice(0, 10);
            const updated = [...members];
            updated[index][field] = sanitized;
            setMembers(updated);
            return;
        }

        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    const handleMentorContact = (val) => {
        const sanitized = val.replace(/\D/g, '').slice(0, 10);
        setTeamDetails({ ...teamDetails, mentorContact: sanitized });
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/; // Valid 10-digit Indian mobile number

        // 1. Validate All 6 Members
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.name.trim() || !m.rollNo.trim() || !m.email.trim() || !m.contact.trim()) {
                alert(`Please complete all required fields for Member ${i + 1} (${i === 0 ? 'Team Leader' : 'Member'}).`);
                return false;
            }
            if (!emailRegex.test(m.email.trim())) {
                alert(`Invalid email address for Member ${i + 1}: ${m.email}`);
                return false;
            }
            if (!phoneRegex.test(m.contact.trim())) {
                alert(`Contact number for Member ${i + 1} must be a valid 10-digit mobile number.`);
                return false;
            }
        }

        // 2. Mandatory Female Teammate Validation
        const femaleCount = members.filter((m) => m.gender === 'Female' && m.name.trim() !== '').length;
        if (femaleCount < 1) {
            alert('SIH Mandate Error: At least 1 female teammate is mandatory in the 6-member squad.');
            return false;
        }

        // 3. Optional Mentor Contact Validation
        if (teamDetails.mentorContact && !phoneRegex.test(teamDetails.mentorContact)) {
            alert('Mentor contact must be a valid 10-digit mobile number.');
            return false;
        }

        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Safe Duplicate Checks (prevents undefined.trim() crash)
        const emails = members
            .map((m) => (m?.email || '').trim().toLowerCase())
            .filter(Boolean);

        const phones = members
            .map((m) => (m?.phone || m?.mobile_no || m?.mobile || '').trim())
            .filter(Boolean);

        const names = members
            .map((m) => (m?.name || '').trim().toLowerCase())
            .filter(Boolean);

        const getDuplicate = (arr) => arr.find((item, idx) => arr.indexOf(item) !== idx);

        const dupEmail = getDuplicate(emails);
        if (dupEmail) {
            alert(`Duplicate email detected: "${dupEmail}". Each member must have a unique email.`);
            return;
        }

        const dupPhone = getDuplicate(phones);
        if (dupPhone) {
            alert(`Duplicate phone number detected: "${dupPhone}". Each member must have a unique mobile number.`);
            return;
        }

        const dupName = getDuplicate(names);
        if (dupName) {
            alert(`Duplicate member name detected: "${dupName}". All 6 members must be distinct individuals.`);
            return;
        }

        if (!user) {
            alert('Please sign in first to submit your SIH team registration.');
            return;
        }

        if (!validateForm()) return;

        // 2. Format sanitized members payload
        // 2. Format sanitized members payload
        const sanitizedMembers = members.map((m, idx) => {
            const cleanName = (m?.name || '').trim();
            const cleanEmail = (m?.email || '').trim().toLowerCase();
            const cleanPhone = (m?.phone || m?.mobile_no || m?.contact || m?.mobile || '').toString().trim();
            const cleanRoll = (m?.roll_no || m?.rollNo || '').trim();

            return {
                ...m,
                s_no: idx + 1,
                name: cleanName,
                email: cleanEmail,
                phone: cleanPhone,
                mobile_no: cleanPhone,
                contact: cleanPhone,
                roll_no: cleanRoll,
                rollNo: cleanRoll,
                branch: m?.branch || teamDetails?.department || 'Computer Engineering',
                year: m?.year || '1st Year',
                gender: m?.gender || 'Male',
                is_leader: Boolean(m?.is_leader || m?.isLeader || idx === 0),
            };
        });

        setSubmitting(true);
        try {
            const res = await authedFetch(`${API_BASE}/api/sih/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamDetails, members: sanitizedMembers }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSubmitted(true);
                // Save to local storage cache for instant UI availability
                const existing = JSON.parse(localStorage.getItem('confirmed_sih_teams') || '[]');
                localStorage.setItem(
                    'confirmed_sih_teams',
                    JSON.stringify([{ ...data, ...teamDetails, members: sanitizedMembers }, ...existing])
                );
                alert('SIH Registration recorded successfully! You can now download the official HOD approval slip.');
            } else {
                alert(data.error || 'Failed to record registration.');
            }
        } catch {
            // Fallback cache so the user can still download their slip if backend is unreachable
            const existing = JSON.parse(localStorage.getItem('confirmed_sih_teams') || '[]');
            const localEntry = { id: `local-${Date.now()}`, ...teamDetails, members: sanitizedMembers };
            localStorage.setItem('confirmed_sih_teams', JSON.stringify([localEntry, ...existing]));
            setIsSubmitted(true);
            alert('SIH Registration recorded locally! You can now download your slip.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Banner */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-neutral-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-maroon text-white mb-3 tracking-wider uppercase">
                        <Sparkles className="w-3 h-3" /> SIH 2026 Internal Portal
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Internal Hackathon Team Registration
                    </h2>
                    <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
                        Fill the 6-member team details to generate the official HOD approval & submission slip.
                    </p>
                </div>

                {/* Quick Action Links */}
                <div className="flex flex-wrap gap-2">
                    <a
                        href="https://sih.gov.in/sih2026PS"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-maroon hover:bg-maroon-dark text-white border border-red-400/40 text-xs font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap"
                    >
                        Browse Problem Statements ↗
                    </a>
                    <a
                        href="https://sih.gov.in/letters/2026/SIH2026-IDEA-Presentation-Format.pptx"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold px-4 py-2.5 rounded-lg transition whitespace-nowrap"
                    >
                        SIH PPT Format ↗
                    </a>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Team & Problem Statement Metadata */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-3">
                        <BookOpen className="w-5 h-5 text-maroon" />
                        <h3 className="text-lg font-bold text-neutral-900">1. Problem Statement & Team Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                            <label className="text-xs font-bold text-neutral-700 block mb-1">Team Name</label>
                            <input
                                required
                                type="text"
                                value={teamDetails.teamName}
                                onChange={(e) => setTeamDetails({ ...teamDetails, teamName: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                                placeholder="e.g. CodeForge"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-neutral-700 block mb-1">Department</label>
                            <select
                                value={teamDetails.department}
                                onChange={(e) => setTeamDetails({ ...teamDetails, department: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                            >
                                {BRANCH_OPTIONS.map((branch) => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-neutral-700 block mb-1">Edition</label>
                            <select
                                value={teamDetails.edition}
                                onChange={(e) => setTeamDetails({ ...teamDetails, edition: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                            >
                                <option value="Software">Software Edition</option>
                                <option value="Hardware">Hardware Edition</option>
                                <option value="Hybrid">Hybrid Edition</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-neutral-700 block mb-1">Problem Statement ID</label>
                            <input
                                required
                                type="text"
                                value={teamDetails.psId}
                                onChange={(e) => setTeamDetails({ ...teamDetails, psId: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                                placeholder="e.g. SIH1604"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-neutral-700 block mb-1">Problem Statement Title</label>
                            <input
                                required
                                type="text"
                                value={teamDetails.psTitle}
                                onChange={(e) => setTeamDetails({ ...teamDetails, psTitle: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                                placeholder="e.g. Smart Automation for Traffic Congestion"
                            />
                        </div>
                    </div>

                    {/* Optional Mentor Details */}
                    <div className="mt-6 pt-5 border-t border-neutral-100">
                        <span className="text-xs font-bold text-neutral-700 block mb-3">Internal College Mentor (Optional)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Mentor Full Name"
                                value={teamDetails.mentorName}
                                onChange={(e) => setTeamDetails({ ...teamDetails, mentorName: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                            />
                            <input
                                type="tel"
                                maxLength={10}
                                placeholder="Mentor 10-Digit Mobile"
                                value={teamDetails.mentorContact}
                                onChange={(e) => handleMentorContact(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                            />
                            <input
                                type="email"
                                placeholder="Mentor Email"
                                value={teamDetails.mentorEmail}
                                onChange={(e) => setTeamDetails({ ...teamDetails, mentorEmail: e.target.value })}
                                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-neutral-50"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: 6 Mandatory Team Members */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-6 border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-maroon" />
                            <h3 className="text-lg font-bold text-neutral-900">2. Roster Details (6 Members Mandatory)</h3>
                        </div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                            Min 1 Female Teammate Required
                        </span>
                    </div>

                    <div className="space-y-6">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="p-4 sm:p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-neutral-900">
                                        {index === 0 ? '👑 Member 1 (Team Leader)' : `Member ${index + 1}`}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-200 text-neutral-700 rounded">
                                        Slot {index + 1}/6
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                                    <div className="lg:col-span-2">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Full Name"
                                            value={member.name}
                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <select
                                            value={member.branch}
                                            onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        >
                                            {BRANCH_OPTIONS.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <select
                                            value={member.year}
                                            onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        >
                                            {YEAR_OPTIONS.map((y) => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Roll / Reg No"
                                            value={member.rollNo}
                                            onChange={(e) => handleMemberChange(index, 'rollNo', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        />
                                    </div>

                                    <div>
                                        <select
                                            value={member.gender}
                                            onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="lg:col-span-3">
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email (e.g. student@gmail.com)"
                                            value={member.email}
                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        />
                                    </div>

                                    <div className="lg:col-span-3">
                                        <input
                                            required
                                            type="tel"
                                            maxLength={10}
                                            placeholder="10-Digit Mobile Number"
                                            value={member.contact}
                                            onChange={(e) => handleMemberChange(index, 'contact', e.target.value)}
                                            className="w-full text-xs p-2 rounded-lg border border-neutral-300 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit & PDF Slip Download */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                        {/* <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> */}
                        <span>Ensure all 6 roll numbers, emails, and phone numbers are accurate before submitting.</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto bg-maroon hover:bg-maroon-dark text-white font-bold px-8 py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-sm disabled:opacity-60"
                        >
                            {submitting ? 'Recording Submission...' : 'Submit SIH Registration'}
                        </button>

                        {isSubmitted ? (
                            <PDFDownloadLink
                                document={
                                    <SihPdfDocument
                                        data={{
                                            teamDetails: teamDetails,
                                            leaderDetails: members[0],
                                            members: members,
                                        }}
                                    />
                                }
                                fileName={`${(teamDetails?.teamName || 'SIH_Team').replace(/\s+/g, '_')}_Registration_Slip.pdf`}
                                className="w-full sm:w-auto bg-neutral-900 text-white font-bold px-6 py-3 rounded-xl uppercase text-xs tracking-wider hover:bg-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                            >
                                {({ loading }) => (loading ? 'Generating PDF...' : '📄 Download Official PDF Slip')}
                            </PDFDownloadLink>
                        ) : null}
                        
                    </div>
                </div>
            </form>
        </div>
    );
};