import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, MedicineBoxOutlined, LoadingOutlined } from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

/* ── Page Layout ── */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  background: #f1f5f9;
  font-family: 'Outfit', sans-serif;
`

/* ── Left Panel (Branding) ── */
const Left = styled.div`
  display: none;

  @media (min-width: 900px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    background: linear-gradient(160deg, #0f172a 0%, #0c2340 100%);
    padding: 48px;
  }
`

const Logo = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #0ea5e9, #0369a1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 0 0 10px rgba(14, 165, 233, 0.1);

  .anticon {
    font-size: 28px;
    color: white;
  }
`

const LeftTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-align: center;

  span {
    color: #0ea5e9;
  }
`

const LeftSubtitle = styled.p`
  font-size: 13px;
  color: #64748b;
  text-align: center;
  line-height: 1.7;
  max-width: 260px;
  margin: 0 auto 28px;
`

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Feat = styled.div`
  font-size: 13px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '✓';
    width: 20px;
    height: 20px;
    background: rgba(14, 165, 233, 0.15);
    color: #0ea5e9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    flex-shrink: 0;
  }
`

const Badges = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 32px;
`

const BadgeItem = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  border: 1px solid #1e3a52;
  border-radius: 5px;
  padding: 3px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

/* ── Right Panel (Login Form) ── */
const Right = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px 40px;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.06);
  animation: ${fadeUp} 0.4s ease both;

  @media (max-width: 899px) {
    max-width: 100%;
    box-shadow: none;
    padding: 40px 24px;
    align-items: center;
  }
`

const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;

  @media (min-width: 900px) {
    display: none;
  }

  .icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #0ea5e9, #0369a1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon .anticon {
    font-size: 17px;
    color: white;
  }

  span {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
  }

  em {
    color: #0ea5e9;
    font-style: normal;
  }
`

/* ── Form Elements ── */
const FormTitle = styled.h2`
  font-size: 21px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
  margin-bottom: 5px;
`

const FormSubtitle = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 24px;
`

const FormGroup = styled.div`
  margin-bottom: 14px;
`

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  pointer-events: none;
  display: flex;

  .anticon {
    font-size: 15px;
    transition: color 0.18s;
    color: ${({ $on, $err }) => $err ? '#ef4444' : $on ? '#0ea5e9' : '#d1d5db'};
  }
`

