import { useState, useEffect, useRef } from 'react'
import { useUser, UserButton } from '@clerk/clerk-react'
import SignInPage from './SignInPage.jsx'

/* ═══════════════════════════════════
   HELPERS
   ═══════════════════════════════════ */

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_PLANS = [
  {
    id: 1,
    name: 'Frontend Mastery',
    description: 'Complete React, CSS, and Build 3 Projects.',
    topics: ['React', 'CSS', 'Projects'],
    progress: 65,
    status: 'Active',
    startDate: '2026-01-15',
    endDate: '2026-06-15',
  },
  {
    id: 2,
    name: 'Python Bootcamp',
    description: 'Learn Python fundamentals & data structures.',
    topics: ['Python', 'DSA'],
    progress: 30,
    status: 'In Progress',
    startDate: '2026-02-01',
    endDate: '2026-05-01',
  },
];

const DEFAULT_TASKS = [
  { id: 1, time: '10:00 AM', title: 'React Fundamentals', subject: 'Frontend Dev', duration: '45m', status: 'done' },
  { id: 2, time: '02:00 PM', title: 'CSS Grid Layouts', subject: 'Frontend Dev', duration: '30m', status: 'pending' },
  { id: 3, time: '04:30 PM', title: 'Algorithm Practice', subject: 'Computer Science', duration: '60m', status: 'pending' },
];

