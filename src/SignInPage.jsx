import { SignIn } from '@clerk/clerk-react'

export default function SignInPage({ onBack }) {
    return (
        <div className="login-page">
            {/* Animated orbs */}
            <div className="login-orb login-orb-1" />
            <div className="login-orb login-orb-2" />
            <div className="login-orb login-orb-3" />

            <div className="login-card animate-fade-in">
                {/* Back button — inline with card, centered alignment */}
                {onBack && (
                    <div style={{ textAlign: 'left', marginBottom: 'var(--space-lg)' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={onBack}
                            style={{
                                fontSize: '0.82rem',
                                padding: '0.4rem 1rem',
                                gap: '0.35rem',
                            }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                )}

                {/* Branding — tightly grouped */}
                <div className="login-brand">
                    <div className="login-logo">SL</div>
                    <h1 className="login-title">
                        <span className="text-gradient">SmartLearn</span>
                    </h1>
                    <p className="login-subtitle">Sign in to your study planner</p>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
                    margin: '0 0 var(--space-lg) 0',
                }} />

                {/* Clerk Sign-In widget */}
                <div className="login-clerk-wrapper">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: {
                                    width: '100%',
                                },
                                card: {
                                    background: 'transparent',
                                    boxShadow: 'none',
                                    border: 'none',
                                    padding: 0,
                                    width: '100%',
                                },
                                headerTitle: { display: 'none' },
                                headerSubtitle: { display: 'none' },
                                socialButtonsBlockButton: {
                                    background: '#f8fafc',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    color: '#1e293b',
                                    borderRadius: '0.75rem',
                                    padding: '0.7rem 1rem',
                                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                    fontWeight: 500,
                                },
                                socialButtonsBlockButtonText: {
                                    color: '#1e293b',
                                    fontWeight: 500,
                                },
                                formFieldInput: {
                                    background: '#f8fafc',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    color: '#1e293b',
                                    borderRadius: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.925rem',
                                },
                                formButtonPrimary: {
                                    background: '#4f46e5',
                                    borderRadius: '0.75rem',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    padding: '0.75rem 1.4rem',
                                    boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
                                    textTransform: 'none',
                                    letterSpacing: '0',
                                },
                                footerActionLink: {
                                    color: '#4f46e5',
                                    fontWeight: 500,
                                },
                                footerActionText: {
                                    color: '#64748b',
                                },
                                dividerLine: {
                                    background: 'rgba(0,0,0,0.06)',
                                },
                                dividerText: {
                                    color: '#94a3b8',
                                    fontSize: '0.8rem',
                                },
                                formFieldLabel: {
                                    color: '#475569',
                                    fontWeight: 500,
                                    fontSize: '0.85rem',
                                },
                                identityPreviewEditButton: {
                                    color: '#4f46e5',
                                },
                                formFieldInputShowPasswordButton: {
                                    color: '#94a3b8',
                                },
                                // Fix the dark Clerk footer
                                footer: {
                                    background: 'transparent',
                                    '& > div': {
                                        background: 'transparent !important',
                                    },
                                },
                                footerAction: {
                                    background: 'transparent',
                                },
                                // Fix the "Secured by Clerk" / dev mode banner
                                badge: {
                                    background: 'rgba(79,70,229,0.06)',
                                    color: '#4f46e5',
                                },
                                internal: {
                                    color: '#475569',
                                },
                                // Override any internal dark backgrounds
                                cardBox: {
                                    background: 'transparent',
                                    boxShadow: 'none',
                                },
                                main: {
                                    gap: '1rem',
                                },
                            },
                            variables: {
                                colorPrimary: '#4f46e5',
                                colorText: '#1e293b',
                                colorTextSecondary: '#64748b',
                                colorBackground: 'transparent',
                                colorInputBackground: '#f8fafc',
                                colorInputText: '#1e293b',
                                colorDanger: '#ef4444',
                                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                borderRadius: '0.75rem',
                                fontSize: '0.925rem',
                            },
                        }}
                        routing="hash"
                    />
                </div>

                {/* Footer tagline — integrated into the card cleanly */}
                <div style={{
                    marginTop: 'var(--space-lg)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    textAlign: 'center',
                }}>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: '0.78rem',
                        letterSpacing: '0.03em',
                    }}>
                        📚 Track progress · 📅 Build schedules · 🚀 Learn smarter
                    </p>
                </div>
            </div>
        </div>
    )
}
