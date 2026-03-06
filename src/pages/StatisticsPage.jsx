import React from 'react'
import styled, { keyframes } from 'styled-components'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useAllPatients } from '../hooks/usePatients'

const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`
const spin = keyframes`to{transform:rotate(360deg)}`

const Page = styled.div`animation:${fadeUp} 0.4s ease;`
const PTitle = styled.h1`font-size:22px;font-weight:800;color:${({ theme }) => theme.colors.dark};margin-bottom:4px;`
const PSub = styled.p`font-size:14px;color:${({ theme }) => theme.colors.muted};margin-bottom:22px;`
const SumRow = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:20px;`
const SCard = styled.div`
  background:${({ theme }) => theme.colors.bgCard};border-radius:${({ theme }) => theme.radius.md};
  padding:14px;text-align:center;box-shadow:${({ theme }) => theme.shadow.sm};
  border-top:3px solid ${({ $c }) => $c};transition:${({ theme }) => theme.transition};
  &:hover{transform:translateY(-2px);box-shadow:${({ theme }) => theme.shadow.md};}
`
const SVal = styled.div`font-size:24px;font-weight:800;color:${({ $c }) => $c};font-family:${({ theme }) => theme.fonts.mono};line-height:1;margin-bottom:5px;`
const SLbl = styled.div`font-size:11px;color:${({ theme }) => theme.colors.muted};font-weight:600;text-transform:uppercase;letter-spacing:0.5px;`
const Grid2 = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;@media(max-width:800px){grid-template-columns:1fr;}`
const Grid3 = styled.div`display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;@media(max-width:960px){grid-template-columns:1fr 1fr;}@media(max-width:600px){grid-template-columns:1fr;}`
const Full = styled.div`margin-bottom:16px;`
const CCard = styled.div`
  background:${({ theme }) => theme.colors.bgCard};border-radius:${({ theme }) => theme.radius.lg};
  padding:20px;box-shadow:${({ theme }) => theme.shadow.sm};transition:${({ theme }) => theme.transition};
  &:hover{box-shadow:${({ theme }) => theme.shadow.md};transform:translateY(-2px);}
`
const CT = styled.h3`font-size:14px;font-weight:700;color:${({ theme }) => theme.colors.dark};margin-bottom:2px;`
const CS = styled.p`font-size:12px;color:${({ theme }) => theme.colors.muted};margin-bottom:14px;`
const Loader = styled.div`
  display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:40vh;gap:14px;
  div{width:40px;height:40px;border:3px solid ${({ theme }) => theme.colors.border};border-top-color:${({ theme }) => theme.colors.primary};border-radius:50%;animation:${spin} 0.75s linear infinite;}
  p{font-size:14px;color:${({ theme }) => theme.colors.muted};}
`
const COLORS = ['#0ea5e9', '#7c3aed', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6']
const TICK = { fontSize: 12, fill: '#94a3b8', fontFamily: 'Outfit' }

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', color: 'white', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontFamily: 'Outfit', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      {label && <div style={{ fontWeight: 700, marginBottom: 6, color: '#0ea5e9' }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: '#94a3b8' }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function StatisticsPage() {
  const { stats, loading } = useAllPatients()

  if (loading) return <Loader><div /><p>Loading analytics…</p></Loader>
  if (!stats) return <div style={{ padding: 24, color: '#94a3b8' }}>No data available.</div>

  const males = stats.genderData.find(g => g.name === 'Male')?.value || 0
  const females = stats.genderData.find(g => g.name === 'Female')?.value || 0
  const avgAdm = Math.round(stats.monthlyData.reduce((s, m) => s + m.admissions, 0) / 12)

  return (
    <Page>
      <PTitle>Statistics & Analytics 📊</PTitle>
      <PSub>Insights from {stats.total} patient records</PSub>

      <SumRow>
        {[['Total', stats.total, '#0ea5e9'], ['Male', males, '#0ea5e9'], ['Female', females, '#ec4899'],
        ['Blood Types', stats.bloodData.length, '#7c3aed'], ['Avg Monthly', avgAdm, '#22c55e'], ['Critical', 6, '#ef4444']
        ].map(([l, v, c]) => (<SCard key={l} $c={c}><SVal $c={c}>{v}</SVal><SLbl>{l}</SLbl></SCard>))}
      </SumRow>

      <Full>
        <CCard>
          <CT>📅 Monthly Admissions & Discharges</CT><CS>12-month patient flow overview</CS>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={TICK} /><YAxis tick={TICK} />
              <Tooltip content={<Tip />} /><Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: 13 }} />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#gA)" />
              <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#22c55e" strokeWidth={2.5} fill="url(#gD)" />
            </AreaChart>
          </ResponsiveContainer>
        </CCard>
      </Full>

      <Grid2>
        <CCard>
          <CT>👥 Age Distribution</CT><CS>Patients by age bracket</CS>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={stats.ageData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={TICK} /><YAxis tick={TICK} /><Tooltip content={<Tip />} />
              <Bar dataKey="value" name="Patients" radius={[6, 6, 0, 0]}>
                {stats.ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CCard>
        <CCard>
          <CT>⚥ Gender Split</CT><CS>Male vs Female ratio</CS>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={stats.genderData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={85} innerRadius={48} paddingAngle={4}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {stats.genderData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<Tip />} /><Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </CCard>
      </Grid2>

      <Grid3>
        <CCard>
          <CT>🩸 Blood Groups</CT><CS>ABO type distribution</CS>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.bloodData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={TICK} /><YAxis dataKey="name" type="category" tick={{ ...TICK, fill: '#475569' }} width={32} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="count" name="Patients" radius={[0, 6, 6, 0]}>
                {stats.bloodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CCard>
        <CCard>
          <CT>⚖️ BMI Sample</CT><CS>First 14 patients</CS>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.bmiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ ...TICK, fontSize: 10 }} /><YAxis domain={[14, 36]} tick={TICK} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="bmi" name="BMI" stroke="#7c3aed" strokeWidth={2.5}
                dot={{ r: 3, fill: '#7c3aed', strokeWidth: 2, stroke: 'white' }} />
            </LineChart>
          </ResponsiveContainer>
        </CCard>
        <CCard>
          <CT>🏥 Vitals Radar</CT><CS>Ward A vs Ward B</CS>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={stats.radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Outfit' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Ward A" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.22} strokeWidth={2} />
              <Radar name="Ward B" dataKey="B" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} strokeWidth={2} />
              <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: 12 }} /><Tooltip content={<Tip />} />
            </RadarChart>
          </ResponsiveContainer>
        </CCard>
      </Grid3>
    </Page>
  )
}