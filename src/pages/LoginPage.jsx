import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Row, Col, Form, Button, Alert, InputGroup, Spinner, Card
} from 'react-bootstrap'
import {
  UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined,
  MedicineBoxOutlined, CheckCircleFilled
} from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

/* ── Inline style objects (replaces styled-components) ── */
const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Outfit', sans-serif",
    background: '#f1f5f9',
    margin: 0,
    padding: 0,
  },

  /* ── Left branding panel ── */
  left: {
    flex: 1,
    background: 'linear-gradient(160deg, #0f172a 0%, #0c2340 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
  },
  logo: {
    width: 56, height: 56,
    background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 0 0 10px rgba(14,165,233,0.1)',
  },
  leftTitle: {
    fontSize: 26, fontWeight: 800, color: 'white',
    marginBottom: 8, textAlign: 'center',
  },
  leftSub: {
    fontSize: 13, color: '#64748b', textAlign: 'center',
    lineHeight: 1.7, maxWidth: 260, margin: '0 auto 28px',
  },
  feat: {
    fontSize: 13, color: '#94a3b8',
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 10,
  },
  featCheck: {
    width: 20, height: 20,
    background: 'rgba(14,165,233,0.15)', color: '#0ea5e9',
    borderRadius: '50%', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 700, flexShrink: 0,
  },
  badge: {
    fontSize: 10, fontWeight: 700, color: '#475569',
    border: '1px solid #1e3a52', borderRadius: 5,
    padding: '3px 8px', textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* ── Right login panel ── */
  right: {
    width: '100%', maxWidth: 440,
    background: 'white',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center',
    padding: '48px 40px',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.06)',
    animation: 'fadeUp 0.4s ease both',
  },
  mobileLogo: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32,
  },
  mobileLogoIcon: {
    width: 36, height: 36,
    background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  formTitle: {
    fontSize: 21, fontWeight: 700, color: '#0f172a',
    letterSpacing: -0.3, marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 13, color: '#94a3b8', marginBottom: 24,
  },
  inputIcon: (focused, hasError) => ({
    color: hasError ? '#ef4444' : focused ? '#0ea5e9' : '#d1d5db',
    fontSize: 15, transition: 'color 0.18s',
  }),
  submitBtn: (loading) => ({
    width: '100%', height: 46, borderRadius: 8,
    fontSize: 14, fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    background: loading ? '#93c5fd' : 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    border: 'none', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: loading ? 'none' : '0 4px 14px rgba(14,165,233,0.35)',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
  }),
  securityRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 5, padding: '14px 0',
    borderTop: '1px solid #f3f4f6', marginBottom: 14,
  },
  demoBox: {
    background: '#f9fafb', border: '1px dashed #e5e7eb',
    borderRadius: 8, padding: '12px 14px',
  },
  demoTitle: {
    fontSize: 10, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
  },
  demoValue: {
    fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700, color: '#0369a1',
    background: '#dbeafe', padding: '2px 8px', borderRadius: 4,
  },
}

/* ── Keyframe injection ── */
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .login-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(14,165,233,0.4) !important;
  }
  .login-submit:active:not(:disabled) {
    transform: translateY(0);
  }
  .login-input:focus {
    background: white !important;
    border-color: #0ea5e9 !important;
    box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important;
  }
  .login-input.is-invalid:focus {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important;
  }
  .login-input::placeholder {
    color: #d1d5db;
    font-size: 13px;
  }
  .login-eye:hover {
    color: #0ea5e9 !important;
  }
