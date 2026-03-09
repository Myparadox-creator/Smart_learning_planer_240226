import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser, UserButton } from '@clerk/clerk-react'
import SignInPage from './SignInPage.jsx'
import WireGrid from './WireGrid.jsx'
import { LayoutDashboard, BookOpen, CalendarDays, Settings, Sun, Moon, Rocket, User, Bell, LogOut, Flame, CheckCircle, Timer, Lightbulb, Save, Edit2, Trash2, HandMetal, Heart } from 'lucide-react'

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
   CURSOR TRACKING HOOK
   ═══════════════════════════════════ */

function useCursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const handleMouseMove = useCallback((e) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);
  return { pos, handleMouseMove };
}

function useTilt(ref) {
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
  }, [ref]);

  return { handleMouseMove, handleMouseLeave };
}

/* ═══════════════════════════════════
   TILT STAT CARD WRAPPER
   ═══════════════════════════════════ */

function TiltCard({ children, className = '', style = {} }) {
  const ref = useRef(null);
  const { handleMouseMove, handleMouseLeave } = useTilt(ref);

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={{ ...style, transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════
   APP
   ═══════════════════════════════════ */

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState(() => loadState('sl_plans', DEFAULT_PLANS));
  const [tasks, setTasks] = useState(() => loadState('sl_tasks', DEFAULT_TASKS));
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [darkMode, setDarkMode] = useState(() => loadState('sl_darkMode', false));

  const [clerkTimedOut, setClerkTimedOut] = useState(false);

  // Persist — hooks MUST be called before any early returns
  useEffect(() => saveState('sl_plans', plans), [plans]);
  useEffect(() => saveState('sl_tasks', tasks), [tasks]);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    saveState('sl_darkMode', darkMode);
  }, [darkMode]);

  // Clerk loading timeout — if Clerk doesn't load in 8s, let the user continue
  useEffect(() => {
    if (isLoaded) return;
    const timer = setTimeout(() => setClerkTimedOut(true), 8000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Show loading screen while Clerk is loading
  if (!isLoaded && !clerkTimedOut) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', gap: '1.5rem', fontFamily: "'Inter', system-ui, sans-serif",
        background: 'var(--background)', color: 'var(--text-main)',
      }}>
        <div className="nav-logo" style={{ width: 56, height: 56, fontSize: '1.3rem' }}>SL</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28, height: 28, border: '3px solid rgba(79,70,229,0.15)',
            borderTopColor: '#4f46e5', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading SmartLearn...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // When Clerk timed out, let the user bypass auth via the landing page buttons
  const handleSignIn = () => {
    if (clerkTimedOut) {
      // Clerk unavailable — skip auth, go straight to dashboard
      setShowSignIn(true);
    } else {
      setShowSignIn(true);
    }
  };

  // Show landing page or sign-in if not authenticated
  if (!isSignedIn && !clerkTimedOut) {
    if (showSignIn) return <SignInPage onBack={() => setShowSignIn(false)} />;
    return <LandingPage onSignIn={handleSignIn} />;
  }

  // If Clerk timed out and user hasn't clicked "enter", show landing page
  if (clerkTimedOut && !isSignedIn && !showSignIn) {
    return <LandingPage onSignIn={handleSignIn} />;
  }

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
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'plans' || activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BookOpen size={16} /> Study Plans
          </button>
          <button
            className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CalendarDays size={16} /> Schedule
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Settings size={16} /> Settings
          </button>
        </div>

        <div className="flex items-center gap-md">
          <button
            className="theme-toggle-btn"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span className="theme-toggle-icon" style={{ display: 'flex' }}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}</span>
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('new')}>+ New Plan</button>
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: 34,
                  height: 34,
                  boxShadow: '0 2px 8px rgba(79,70,229,0.20)',
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
        {activeTab === 'settings' && (
          <SettingsView
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(d => !d)}
            onBack={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
        Built with <Heart size={14} fill="currentColor" style={{ color: 'var(--danger)' }} /> by SmartLearn &middot; Helping you learn smarter, not harder
      </footer>
    </div>
  )
}

