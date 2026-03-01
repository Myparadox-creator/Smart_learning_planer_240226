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
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    color: '#f1f5f9',
                                    borderRadius: '9999px',
                                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                                },
                                socialButtonsBlockButtonText: {
                                    color: '#f1f5f9',
                                    fontWeight: 500,
                                },
                                formFieldInput: {
                                    background: 'rgba(10,14,26,0.7)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: '#f1f5f9',
                                    borderRadius: '0.875rem',
                                    padding: '0.8rem 1.15rem',
                                    fontSize: '0.925rem',
                                },
                                formButtonPrimary: {
                                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                    borderRadius: '9999px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    padding: '0.65rem 1.4rem',
                                    boxShadow: '0 4px 20px rgba(99,102,241,0.35), 0 2px 8px rgba(236,72,153,0.2)',
                                },
                                footerActionLink: {
                                    color: '#818cf8',
                                },
                                dividerLine: {
                                    background: 'rgba(255,255,255,0.06)',
                                },
                                dividerText: {
                                    color: '#64748b',
                                },
                                formFieldLabel: {
                                    color: '#cbd5e1',
                                },
                                identityPreviewEditButton: {
                                    color: '#818cf8',
                                },
                                formFieldInputShowPasswordButton: {
                                    color: '#64748b',
                                },
                                footer: {
                                    '& + div': { background: 'transparent' },
                                },
                                internal: {
                                    color: '#cbd5e1',
                                },
                            },
                            variables: {
                                colorPrimary: '#818cf8',
                                colorText: '#f1f5f9',
                                colorTextSecondary: '#cbd5e1',
                                colorBackground: 'transparent',
                                colorInputBackground: 'rgba(10,14,26,0.7)',
                                colorInputText: '#f1f5f9',
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