`
if (!document.querySelector('#login-page-styles')) {
  styleTag.id = 'login-page-styles'
  document.head.appendChild(styleTag)
}

/* ── Constants ── */
const DEMO = { email: 'admin@gmail.com', password: 'Pass@123' }
const FEATURES = [
  'Real-time patient monitoring',
  'Secure role-based access',
  'Complete medical records',
  'Analytics & reporting',
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [rem, setRem] = useState(false)
  const [errs, setErrs] = useState({})
  const [gErr, setGErr] = useState('')
  const [load, setLoad] = useState(false)
  const [eF, setEF] = useState(false)
  const [pF, setPF] = useState(false)

  const ref = useRef(null)
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAppContext()

  useEffect(() => {
    if (isAuthenticated) { navigate('/', { replace: true }); return }
    ref.current?.focus()
  }, [isAuthenticated, navigate])

  const validate = useCallback(() => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!pass) e.pass = 'Password is required'
    else if (pass.length < 6) e.pass = 'Minimum 6 characters'
    return e
  }, [email, pass])

  const handleSubmit = useCallback(async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrs(e); return }
    setErrs({}); setGErr(''); setLoad(true)
    await new Promise(r => setTimeout(r, 900))
    if (email === DEMO.email && pass === DEMO.password) {
      login({ name: 'Dr. Admin', email }); navigate('/', { replace: true })
    } else { setGErr('Invalid email or password. Please try again.') }
    setLoad(false)
  }, [email, pass, validate, login, navigate])

  return (
    <div style={styles.page}>
      {/* ── Left Branding Panel (hidden on small screens via Bootstrap) ── */}
      <div className="d-none d-lg-flex" style={styles.left}>
        <div style={styles.logo}>
          <MedicineBoxOutlined style={{ fontSize: 28, color: 'white' }} />
        </div>
        <h1 style={styles.leftTitle}>
          Medi<span style={{ color: '#0ea5e9' }}>Care</span> HMS
        </h1>
        <p style={styles.leftSub}>
          A unified platform for patient records, vitals monitoring, and clinical workflows.
        </p>
        <div>
          {FEATURES.map(f => (
            <div key={f} style={styles.feat}>
              <span style={styles.featCheck}>✓</span>{f}
            </div>
          ))}
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4">
          <span style={styles.badge}>HIPAA</span>
          <span style={styles.badge}>ISO 27001</span>
          <span style={styles.badge}>HL7 FHIR</span>
        </div>
      </div>

      {/* ── Right Login Panel ── */}
      <div style={styles.right}>
        {/* Mobile logo — visible only on small screens */}
        <div className="d-lg-none" style={styles.mobileLogo}>
          <div style={styles.mobileLogoIcon}>
            <MedicineBoxOutlined style={{ fontSize: 17, color: 'white' }} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
            Medi<em style={{ color: '#0ea5e9', fontStyle: 'normal' }}>Care</em> HMS
          </span>
        </div>

        <h2 style={styles.formTitle}>Sign in</h2>
        <p style={styles.formSubtitle}>Enter your credentials to access the dashboard</p>

        <Form onSubmit={handleSubmit} noValidate>
          {/* Global error */}
          {gErr && (
            <Alert variant="danger" className="py-2 px-3 mb-3" style={{
              fontSize: 13, fontWeight: 500, borderLeft: '3px solid #ef4444',
              fontFamily: "'Outfit', sans-serif", borderRadius: 8,
            }}>
              ⚠ {gErr}
            </Alert>
          )}

          {/* Email field */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Email Address
            </Form.Label>
            <InputGroup>
              <InputGroup.Text style={{
                background: 'transparent', border: 'none',
                position: 'absolute', left: 0, top: 0, bottom: 0,
                zIndex: 4, display: 'flex', alignItems: 'center', paddingLeft: 12,
              }}>
                <UserOutlined style={styles.inputIcon(eF, !!errs.email)} />
              </InputGroup.Text>
              <Form.Control
                ref={ref}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEF(true)}
                onBlur={() => setEF(false)}
                placeholder="you@hospital.com"
                disabled={load}
                autoComplete="email"
                isInvalid={!!errs.email}
                className="login-input"
                style={{
                  height: 44, paddingLeft: 38,
                  borderRadius: 8, fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                  borderColor: errs.email ? '#fca5a5' : eF ? '#0ea5e9' : '#e5e7eb',
                  background: errs.email ? '#fff5f5' : '#fafafa',
                }}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                {errs.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Password field */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Password
            </Form.Label>
            <InputGroup>
              <InputGroup.Text style={{
                background: 'transparent', border: 'none',
                position: 'absolute', left: 0, top: 0, bottom: 0,
                zIndex: 4, display: 'flex', alignItems: 'center', paddingLeft: 12,
              }}>
                <LockOutlined style={styles.inputIcon(pF, !!errs.pass)} />
              </InputGroup.Text>
              <Form.Control
                type={show ? 'text' : 'password'}
                value={pass}
                onChange={e => setPass(e.target.value)}
                onFocus={() => setPF(true)}
                onBlur={() => setPF(false)}
                placeholder="Enter your password"
                disabled={load}
                autoComplete="current-password"
                isInvalid={!!errs.pass}
                className="login-input"
                style={{
                  height: 44, paddingLeft: 38, paddingRight: 42,
                  borderRadius: 8, fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                  borderColor: errs.pass ? '#fca5a5' : pF ? '#0ea5e9' : '#e5e7eb',
                  background: errs.pass ? '#fff5f5' : '#fafafa',
                }}
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                tabIndex={-1}
                className="login-eye"
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', zIndex: 4,
                  background: 'none', border: 'none',
                  color: '#9ca3af', cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center',
                  transition: 'color 0.18s',
                }}
              >
                {show
                  ? <EyeInvisibleOutlined style={{ fontSize: 15 }} />
                  : <EyeOutlined style={{ fontSize: 15 }} />}
              </button>
              <Form.Control.Feedback type="invalid" style={{ fontSize: 12 }}>
                {errs.pass}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Submit */}
          <Button
            type="submit"
            disabled={load}
            className="login-submit mb-3"
            style={styles.submitBtn(load)}
          >
            {load ? <><Spinner animation="border" size="sm" /> Signing in…</> : 'Sign In'}
          </Button>
        </Form>

        {/* Security row */}
        <div style={styles.securityRow}>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>
            🔒 SSL encrypted · HIPAA compliant · Session monitored
          </span>
        </div>

        {/* Demo credentials */}
        <Card style={styles.demoBox} className="border-0">
          <p style={styles.demoTitle} className="mb-2">Demo Credentials</p>
          <div className="d-flex justify-content-between align-items-center py-1">
            <span style={{ fontSize: 12, color: '#6b7280' }}>Email</span>
            <span style={styles.demoValue}>{DEMO.email}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center py-1">
            <span style={{ fontSize: 12, color: '#6b7280' }}>Password</span>
            <span style={styles.demoValue}>{DEMO.password}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}