/* ═══════════════════════════════════
   LANDING PAGE  (Unauthenticated)
   ═══════════════════════════════════ */

function LandingPage({ onSignIn }) {
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);

  const handleFeatureMove = useCallback((e, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  }, []);

  const handleFeatureLeave = useCallback((ref) => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0)';
  }, []);

  return (
    <div className="landing-page">
      {/* Wire grid canvas — circuit wires that charge near cursor */}
      <WireGrid />

      {/* Background orbs */}
      <div className="landing-orb landing-orb-1" />
      <div className="landing-orb landing-orb-2" />
      <div className="landing-orb landing-orb-3" />

      {/* Navbar */}
      <div className="landing-navbar">
        <div className="nav-brand">
          <div className="nav-logo">SL</div>
          <span className="nav-title text-gradient">SmartLearn</span>
        </div>
        <div className="flex items-center gap-md">
          <button className="btn-signin" onClick={onSignIn}>
            <span>Sign In →</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero animate-fade-in">
        <h1 className="landing-hero-title">
          Learn Smarter,<br />
          <span className="text-gradient">Not Harder.</span>
        </h1>
        <p className="landing-hero-subtitle">
          AI-powered study planner that helps you build schedules, track progress, and reach your learning goals faster.
        </p>
        <div className="landing-cta-group">
          <button className="btn-signin" onClick={onSignIn}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Rocket size={18} /> Get Started Free</span>
          </button>
          <button className="btn-learn-more" onClick={onSignIn}>
            Learn More
          </button>
        </div>

        {/* Feature cards with 3D tilt */}
        <div className="landing-features stagger">
          <div
            ref={card1Ref}
            className="landing-feature-card"
            onMouseMove={(e) => handleFeatureMove(e, card1Ref)}
            onMouseLeave={() => handleFeatureLeave(card1Ref)}
          >
            <span className="landing-feature-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LayoutDashboard size={24} /></span>
            <h3 className="landing-feature-title">Smart Dashboard</h3>
            <p className="landing-feature-desc">See your progress at a glance with real-time analytics and insights.</p>
          </div>
          <div
            ref={card2Ref}
            className="landing-feature-card"
            onMouseMove={(e) => handleFeatureMove(e, card2Ref)}
            onMouseLeave={() => handleFeatureLeave(card2Ref)}
          >
            <span className="landing-feature-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={24} /></span>
            <h3 className="landing-feature-title">Study Plans</h3>
            <p className="landing-feature-desc">Create custom learning paths and stay organized with milestones.</p>
          </div>
          <div
            ref={card3Ref}
            className="landing-feature-card"
            onMouseMove={(e) => handleFeatureMove(e, card3Ref)}
            onMouseLeave={() => handleFeatureLeave(card3Ref)}
          >
            <span className="landing-feature-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CalendarDays size={24} /></span>
            <h3 className="landing-feature-title">Smart Scheduling</h3>
            <p className="landing-feature-desc">Automatically build optimal study sessions around your life.</p>
          </div>
        </div>
      </div>
    </div>
  );
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
    { icon: <User size={16} />, label: 'My Profile' },
    { icon: <Bell size={16} />, label: 'Notifications' },
    { icon: <Settings size={16} />, label: 'Settings' },
    { icon: <LogOut size={16} />, label: 'Sign Out' },
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
          <span style={{ display: 'flex' }}>{item.icon}</span>
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
  const streak = 12;
  const weeklyTime = '16h';
  const { pos, handleMouseMove } = useCursorGlow();

  return (
    <div className="flex-col gap-xl" onMouseMove={handleMouseMove} style={{ position: 'relative' }}>
      {/* Cursor glow effect */}
      <div className="cursor-glow" style={{ left: pos.x, top: pos.y }} />

      {/* Greeting */}
      <div>
        <h2 className="h1" style={{ marginBottom: 'var(--space-xs)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Welcome back! <span style={{ display: 'inline-flex', animation: 'wave 1.8s ease-in-out infinite' }}><HandMetal size={32} /></span>
        </h2>
        <p className="text-secondary" style={{ fontSize: '1.05rem' }}>
          You have <strong style={{ color: 'var(--primary)' }}>{pendingCount} task{pendingCount !== 1 ? 's' : ''}</strong> pending for today. Let's crush them!
        </p>
      </div>

      {/* ─── Stats ─── */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
        <TiltCard className="glass-card">
          <StatCardContent icon={<Flame size={24} />} iconClass="stat-icon-fire" label="Current Streak" value={`${streak}`} unit="days" />
        </TiltCard>
        <TiltCard className="glass-card">
          <StatCardContent icon={<CheckCircle size={24} />} iconClass="stat-icon-check" label="Tasks Completed" value={`${completedToday}`} unit="today" />
        </TiltCard>
        <TiltCard className="glass-card">
          <StatCardContent icon={<Timer size={24} />} iconClass="stat-icon-clock" label="Learning Time" value={weeklyTime} unit="this week" />
        </TiltCard>
      </div>

      {/* ─── Schedule & Goals ─── */}
      <div className="grid-dashboard" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' }}>
        <ScheduleCard tasks={tasks} toggleTask={toggleTask} onViewAll={onViewAll} />
        <GoalsCard plans={plans} />
      </div>
    </div>
  )
}

/* ─── Stat Card Content ─── */
function StatCardContent({ icon, iconClass, label, value, unit }) {
  return (
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

      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04), rgba(14, 165, 233, 0.03))' }}>
        <p className="section-header">Tip of the Day</p>
        <div style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <Lightbulb size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>Break complex topics into <strong style={{ color: 'var(--primary)' }}>25-minute focus blocks</strong> with 5-minute breaks. Your brain learns best in short bursts!</span>
          </div>
        </div>
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
            <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Save size={16} /> Save Changes</button>
            <button className="btn btn-secondary" onClick={() => { setEditing(false); setName(plan.name); setDescription(plan.description); setProgress(plan.progress); }}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Edit2 size={16} /> Edit Plan</button>
        )}
        <button className="btn btn-danger-outline" onClick={() => setShowDeleteConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Trash2 size={16} /> Delete</button>
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
              background: step === 1 ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
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
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Rocket size={16} /> Create Plan</button>
        </div>
      </form>
    </div>
  )
}