/* ═══════════════════════════════════
   APP
   ═══════════════════════════════════ */

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState(() => loadState('sl_plans', DEFAULT_PLANS));
  const [tasks, setTasks] = useState(() => loadState('sl_tasks', DEFAULT_TASKS));
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // Persist — hooks MUST be called before any early returns
  useEffect(() => saveState('sl_plans', plans), [plans]);
  useEffect(() => saveState('sl_tasks', tasks), [tasks]);

  // Show nothing while Clerk is loading
  if (!isLoaded) return null;

  // Show login page if not authenticated
  if (!isSignedIn) return <SignInPage />;

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ));
  };

  const addPlan = (plan) => {
    setPlans(prev => [...prev, { ...plan, id: Date.now(), progress: 0, status: 'Active' }]);
    setActiveTab('plans');
  };

  const updatePlan = (id, updates) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    setSelectedPlanId(null);
    setActiveTab('plans');
  };

  const openManage = (id) => {
    setSelectedPlanId(id);
    setActiveTab('manage');
  };

  const completedToday = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;

  return (
    <div className="app-container">
      {/* ─── Navbar ─── */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo">SL</div>
          <span className="nav-title text-gradient">SmartLearn</span>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'plans' || activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            📚 Study Plans
          </button>
          <button
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            📅 Schedule
          </button>
        </div>

        <div className="flex items-center gap-md">
          <button className="btn btn-primary" onClick={() => setActiveTab('new')}>+ New Plan</button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 34,
                  height: 34,
                  boxShadow: '0 2px 8px rgba(129,140,248,0.25)',
                },
              },
            }}
          />
        </div>
      </nav>

      {/* ─── Main ─── */}
      <main className="container animate-fade-in" style={{ marginTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            toggleTask={toggleTask}
            completedToday={completedToday}
            totalTasks={totalTasks}
            plans={plans}
            onViewAll={() => setActiveTab('schedule')}
          />
        )}
        {activeTab === 'plans' && (
          <StudyPlansView
            plans={plans}
            onNewPlan={() => setActiveTab('new')}
            onManage={openManage}
          />
        )}
        {activeTab === 'new' && (
          <NewPlanView onCancel={() => setActiveTab('plans')} onSubmit={addPlan} />
        )}
        {activeTab === 'schedule' && (
          <ScheduleFullView
            tasks={tasks}
            toggleTask={toggleTask}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
        {activeTab === 'manage' && selectedPlanId && (
          <ManagePlanView
            plan={plans.find(p => p.id === selectedPlanId)}
            onBack={() => setActiveTab('plans')}
            onUpdate={updatePlan}
            onDelete={deletePlan}
          />
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer container">
        Built with ❤️ by SmartLearn · Helping you learn smarter, not harder
      </footer>
    </div>
  )
}

/* ═══════════════════════════════════
   PROFILE DROPDOWN
   ═══════════════════════════════════ */

function ProfileDropdown({ onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const items = [
    { icon: '👤', label: 'My Profile' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '⚙️', label: 'Settings' },
    { icon: '🚪', label: 'Sign Out' },
  ];

  return (
    <div className="profile-dropdown animate-fade-in" ref={ref}>
      <div className="profile-dropdown-header">
        <div className="profile-dropdown-avatar">U</div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>User</p>
          <p className="text-muted" style={{ fontSize: '0.75rem' }}>user@smartlearn.io</p>
        </div>
      </div>
      <div className="profile-dropdown-divider" />
      {items.map((item, i) => (
        <button
          key={i}
          className="profile-dropdown-item"
          onClick={() => { alert(`${item.label} — coming soon!`); onClose(); }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   DASHBOARD VIEW
   ═══════════════════════════════════ */

function DashboardView({ tasks, toggleTask, completedToday, totalTasks, plans, onViewAll }) {
  const pendingCount = totalTasks - completedToday;
  const streak = 12; // placeholder — could be computed
  const weeklyTime = '16h';

  return (
    <div className="flex-col gap-xl">
      {/* Greeting */}
      <div>
        <h2 className="h1" style={{ marginBottom: 'var(--space-xs)' }}>
          Welcome back! <span style={{ display: 'inline-block', animation: 'wave 1.8s ease-in-out infinite' }}>👋</span>
        </h2>
        <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
          You have <strong style={{ color: 'var(--primary)' }}>{pendingCount} task{pendingCount !== 1 ? 's' : ''}</strong> pending for today. Let's crush them!
        </p>
      </div>

      {/* ─── Stats ─── */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
        <StatCard icon="🔥" iconClass="stat-icon-fire" label="Current Streak" value={`${streak}`} unit="days" />
        <StatCard icon="✅" iconClass="stat-icon-check" label="Tasks Completed" value={`${completedToday}`} unit="today" />
        <StatCard icon="⏱️" iconClass="stat-icon-clock" label="Learning Time" value={weeklyTime} unit="this week" />
      </div>

      {/* ─── Schedule & Goals ─── */}
      <div className="grid-dashboard" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
        <ScheduleCard tasks={tasks} toggleTask={toggleTask} onViewAll={onViewAll} />
        <GoalsCard plans={plans} />
      </div>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({ icon, iconClass, label, value, unit }) {
  return (
    <div className="glass-card">
      <div className="flex items-center gap-lg">
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
        <div>
          <p className="section-header">{label}</p>
          <div className="flex items-center gap-sm">
            <span className="h1 text-gradient" style={{ lineHeight: 1 }}>{value}</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{unit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Schedule Card ─── */
function ScheduleCard({ tasks, toggleTask, onViewAll }) {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        <h3 className="h3">Today's Schedule</h3>
        <button className="btn btn-ghost text-gradient" onClick={onViewAll}>View All →</button>
      </div>
      <div className="flex-col gap-sm stagger-left">
        {tasks.map((task) => (
          <div key={task.id} className={`schedule-row ${task.status === 'done' ? 'done' : ''}`}>
            <div className="flex gap-md items-center">
              <span className="schedule-time">{task.time}</span>
              <div>
                <h4 className="schedule-title">{task.title}</h4>
                <span className="schedule-subject">{task.subject}</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <span className="schedule-duration">{task.duration}</span>
              <div
                className={`check-circle clickable ${task.status === 'done' ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                title={task.status === 'done' ? 'Mark as pending' : 'Mark as done'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Goals Card ─── */
function GoalsCard({ plans }) {
  const activePlans = plans.filter(p => p.progress < 100).slice(0, 2);

  return (
    <div className="flex-col gap-lg">
      <div className="glass-card">
        <h3 className="h3" style={{ marginBottom: 'var(--space-lg)' }}>Active Goals</h3>
        <div className="flex-col gap-lg">
          {activePlans.length === 0 && (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>No active goals yet. Create a plan!</p>
          )}
          {activePlans.map(plan => (
            <GoalProgress key={plan.id} label={plan.name} percent={plan.progress} />
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(244, 114, 182, 0.08))' }}>
        <p className="section-header">Tip of the Day</p>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
          💡 Break complex topics into <strong style={{ color: 'var(--primary)' }}>25-minute focus blocks</strong> with 5-minute breaks. Your brain learns best in short bursts!
        </p>
      </div>
    </div>
  )
}

/* ─── Goal Progress ─── */
function GoalProgress({ label, percent }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percent), 200);
    return () => clearTimeout(timer);
  }, [percent]);

  const color = percent >= 60 ? 'var(--success)' : percent >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div>
      <div className="flex justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color }}>{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   FULL SCHEDULE VIEW
   ═══════════════════════════════════ */

function ScheduleFullView({ tasks, toggleTask, onBack }) {
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-xl)' }}>
        <div>
          <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 'var(--space-sm)', padding: '0.3rem 0' }}>← Back to Dashboard</button>
          <h2 className="h2">Full Schedule</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: 'var(--space-xs)' }}>
            {doneCount} of {tasks.length} tasks completed
          </p>
        </div>
      </div>

      <div className="flex-col gap-sm">
        {tasks.map((task) => (
          <div key={task.id} className={`schedule-row ${task.status === 'done' ? 'done' : ''}`}>
            <div className="flex gap-md items-center">
              <span className="schedule-time">{task.time}</span>
              <div>
                <h4 className="schedule-title">{task.title}</h4>
                <span className="schedule-subject">{task.subject}</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <span className="schedule-duration">{task.duration}</span>
              <div
                className={`check-circle clickable ${task.status === 'done' ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
                title={task.status === 'done' ? 'Mark as pending' : 'Mark as done'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   STUDY PLANS VIEW
   ═══════════════════════════════════ */

function StudyPlansView({ plans, onNewPlan, onManage }) {
  return (
    <div className="glass-card animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 className="h2">Your Study Plans</h2>
        <button className="btn btn-primary" onClick={onNewPlan}>+ Create New</button>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)', paddingLeft: 'var(--space-md)' }}>
              <h3 className="h3">{plan.name}</h3>
              <span className={`badge ${plan.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{plan.status}</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)', paddingLeft: 'var(--space-md)' }}>
              {plan.description}
            </p>
            <div className="flex items-center gap-sm" style={{ paddingLeft: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
              {plan.topics.map((topic, i) => (
                <span key={i} className="badge badge-primary">{topic}</span>
              ))}
            </div>
            <div style={{ paddingLeft: 'var(--space-md)' }}>
              <GoalProgress label="Progress" percent={plan.progress} />
            </div>
            <div className="flex justify-between items-center" style={{ paddingLeft: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                Started {new Date(plan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <button className="btn btn-ghost text-gradient" style={{ fontWeight: 600 }} onClick={() => onManage(plan.id)}>Manage →</button>
            </div>
          </div>
        ))}

        {/* Empty State / Add */}
        <div className="add-card" onClick={onNewPlan}>
          <div className="add-card-icon">+</div>
          <p className="text-muted" style={{ fontWeight: 500 }}>Add another plan</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════
   MANAGE PLAN VIEW
   ═══════════════════════════════════ */

function ManagePlanView({ plan, onBack, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(plan?.name || '');
  const [description, setDescription] = useState(plan?.description || '');
  const [progress, setProgress] = useState(plan?.progress || 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!plan) {
    return (
      <div className="glass-card animate-fade-in">
        <p className="text-muted">Plan not found.</p>
        <button className="btn btn-secondary" style={{ marginTop: 'var(--space-md)' }} onClick={onBack}>← Back</button>
      </div>
    );
  }

  const handleSave = () => {
    onUpdate(plan.id, { name, description, progress: Number(progress) });
    setEditing(false);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 'var(--space-lg)', padding: '0.3rem 0' }}>← Back to Plans</button>

      {/* Title & Status */}
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
        {editing ? (
          <input className="input" value={name} onChange={e => setName(e.target.value)} style={{ fontSize: '1.5rem', fontWeight: 700 }} />
        ) : (
          <h2 className="h2">{plan.name}</h2>
        )}
        <span className={`badge ${plan.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{plan.status}</span>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-header">Description</p>
        {editing ? (
          <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        ) : (
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>{plan.description}</p>
        )}
      </div>

      {/* Topics */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-header">Topics</p>
        <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
          {plan.topics.map((t, i) => <span key={i} className="badge badge-primary">{t}</span>)}
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <p className="section-header">Progress</p>
        {editing ? (
          <div className="flex items-center gap-md">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(e.target.value)}
              style={{ flex: 1, accentColor: 'var(--primary)' }}
            />
            <span className="text-gradient" style={{ fontWeight: 700, minWidth: '3rem', textAlign: 'right' }}>{progress}%</span>
          </div>
        ) : (
          <GoalProgress label="" percent={plan.progress} />
        )}
      </div>

      {/* Dates */}
      <div className="flex gap-xl" style={{ marginBottom: 'var(--space-xl)' }}>
        <div>
          <p className="section-header">Start Date</p>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            {new Date(plan.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="section-header">Target End Date</p>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
            {new Date(plan.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)' }}>
        {editing ? (
          <div className="flex gap-md">
            <button className="btn btn-primary" onClick={handleSave}>💾 Save Changes</button>
            <button className="btn btn-secondary" onClick={() => { setEditing(false); setName(plan.name); setDescription(plan.description); setProgress(plan.progress); }}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>✏️ Edit Plan</button>
        )}
        <button className="btn btn-danger-outline" onClick={() => setShowDeleteConfirm(true)}>🗑️ Delete</button>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-dialog animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="h3" style={{ marginBottom: 'var(--space-sm)' }}>Delete Plan?</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>{plan.name}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-between gap-md">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => onDelete(plan.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════
   NEW PLAN VIEW
   ═══════════════════════════════════ */

function NewPlanView({ onCancel, onSubmit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topicsStr, setTopicsStr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const topics = topicsStr.split(',').map(t => t.trim()).filter(Boolean);
    onSubmit({ name, description, startDate, endDate, topics });
  };

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '620px', margin: '0 auto' }}>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-sm" style={{ marginBottom: 'var(--space-xl)' }}>
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            style={{
              width: step === 1 ? 32 : 8,
              height: 8,
              borderRadius: 4,
              background: step === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      <h2 className="h2" style={{ marginBottom: 'var(--space-xs)', textAlign: 'center' }}>Create New Plan</h2>
      <p className="text-muted" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: '0.95rem' }}>
        Define your learning goals and we'll help you build a schedule
      </p>

      <form className="flex-col gap-lg" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Plan Name</label>
          <input className="input" placeholder="e.g. Master Machine Learning" required value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="input" placeholder="What are your goals for this plan?" rows="3" required value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <div className="flex gap-md">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Start Date</label>
            <input type="date" className="input" required value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Target End Date</label>
            <input type="date" className="input" required value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Topics (comma separated)</label>
          <input className="input" placeholder="e.g. Neural Networks, TensorFlow, Math" value={topicsStr} onChange={e => setTopicsStr(e.target.value)} />
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-md)' }}>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">🚀 Create Plan</button>
        </div>
      </form>
    </div>
  )
}

export default App
