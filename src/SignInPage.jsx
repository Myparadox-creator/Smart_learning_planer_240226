import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
    return (
        <div className="login-page">
            {/* Animated orbs */}
            <div className="login-orb login-orb-1" />
            <div className="login-orb login-orb-2" />
            <div className="login-orb login-orb-3" />

            <div className="login-card animate-fade-in">
                {/* Branding */}
                <div className="login-brand">
                    <div className="login-logo">SL</div>
                    <h1 className="login-title">
                        <span className="text-gradient">SmartLearn</span>
                    </h1>
                    <p className="login-subtitle">Your AI-powered study planner</p>
                </div>

                {/* Clerk Sign-In widget */}
                <div className="login-clerk-wrapper">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: { width: '100%' },
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
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: '#e8ecf4',
                                    borderRadius: '9999px',
                                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                },
                                socialButtonsBlockButtonText: {
                                    color: '#e8ecf4',
                                    fontWeight: 500,
                                },
                                formFieldInput: {
                                    background: 'rgba(11,15,26,0.7)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: '#e8ecf4',
                                    borderRadius: '0.875rem',
                                    padding: '0.8rem 1.15rem',
                                    fontSize: '0.925rem',
                                },
                                formButtonPrimary: {
                                    background: 'linear-gradient(135deg, #14b8a6, #6366f1)',
                                    borderRadius: '9999px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '0.65rem 1.4rem',
                                    boxShadow: '0 4px 20px rgba(20,184,166,0.30), 0 2px 8px rgba(99,102,241,0.15)',
                                },
                                footerActionLink: {
                                    color: '#2dd4bf',
                                },
                                dividerLine: {
                                    background: 'rgba(255,255,255,0.05)',
                                },
                                dividerText: {
                                    color: '#5a6a85',
                                },
                                formFieldLabel: {
                                    color: '#a0aec0',
                                },
                                identityPreviewEditButton: {
                                    color: '#2dd4bf',
                                },
                                formFieldInputShowPasswordButton: {
                                    color: '#5a6a85',
                                },
                                footer: {
                                    '& + div': { background: 'transparent' },
                                },
                                internal: {
                                    color: '#a0aec0',
                                },
                            },
                            variables: {
                                colorPrimary: '#2dd4bf',
                                colorText: '#e8ecf4',
                                colorTextSecondary: '#a0aec0',
                                colorBackground: 'transparent',
                                colorInputBackground: 'rgba(11,15,26,0.7)',
                                colorInputText: '#e8ecf4',
                                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                borderRadius: '0.875rem',
                            },
                        }}
                        routing="hash"
                    />
                </div>

                {/* Footer tagline */}
                <p className="login-footer-text">
                    Track progress · Build schedules · Learn smarter 🚀
                </p>
            </div>
        </div>
    )
}