/* ═══════════════════════════════════
   SETTINGS VIEW
   ═══════════════════════════════════ */

function SettingsView({ darkMode, onToggleDark, onBack }) {
  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: 'var(--space-sm)', padding: '0.3rem 0' }}>← Back to Dashboard</button>
      <h2 className="h2" style={{ marginBottom: 'var(--space-xs)' }}>Settings</h2>
      <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>
        Customize your SmartLearn experience
      </p>

      {/* Appearance */}
      <div className="settings-section">
        <p className="settings-section-title">Appearance</p>

        <div className="settings-row">
          <div>
            <p className="settings-row-label">{darkMode ? '🌙' : '☀️'} Dark Mode</p>
            <p className="settings-row-desc">Switch between light and dark themes</p>
          </div>
          <label className="toggle-switch" id="dark-mode-toggle">
            <input type="checkbox" checked={darkMode} onChange={onToggleDark} />
            <span className="toggle-track" />
            <span className="toggle-thumb" />
          </label>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <p className="settings-section-title">About</p>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <p><strong style={{ color: 'var(--text-main)' }}>SmartLearn</strong> v1.0</p>
          <p className="text-muted" style={{ marginTop: '4px' }}>AI-powered study planner — helping you learn smarter, not harder.</p>
        </div>
      </div>
    </div>
  );
}

export default App
