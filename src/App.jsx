import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      <nav className="glass-card flex justify-between items-center" style={{ margin: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', borderRadius: 'var(--radius-full)' }}>
        <div className="flex items-center gap-sm">
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            SL
          </div>
          <h1 className="h3 text-gradient" style={{ margin: 0 }}>SmartLearn</h1>
        </div>
        <div className="flex gap-sm">
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-secondary' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ border: activeTab !== 'dashboard' ? 'none' : '' }}
          >
            Dashboard
          </button>
          <button
            className={`btn ${activeTab === 'plans' ? 'btn-secondary' : ''}`}
            onClick={() => setActiveTab('plans')}
            style={{ border: activeTab !== 'plans' ? 'none' : '' }}
          >
            Study Plans
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('new')}>+ New Plan</button>
      </nav>

      <main className="container animate-fade-in" style={{ marginTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
        {activeTab === 'dashboard' && (
          <DashboardView />
        )}
        {activeTab === 'plans' && (
          <div className="glass-card">
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 className="h2">Your Study Plans</h2>
              <button className="btn btn-primary" onClick={() => setActiveTab('new')}>+ Create New</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)' }}>
              {/* Example Plan Card */}
              <div className="glass-card" style={{ padding: 'var(--space-md)', background: 'var(--surface-hover)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-sm)' }}>
                  <h3 className="h3">Frontend Mastery</h3>
                  <span className="text-muted" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Active</span>
                </div>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>Complete React, CSS, and Build 3 Projects.</p>
                <div className="flex justify-between items-center">
                  <div className="flex-col gap-sm" style={{ flex: 1, marginRight: 'var(--space-md)' }}>
                    <div className="flex justify-between">
                      <span style={{ fontSize: '0.8rem' }}>Progress</span>
                      <span style={{ fontSize: '0.8rem' }}>65%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <div style={{ width: '65%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                  <button className="text-gradient">Manage</button>
                </div>
              </div>

              {/* Empty State */}
              <div className="glass-card flex-col items-center justify-center gap-sm" style={{ padding: 'var(--space-xl)', borderStyle: 'dashed', cursor: 'pointer' }} onClick={() => setActiveTab('new')}>
                <span className="h2 text-muted">+</span>
                <p className="text-muted">Add another plan</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'new' && (
          <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="h2" style={{ marginBottom: 'var(--space-lg)' }}>Create New Plan</h2>
            <form className="flex-col gap-md" onSubmit={(e) => { e.preventDefault(); setActiveTab('plans'); }}>
              <div className="flex-col gap-sm">
                <label className="text-muted" style={{ fontSize: '0.9rem' }}>Plan Name</label>
                <input className="input" placeholder="e.g. Master Machine Learning" required />
              </div>
              <div className="flex-col gap-sm">
                <label className="text-muted" style={{ fontSize: '0.9rem' }}>Description</label>
                <textarea className="input" placeholder="What are your goals?" rows="3" required></textarea>
              </div>
              <div className="flex gap-md" style={{ marginTop: 'var(--space-sm)' }}>
                <div className="flex-col gap-sm" style={{ flex: 1 }}>
                  <label className="text-muted" style={{ fontSize: '0.9rem' }}>Start Date</label>
                  <input type="date" className="input" required />
                </div>
                <div className="flex-col gap-sm" style={{ flex: 1 }}>
                  <label className="text-muted" style={{ fontSize: '0.9rem' }}>Target End Date</label>
                  <input type="date" className="input" required />
                </div>
              </div>
              <div className="flex justify-between items-center" style={{ marginTop: 'var(--space-lg)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('plans')}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Plan</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

function DashboardView() {
  return (
    <div className="flex-col gap-xl">
      <div>
        <h2 className="h1" style={{ marginBottom: 'var(--space-xs)' }}>Welcome back! 👋</h2>
        <p className="text-muted">You have 3 tasks pending for today. Let's crush them!</p>
      </div>

      {/* Stats overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-lg)', marginTop: 'var(--space-xl)' }}>
        <div className="glass-card">
          <h3 className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Streak</h3>
          <div className="flex items-center gap-sm" style={{ marginTop: 'var(--space-sm)' }}>
            <span className="h1 text-gradient">12</span>
            <span className="text-muted">days</span>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tasks Completed</h3>
          <div className="flex items-center gap-sm" style={{ marginTop: 'var(--space-sm)' }}>
            <span className="h1 text-gradient">48</span>
            <span className="text-muted">this week</span>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Learning Time</h3>
          <div className="flex items-center gap-sm" style={{ marginTop: 'var(--space-sm)' }}>
            <span className="h1 text-gradient">16h</span>
            <span className="text-muted">this week</span>
          </div>
        </div>
      </div>

      {/* Today's Schedule & Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)', marginTop: 'var(--space-xl)' }}>
        <div className="glass-card">
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 className="h3">Today's Schedule</h3>
            <button className="text-gradient">View All</button>
          </div>

          <div className="flex-col gap-sm">
            {[
              { time: '10:00 AM', title: 'React Fundamentals', subject: 'Frontend Dev', duration: '45m', status: 'done' },
              { time: '02:00 PM', title: 'CSS Grid Layouts', subject: 'Frontend Dev', duration: '30m', status: 'pending' },
              { time: '04:30 PM', title: 'Algorithm Practice', subject: 'Computer Science', duration: '60m', status: 'pending' }
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: 'var(--space-md)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', borderLeft: task.status === 'done' ? '3px solid var(--success)' : '3px solid var(--warning)' }}>
                <div className="flex gap-md items-center">
                  <span className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{task.time}</span>
                  <div>
                    <h4 style={{ fontWeight: 500, color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</h4>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{task.subject}</span>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>{task.duration}</span>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${task.status === 'done' ? 'var(--success)' : 'var(--text-muted)'}`, background: task.status === 'done' ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {task.status === 'done' && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-col gap-lg">
          <div className="glass-card">
            <h3 className="h3" style={{ marginBottom: 'var(--space-md)' }}>Active Goals</h3>
            <div className="flex-col gap-md">
              <div>
                <div className="flex justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                  <span style={{ fontSize: '0.9rem' }}>Frontend Mastery</span>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>65%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                  <span style={{ fontSize: '0.9rem' }}>Python Bootcamp</span>
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>30%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '30%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
