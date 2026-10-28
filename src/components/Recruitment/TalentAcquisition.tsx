import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Plus,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  X,
  Search,
  Filter,
  UserCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobOpening, Candidate, CandidateStage } from '../../types';

const STAGES: CandidateStage[] = [
  'Applied',
  'Shortlisted',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected'
];

interface TalentAcquisitionProps {
  initialOpenCreateJob?: boolean;
}

export const TalentAcquisition: React.FC<TalentAcquisitionProps> = ({
  initialOpenCreateJob = false
}) => {
  const {
    jobs,
    candidates,
    addJob,
    toggleJobStatus,
    addCandidate,
    updateCandidateStage,
    scheduleInterview,
    currentRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs'>('pipeline');
  const [isAddJobOpen, setIsAddJobOpen] = useState(initialOpenCreateJob);
  const [isAddCandOpen, setIsAddCandOpen] = useState(false);
  const [interviewScheduleTarget, setInterviewScheduleTarget] = useState<Candidate | null>(null);

  // Add Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLocation, setJobLocation] = useState('San Francisco, CA / Remote');
  const [jobType, setJobType] = useState<JobOpening['employmentType']>('Full-Time');
  const [jobVacancies, setJobVacancies] = useState(1);

  // Add Candidate Form State
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candJobId, setCandJobId] = useState(jobs[0]?.id || 'JOB-301');
  const [candExp, setCandExp] = useState('4 years');
  const [candRating, setCandRating] = useState(4);
  const [candNotes, setCandNotes] = useState('');

  // Interview Schedule Form State
  const [interviewDate, setInterviewDate] = useState('2026-10-29 14:00');
  const [interviewer, setInterviewer] = useState('Marcus Vance');

  const openJobs = jobs.filter((j) => j.status === 'Open');

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    addJob({
      title: jobTitle.trim(),
      department: jobDept,
      location: jobLocation.trim(),
      employmentType: jobType,
      vacancies: Number(jobVacancies),
      status: 'Open'
    });

    setIsAddJobOpen(false);
    setJobTitle('');
  };

  const handleCandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim() || !candEmail.trim()) return;

    const matchedJob = jobs.find((j) => j.id === candJobId);

    addCandidate({
      name: candName.trim(),
      email: candEmail.trim(),
      phone: candPhone.trim() || '+1 (555) 000-0000',
      jobId: candJobId,
      jobTitle: matchedJob ? matchedJob.title : 'Software Specialist',
      stage: 'Applied',
      experience: candExp,
      rating: Number(candRating),
      notes: candNotes.trim()
    });

    setIsAddCandOpen(false);
    setCandName('');
    setCandEmail('');
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interviewScheduleTarget) {
      scheduleInterview(interviewScheduleTarget.id, interviewDate, interviewer);
      setInterviewScheduleTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Talent Acquisition Workspace</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {openJobs.length} active requisitions
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            End-to-end recruitment funnel, candidate pipeline Kanban, and interview scheduling
          </p>
        </div>

        {currentRole !== 'employee' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddCandOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Add Candidate</span>
            </button>
            <button
              onClick={() => setIsAddJobOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post New Requisition</span>
            </button>
          </div>
        )}
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'pipeline'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Candidate Pipeline Kanban ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'jobs'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Active Job Requisitions ({jobs.length})
        </button>
      </div>

      {activeTab === 'pipeline' ? (
        
        /* Kanban Pipeline Board */
        <div className="w-full min-w-0 overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start min-w-0">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);

            return (
              <div
                key={stage}
                className="rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3 space-y-3 min-h-[480px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {stage}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-400 shadow-2xs">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in this Stage */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[600px] pr-0.5">
                  {stageCandidates.length === 0 ? (
                    <div className="py-12 text-center text-[11px] text-slate-400 italic">
                      No candidates in {stage.toLowerCase()}
                    </div>
                  ) : (
                    stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-2 text-xs hover:border-indigo-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                              {cand.name}
                            </h4>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                              {cand.jobTitle}
                            </p>
                          </div>
                          <div className="flex items-center text-[10px] text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                            {cand.rating}
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                          <div>Exp: {cand.experience}</div>
                          <div>Applied: {cand.appliedDate}</div>
                        </div>

                        {cand.interviewDate && (
                          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/50 text-[10px] text-indigo-700 dark:text-indigo-300">
                            <Clock className="w-3 h-3 inline mr-1 text-indigo-500" />
                            {cand.interviewDate}
                          </div>
                        )}

                        {cand.notes && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                            "{cand.notes}"
                          </p>
                        )}

                        {/* Move stage control */}
                        {currentRole !== 'employee' && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                            <select
                              value={cand.stage}
                              onChange={(e) => updateCandidateStage(cand.id, e.target.value as CandidateStage)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none"
                            >
                              {STAGES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => setInterviewScheduleTarget(cand)}
                              className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Schedule
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        
        /* Job Openings Table */
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Requisition ID</th>
                  <th className="py-3 px-4">Position Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Vacancies</th>
                  <th className="py-3 px-4">Applicants</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-400">{job.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{job.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{job.department}</td>
                    <td className="py-3 px-4 text-slate-500">{job.location}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{job.employmentType}</td>
                    <td className="py-3 px-4 font-mono">{job.vacancies}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                      {job.applicantsCount} candidates
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {currentRole !== 'employee' && (
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {job.status === 'Open' ? 'Close Opening' : 'Reopen'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Job Requisition Modal */}
      {isAddJobOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Post New Job Opening</h2>
              <button onClick={() => setIsAddJobOpen(false)} className="p-1 text-slate-400 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Position Title *
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Lead Cloud Security Engineer"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Workplace Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Vacancies
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={jobVacancies}
                    onChange={(e) => setJobVacancies(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddJobOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {isAddCandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Enroll Candidate Profile</h2>
              <button onClick={() => setIsAddCandOpen(false)} className="p-1 text-slate-400 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCandSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="jordan.hayes@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Applying For Job *
                </label>
                <select
                  value={candJobId}
                  onChange={(e) => setCandJobId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relevant Experience
                  </label>
                  <input
                    type="text"
                    value={candExp}
                    onChange={(e) => setCandExp(e.target.value)}
                    placeholder="e.g. 5 years"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={candRating}
                    onChange={(e) => setCandRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Screening Notes
                </label>
                <textarea
                  rows={2}
                  value={candNotes}
                  onChange={(e) => setCandNotes(e.target.value)}
                  placeholder="Portfolio link, interview impression, salary expectations..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCandOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewScheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Schedule Candidate Interview</h2>
                <p className="text-xs text-slate-400">For {interviewScheduleTarget.name}</p>
              </div>
              <button onClick={() => setInterviewScheduleTarget(null)} className="p-1 text-slate-400 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInterviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="text"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  placeholder="2026-10-30 15:30"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Interviewer
                </label>
                <input
                  type="text"
                  required
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInterviewScheduleTarget(null)}
                  className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