const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 ${({ $r }) => $r ? '42px' : '14px'} 0 38px;
  border: 1.5px solid ${({ $err, $on }) => $err ? '#fca5a5' : $on ? '#0ea5e9' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  color: #111827;
  background: ${({ $err }) => $err ? '#fff5f5' : '#fafafa'};
  outline: none;
  transition: all 0.18s;

  &:focus {
    background: white;
    border-color: ${({ $err }) => $err ? '#ef4444' : '#0ea5e9'};
    box-shadow: 0 0 0 3px ${({ $err }) => $err ? 'rgba(239,68,68,0.1)' : 'rgba(14,165,233,0.12)'};
  }

  &::placeholder {
    color: #d1d5db;
    font-size: 13px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Eye = styled.button`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: color 0.18s;

  &:hover {
    color: #0ea5e9;
  }

  .anticon {
    font-size: 15px;
  }
`

const ErrorText = styled.p`
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
`

/* ── Form Actions ── */
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;

  input {
    accent-color: #0ea5e9;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
`

const Forgot = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0ea5e9;
  cursor: pointer;
  transition: color 0.18s;

  &:hover {
    color: #0284c7;
  }
`

const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  color: white;
  border: none;
  background: ${({ $l }) => $l ? '#93c5fd' : 'linear-gradient(135deg, #0ea5e9, #0369a1)'};
  cursor: ${({ $l }) => $l ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: all 0.2s;
  box-shadow: ${({ $l }) => $l ? 'none' : '0 4px 14px rgba(14,165,233,0.35)'};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  .anticon-loading {
    animation: ${spin} 0.7s linear infinite;
  }
`

/* ── Error & Security ── */
const GlobalError = styled.div`
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  font-size: 13px;
  color: #b91c1c;
  font-weight: 500;
  margin-bottom: 14px;
`

const SecurityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 14px 0;
  border-top: 1px solid #f3f4f6;
  margin-bottom: 14px;

  span {
    font-size: 11px;
    color: #9ca3af;
  }
`

/* ── Demo Credentials ── */
const Demo = styled.div`
  background: #f9fafb;
  border: 1px dashed #e5e7eb;
  border-radius: 8px;
  padding: 12px 14px;
`

const DemoTitle = styled.p`
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`

const DemoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 0;
`

const DemoKey = styled.span`
  font-size: 12px;
  color: #6b7280;
`

const DemoValue = styled.span`
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #0369a1;
  background: #dbeafe;
  padding: 2px 8px;
  border-radius: 4px;
`

/* ── Constants ── */
const DEMO = { email: 'admin@gmail.com', password: 'Pass@123' }

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
    <Page>
      <Left>
        <Logo><MedicineBoxOutlined /></Logo>
        <LeftTitle>Medi<span>Care</span> HMS</LeftTitle>
        <LeftSubtitle>A unified platform for patient records, vitals monitoring, and clinical workflows.</LeftSubtitle>
        <Features>
          {['Real-time patient monitoring', 'Secure role-based access', 'Complete medical records', 'Analytics & reporting']
            .map(f => <Feat key={f}>{f}</Feat>)}
        </Features>
        <Badges><BadgeItem>HIPAA</BadgeItem><BadgeItem>ISO 27001</BadgeItem><BadgeItem>HL7 FHIR</BadgeItem></Badges>
      </Left>

      <Right>
        <MobileLogo>
          <div className="icon"><MedicineBoxOutlined /></div>
          <span>Medi<em>Care</em> HMS</span>
        </MobileLogo>
        <FormTitle>Sign in</FormTitle>
        <FormSubtitle>Enter your credentials to access the dashboard</FormSubtitle>

        <form onSubmit={handleSubmit} noValidate>
          {gErr && <GlobalError>⚠ {gErr}</GlobalError>}

          <FormGroup>
            <Label>Email Address</Label>
            <InputWrapper>
              <InputIcon $on={eF} $err={!!errs.email}><UserOutlined /></InputIcon>
              <Input ref={ref} type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setEF(true)} onBlur={() => setEF(false)}
                placeholder="you@hospital.com" $err={!!errs.email} $on={eF}
                disabled={load} autoComplete="email" />
            </InputWrapper>
            {errs.email && <ErrorText>{errs.email}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputWrapper>
              <InputIcon $on={pF} $err={!!errs.pass}><LockOutlined /></InputIcon>
              <Input type={show ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)}
                onFocus={() => setPF(true)} onBlur={() => setPF(false)}
                placeholder="Enter your password" $err={!!errs.pass} $on={pF} $r
                disabled={load} autoComplete="current-password" />
              <Eye type="button" onClick={() => setShow(v => !v)} tabIndex={-1}>
                {show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </Eye>
            </InputWrapper>
            {errs.pass && <ErrorText>{errs.pass}</ErrorText>}
          </FormGroup>

          <SubmitButton type="submit" $l={load} disabled={load}>
            {load ? <><LoadingOutlined /> Signing in…</> : 'Sign In'}
          </SubmitButton>
        </form>

        <SecurityRow><span>🔒 SSL encrypted · HIPAA compliant · Session monitored</span></SecurityRow>
        <Demo>
          <DemoTitle>Demo Credentials</DemoTitle>
          <DemoRow><DemoKey>Email</DemoKey><DemoValue>{DEMO.email}</DemoValue></DemoRow>
          <DemoRow><DemoKey>Password</DemoKey><DemoValue>{DEMO.password}</DemoValue></DemoRow>
        </Demo>
      </Right>
    </Page>
  )
}