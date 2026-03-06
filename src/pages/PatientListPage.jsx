import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Table, Tag, Avatar, Modal } from 'antd'
import {
  SearchOutlined, UserOutlined, HeartOutlined, PhoneOutlined, MailOutlined,
  EnvironmentOutlined, MedicineBoxOutlined, DashboardOutlined, EyeOutlined,
  ExperimentOutlined, AlertOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CloseCircleOutlined, TeamOutlined
} from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'
// useSearch replaced — debounce logic is now inlined with useRef + useCallback

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Page Shell ── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease;
`

/* ── Header & Toolbar ── */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`

const Title = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const FilterTag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`

const ToolBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`

/* ── Search ── */
const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .anticon-search {
    position: absolute;
    left: 11px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.muted};
    z-index: 1;
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  height: 38px;
  padding: 0 12px 0 34px;
  border: 1.5px solid ${({ $v, theme }) => $v ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.dark};
  width: 220px;
  background: ${({ theme }) => theme.colors.bgCard};
  transition: ${({ theme }) => theme.transition};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
    width: 260px;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }
`

/* ── Gender Filter ── */
const GenderSelect = styled.select`
  height: 38px;
  padding: 0 12px;
  border: 1.5px solid ${({ $a, theme }) => $a ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  color: ${({ $a, theme }) => $a ? theme.colors.primary : theme.colors.text};
  background: ${({ $a, theme }) => $a ? theme.colors.primaryLight : theme.colors.bgCard};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ $a }) => $a ? '700' : '400'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition};

  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

/* ── Table ── */
const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;

  .ant-table {
    font-family: ${({ theme }) => theme.fonts.body} !important;
    font-size: 14px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc !important;
    font-weight: 700;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .ant-table-tbody > tr {
    cursor: pointer;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f9ff !important;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f8fafc;
    padding: 12px 16px;
  }
`

/* ── Table Cell Components ── */
const PatientCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const PatientName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 13px;
`

const PatientEmail = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 3px;

  .anticon {
    font-size: 11px;
  }
`

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $c }) => $c};
`

const ViewButton = styled.button`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.body};
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: ${({ theme }) => theme.transition};

  &:hover  { opacity: 0.82; transform: translateY(-1px); }
  &:active { transform: scale(0.96); }
`

/* ── Pagination ── */
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 18px;
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const PaginationInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};

  strong {
    color: ${({ theme }) => theme.colors.dark};
  }
`

const PaginationButtons = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const PageButton = styled.button`
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
  font-weight: ${({ $a }) => $a ? '700' : '500'};
  font-family: ${({ theme }) => theme.fonts.body};
  background: ${({ $a, theme }) =>
    $a
      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      : theme.colors.bgCard};
  color: ${({ $a, theme }) => $a ? 'white' : theme.colors.text};
  border: 1px solid ${({ $a, theme }) => $a ? 'transparent' : theme.colors.border};
  box-shadow: ${({ $a, theme }) => $a ? theme.shadow.blue : 'none'};
  opacity: ${({ $d }) => $d ? 0.38 : 1};
  cursor: ${({ $d }) => $d ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transition};

  &:hover:not(:disabled) {
    background: ${({ $a, theme }) =>
    $a
      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
      : theme.colors.primaryLight};
    border-color: ${({ $a, theme }) => $a ? 'transparent' : theme.colors.primary};
  }
`

/* ── Patient Modal ── */
const Banner = styled.div`
  height: 80px;
  background: linear-gradient(135deg, #0f172a, #0ea5e9, #7c3aed);
  border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
  margin: -24px -24px 0;
`

const ProfileTop = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-top: -32px;
  margin-bottom: 14px;
  padding: 0 2px;
`

const ModalName = styled.h3`
  font-size: 17px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 2px;
`

const ModalSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  display: flex;
  align-items: center;
  gap: 5px;

  .anticon {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.primary};
  }
`

/* ── Modal Info Grid ── */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`

const InfoItem = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 9px 11px;
`

const InfoLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 3px;

  .anticon {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.primary};
  }
`

const InfoValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`

/* ── Vitals Row ── */
const VitalsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
`

const VitalBox = styled.div`
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $bd }) => $bd};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 10px 6px;
  text-align: center;

  .anticon {
    font-size: 18px;
    color: ${({ $ic }) => $ic};
    display: block;
    margin-bottom: 4px;
  }
`

const VitalValue = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: ${({ $c }) => $c};
  font-family: ${({ theme }) => theme.fonts.mono};
  line-height: 1;
