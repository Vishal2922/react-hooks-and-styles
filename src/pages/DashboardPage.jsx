import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Alert } from 'react-bootstrap'
import {
  TeamOutlined, HeartOutlined, WarningFilled, CheckCircleFilled,
  RiseOutlined, FallOutlined, UserAddOutlined, BarChartOutlined,
  CalendarOutlined, MedicineBoxOutlined
} from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`

const Page = styled.div`animation:${fadeUp} 0.4s ease;`
const Title = styled.h1`font-size:22px;font-weight:800;color:${({ theme }) => theme.colors.dark};margin-bottom:4px;`
const Sub = styled.p`font-size:14px;color:${({ theme }) => theme.colors.muted};margin-bottom:24px;`

const Grid4 = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;`
const Card = styled.div`
  background:${({ theme }) => theme.colors.bgCard}; border-radius:${({ theme }) => theme.radius.lg};
  padding:20px; display:flex; gap:14px; align-items:center;
  border-left:4px solid ${({ $c }) => $c || '#0ea5e9'};
  box-shadow:${({ theme }) => theme.shadow.sm}; transition:${({ theme }) => theme.transition};
  &:hover{transform:translateY(-2px);box-shadow:${({ theme }) => theme.shadow.md};}
`
const CIco = styled.div`
  width:48px;height:48px;border-radius:${({ theme }) => theme.radius.md};
  background:${({ $bg }) => $bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;
  .anticon{font-size:24px;color:${({ $c }) => $c};}
`
const CInfo = styled.div``
const CLbl = styled.p`font-size:11px;font-weight:600;color:${({ theme }) => theme.colors.muted};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:3px;`
const CVal = styled.h3`font-size:28px;font-weight:800;color:${({ theme }) => theme.colors.dark};line-height:1;margin-bottom:4px;`
const CChg = styled.span`
  font-size:11px;font-weight:700;padding:2px 8px;border-radius:${({ theme }) => theme.radius.full};
  background:${({ $up, theme }) => $up ? theme.colors.successLight : theme.colors.dangerLight};
  color:${({ $up, theme }) => $up ? theme.colors.success : theme.colors.danger};
  display:inline-flex;align-items:center;gap:3px;
`
const STitle = styled.h2`font-size:16px;font-weight:700;color:${({ theme }) => theme.colors.dark};margin-bottom:14px;`
const Grid3 = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;`
const QCard = styled.div`
  background:${({ theme }) => theme.colors.bgCard};border-radius:${({ theme }) => theme.radius.lg};
  padding:20px;text-align:center;cursor:pointer;border:2px solid transparent;
  box-shadow:${({ theme }) => theme.shadow.sm};transition:${({ theme }) => theme.transition};
  .anticon{font-size:28px;color:${({ $c }) => $c};margin-bottom:8px;display:block;transition:${({ theme }) => theme.transition};}
  &:hover{border-color:${({ $c }) => $c};transform:translateY(-2px);box-shadow:${({ theme }) => theme.shadow.md};
    .anticon{transform:scale(1.12);}}
  &:active{transform:scale(0.97);}
`
const QL = styled.div`font-size:14px;font-weight:700;color:${({ theme }) => theme.colors.dark};margin-bottom:3px;`
const QS = styled.div`font-size:12px;color:${({ theme }) => theme.colors.muted};`

const STATS = [
  { icon: <TeamOutlined />, label: 'Total Patients', key: 'total', fallback: 208, change: '+12 this week', up: true, accent: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', ic: '#0ea5e9' },
  { icon: <HeartOutlined />, label: 'Active Today', val: 47, change: '+5 since AM', up: true, accent: '#22c55e', bg: 'rgba(34,197,94,0.1)', ic: '#22c55e' },
  { icon: <WarningFilled />, label: 'Critical Cases', val: 6, change: '+2 today', up: false, accent: '#ef4444', bg: 'rgba(239,68,68,0.1)', ic: '#ef4444' },
  { icon: <CheckCircleFilled />, label: 'Discharged Today', val: 18, change: '+3 vs avg', up: true, accent: '#7c3aed', bg: 'rgba(124,58,237,0.1)', ic: '#7c3aed' },
]
const QUICK = [
  { icon: <UserAddOutlined />, label: 'Patients', sub: 'View records', path: '/patients', c: '#0ea5e9' },
  { icon: <BarChartOutlined />, label: 'Statistics', sub: 'Charts & data', path: '/statistics', c: '#7c3aed' },
  { icon: <CalendarOutlined />, label: 'Appointments', sub: '12 today', path: '/patients', c: '#22c55e' },
  { icon: <MedicineBoxOutlined />, label: 'Prescriptions', sub: '34 active', path: '/patients', c: '#f59e0b' },
]

export default function DashboardPage() {
  const { totalPatients, user } = useAppContext()
  const navigate = useNavigate()

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  }, [])

  return (
    <Page>
      <Title>{greeting}, {user?.name || 'Doctor'} 👋</Title>
      <Sub>Here is your hospital overview for today</Sub>

      <Alert variant="danger" style={{ borderRadius: 10, fontFamily: 'Outfit', fontSize: 14, marginBottom: 10 }}>
        <WarningFilled style={{ marginRight: 8 }} /><strong>Critical:</strong> Patient #6 — ICU attention required.
      </Alert>
      <Alert variant="warning" style={{ borderRadius: 10, fontFamily: 'Outfit', fontSize: 14, marginBottom: 20 }}>
        <WarningFilled style={{ marginRight: 8 }} /><strong>Notice:</strong> 3 patients due for follow-up today.
      </Alert>

      <Grid4>
        {STATS.map(s => (
          <Card key={s.label} $c={s.accent}>
            <CIco $bg={s.bg} $c={s.ic}>{s.icon}</CIco>
            <CInfo>
              <CLbl>{s.label}</CLbl>
              <CVal>{s.key === 'total' && totalPatients ? totalPatients : s.val ?? s.fallback}</CVal>
              <CChg $up={s.up}>{s.up ? <RiseOutlined /> : <FallOutlined />} {s.change}</CChg>
            </CInfo>
          </Card>
        ))}
      </Grid4>

      <STitle>Quick Access</STitle>
      <Grid3>
        {QUICK.map(c => (
          <QCard key={c.label} $c={c.c} onClick={() => navigate(c.path)}>
            {c.icon}<QL>{c.label}</QL><QS>{c.sub}</QS>
          </QCard>
        ))}
      </Grid3>
    </Page>
  )
}