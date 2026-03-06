import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { AppProvider, useAppContext } from './context/AppContext'
import LoginPage      from './pages/LoginPage'
import DashboardPage  from './pages/DashboardPage'
import PatientListPage from './pages/PatientListPage'
import StatisticsPage from './pages/StatisticsPage'
import Sidebar        from './components/Sidebar'
import Navbar         from './components/Navbar'

/* ── Styled Components: Creating Containers ── */
const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`

const MainArea = styled.div`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => $sidebarOpen ? '250px' : '72px'};
  transition: ${({ theme }) => theme.transition};
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 768px) { margin-left: 0; }
`

const PageContent = styled.main`
  flex: 1;
  padding: 84px 28px 28px;

  @media (max-width: 768px) { padding: 76px 14px 14px; }
`

function ProtectedLayout() {
  const { isAuthenticated, sidebarOpen } = useAppContext()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <Shell>
      <Sidebar />
      <MainArea $sidebarOpen={sidebarOpen}>
        <Navbar />
        <PageContent>
          <Routes>
            <Route path="/"          element={<DashboardPage />}   />
            <Route path="/patients"  element={<PatientListPage />}  />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="*"          element={<Navigate to="/" />} />
          </Routes>
        </PageContent>
      </MainArea>
    </Shell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*"     element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}