`

const VitalLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 3px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`

/* ── Constants & Helpers ── */
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const getStatusMeta = id => {
  const s = id % 4
  if (s === 0) return { label: 'Critical', color: '#ef4444', icon: <AlertOutlined /> }
  if (s === 1) return { label: 'Active', color: '#22c55e', icon: <CheckCircleOutlined /> }
  if (s === 2) return { label: 'Recovering', color: '#f59e0b', icon: <ClockCircleOutlined /> }
  return { label: 'Stable', color: '#0ea5e9', icon: <CloseCircleOutlined /> }
}

export default function PatientListPage() {
  const { patients, totalPatients, loading, error,
    searchQuery, setSearchQuery, genderFilter, setGenderFilter,
    currentPage, setCurrentPage, pageSize } = useAppContext()
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)   // debounce timer (replaces useSearch hook)
  const [sel, setSel] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    pageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentPage, genderFilter])

  // Debounced search — inline replacement for useSearch custom hook
  const handleSearch = useCallback((value) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setSearchQuery(value)
      setCurrentPage(1)
    }, 450)
  }, [setSearchQuery, setCurrentPage])

  const handleGender = useCallback(e => {
    setGenderFilter(e.target.value); setCurrentPage(1)
  }, [setGenderFilter, setCurrentPage])

  const openModal = useCallback(p => { setSel(p); setOpen(true) }, [])
  const totalPages = Math.ceil(totalPatients / pageSize)
  const start = totalPatients === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalPatients)

  const getPages = () => {
    if (!totalPages) return []
    const pages = [], d = 2
    for (let i = Math.max(1, currentPage - d); i <= Math.min(totalPages, currentPage + d); i++) pages.push(i)
    if (pages[0] > 1) { pages.unshift('…'); pages.unshift(1) }
    if (pages[pages.length - 1] < totalPages) { pages.push('…'); pages.push(totalPages) }
    return pages
  }

  const cols = [
    {
      title: 'Patient', key: 'p', render: (_, r) => (
        <PatientCell>
          <Avatar src={r.image} size={40} icon={<UserOutlined />} />
          <div><PatientName>{r.firstName} {r.lastName}</PatientName>
            <PatientEmail><MailOutlined />{r.email}</PatientEmail></div>
        </PatientCell>)
    },
    {
      title: 'Age / Gender', key: 'a', render: (_, r) => (
        <div><div style={{ fontWeight: 700 }}>{r.age} yrs</div>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' }}>{r.gender}</div></div>)
    },
    {
      title: 'Blood Group', key: 'b', render: (_, r) => (
        <Tag icon={<ExperimentOutlined />} color="geekblue" style={{ fontWeight: 700 }}>
          {r.bloodGroup || BLOOD_GROUPS[r.id % 8]}</Tag>)
    },
    {
      title: 'Phone', dataIndex: 'phone', key: 'ph', render: v => (
        <span style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
          <PhoneOutlined style={{ color: '#0ea5e9' }} />{v}</span>)
    },
    { title: 'Status', key: 'st', render: (_, r) => { const s = getStatusMeta(r.id); return <StatusBadge $c={s.color}>{s.icon}{s.label}</StatusBadge> } },
    {
      title: 'Action', key: 'ac', render: (_, r) => (
        <ViewButton onClick={e => { e.stopPropagation(); openModal(r) }}><EyeOutlined />View</ViewButton>)
    },
  ]

  const mv = sel ? (() => {
    const bmi = (sel.weight / ((sel.height / 100) ** 2)).toFixed(1)
    return { bmi, hr: 60 + (sel.id % 40), bpS: 100 + (sel.id % 40), bpD: 60 + (sel.id % 20), o2: 94 + (sel.id % 6) }
  })() : null

  if (error) return <div style={{ color: '#ef4444', padding: 24 }}>⚠ {error}</div>

  return (
    <Page>
      <div ref={pageRef} />
      <Header>
        <Title>
          <TeamOutlined style={{ color: '#0ea5e9' }} />Patients
          {genderFilter
            ? <FilterTag>{genderFilter} · {totalPatients} found</FilterTag>
            : <FilterTag style={{ background: 'transparent', borderColor: 'transparent', color: '#94a3b8' }}>{totalPatients} total</FilterTag>}
        </Title>
        <ToolBar>
          <SearchWrapper>
            <SearchOutlined />
            <SearchInput ref={inputRef} $v={!!searchQuery} defaultValue={searchQuery}
              onChange={e => handleSearch(e.target.value)} placeholder="Search patients…" />
          </SearchWrapper>
          <GenderSelect value={genderFilter} onChange={handleGender} $a={!!genderFilter}>
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </GenderSelect>
        </ToolBar>
      </Header>

      <TableContainer>
        <Table dataSource={patients} columns={cols} rowKey="id" loading={loading}
          pagination={false} onRow={r => ({ onClick: () => openModal(r) })} />
      </TableContainer>

      {totalPatients > 0 && (
        <PaginationWrapper>
          <PaginationInfo>Showing <strong>{start}–{end}</strong> of <strong>{totalPatients}</strong>{' '}
            {genderFilter ? <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{genderFilter} patients</span> : 'patients'}
          </PaginationInfo>
          <PaginationButtons>
            <PageButton $d={currentPage === 1} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</PageButton>
            {getPages().map((p, i) => p === '…'
              ? <span key={`d${i}`} style={{ color: '#94a3b8', padding: '0 4px' }}>…</span>
              : <PageButton key={p} $a={p === currentPage} onClick={() => setCurrentPage(p)}>{p}</PageButton>)}
            <PageButton $d={currentPage === totalPages || !totalPages} disabled={currentPage === totalPages || !totalPages}
              onClick={() => setCurrentPage(p => p + 1)}>Next →</PageButton>
          </PaginationButtons>
        </PaginationWrapper>
      )}

      <Modal open={open} onCancel={() => setOpen(false)} footer={null} width={540} title={null}
        styles={{ body: { padding: '24px', fontFamily: 'Outfit,sans-serif' } }}>
        {sel && (
          <div>
            <Banner />
            <ProfileTop>
              <Avatar src={sel.image} size={68} icon={<UserOutlined />}
                style={{ border: '3px solid white', marginTop: -28, flexShrink: 0 }} />
              <div>
                <ModalName>{sel.firstName} {sel.lastName}</ModalName>
                <ModalSubtitle><MedicineBoxOutlined />ID #{sel.id} · {sel.age} yrs · {sel.gender} · {sel.bloodGroup}</ModalSubtitle>
              </div>
            </ProfileTop>
            <InfoGrid>
              {[['Email', <MailOutlined />, sel.email], ['Phone', <PhoneOutlined />, sel.phone],
              ['City', <EnvironmentOutlined />, sel.address?.city], ['State', <EnvironmentOutlined />, sel.address?.state],
              ['Height', <UserOutlined />, `${sel.height} cm`], ['Weight', <DashboardOutlined />, `${sel.weight} kg`],
              ['Blood Group', <ExperimentOutlined />, sel.bloodGroup], ['Status', <HeartOutlined />, getStatusMeta(sel.id).label]
              ].map(([l, ic, v]) => (<InfoItem key={l}><InfoLabel>{ic}{l}</InfoLabel><InfoValue>{v}</InfoValue></InfoItem>))}
            </InfoGrid>
            {mv && (
              <VitalsRow>
                <VitalBox $bg="rgba(239,68,68,0.07)" $bd="rgba(239,68,68,0.2)" $ic="#ef4444">
                  <HeartOutlined /><VitalValue $c="#ef4444">{mv.hr} bpm</VitalValue><VitalLabel>Heart Rate</VitalLabel></VitalBox>
                <VitalBox $bg="rgba(14,165,233,0.07)" $bd="rgba(14,165,233,0.2)" $ic="#0ea5e9">
                  <DashboardOutlined /><VitalValue $c="#0ea5e9">{mv.bpS}/{mv.bpD}</VitalValue><VitalLabel>Blood Pressure</VitalLabel></VitalBox>
                <VitalBox $bg="rgba(124,58,237,0.07)" $bd="rgba(124,58,237,0.2)" $ic="#7c3aed">
                  <ExperimentOutlined /><VitalValue $c="#7c3aed">{mv.bmi}</VitalValue><VitalLabel>BMI</VitalLabel></VitalBox>
                <VitalBox $bg="rgba(34,197,94,0.07)" $bd="rgba(34,197,94,0.2)" $ic="#22c55e">
                  <MedicineBoxOutlined /><VitalValue $c="#22c55e">{mv.o2}%</VitalValue><VitalLabel>O₂ Sat.</VitalLabel></VitalBox>
              </VitalsRow>
            )}
          </div>
        )}
      </Modal>
    </Page>
  )
}