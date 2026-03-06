import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  LogoutOutlined,
  HeartOutlined,
} from '@ant-design/icons'
import { useAppContext } from '../context/AppContext'

const SidebarWrap = styled.aside`
  width: ${({ $open }) => $open ? '250px' : '72px'};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.sidebar};
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: ${({ theme }) => theme.transition};
  z-index: 300;
  overflow: hidden;

  @media (max-width: 768px) {
    transform: ${({ $open }) => $open ? 'translateX(0)' : 'translateX(-100%)'};
    width: 250px;
  }
`

const LogoArea = styled.div`
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  min-height: 68px;
`

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: ${({ theme }) => theme.shadow.blue};
  font-size: 20px;
  color: white;
`

const LogoText = styled.div`
  opacity: ${({ $open }) => $open ? 1 : 0};
  transition: opacity 0.2s;
  white-space: nowrap;
  overflow: hidden;
`

const LogoTitle = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.4px;

  span { color: ${({ theme }) => theme.colors.primary}; }
`

const LogoSub = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
`

const Nav = styled.nav`
  flex: 1;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 12px 10px 6px;
  opacity: ${({ $open }) => $open ? 1 : 0};
  transition: opacity 0.2s;
  white-space: nowrap;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transition};
  position: relative;

  .anticon {
    font-size: 18px;
    flex-shrink: 0;
    transition: ${({ theme }) => theme.transition};
  }

  &:hover {
    background: rgba(14,165,233,0.1);
    color: ${({ theme }) => theme.colors.primary};
    transform: translateX(2px);

    .anticon { color: ${({ theme }) => theme.colors.primary}; }
  }

  &.active {
    background: linear-gradient(135deg,
      rgba(14,165,233,0.2) 0%,
      rgba(124,58,237,0.12) 100%
    );
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;

    .anticon { color: ${({ theme }) => theme.colors.primary}; }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20%;
      bottom: 20%;
      width: 3px;
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 0 3px 3px 0;
    }
  }

  .nav-label {
    opacity: ${({ $open }) => $open ? 1 : 0};
    transition: opacity 0.15s;
  }
`

const BottomArea = styled.div`
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,0.07);
`

const LogoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  transition: ${({ theme }) => theme.transition};
  white-space: nowrap;

  .anticon {
    font-size: 18px;
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(239,68,68,0.1);
    transform: translateX(2px);
  }

  .nav-label {
    opacity: ${({ $open }) => $open ? 1 : 0};
    transition: opacity 0.15s;
  }
`

const NAV_ITEMS = [
  { to: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { to: '/patients', icon: <TeamOutlined />, label: 'Patients' },
  { to: '/statistics', icon: <BarChartOutlined />, label: 'Statistics' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, logout } = useAppContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <SidebarWrap $open={sidebarOpen}>
      <LogoArea>
        <LogoIcon>
          <HeartOutlined style={{ fontSize: 20 }} />
        </LogoIcon>
        <LogoText $open={sidebarOpen}>
          <LogoTitle>Medi<span>Care</span></LogoTitle>
          <LogoSub>Hospital System</LogoSub>
        </LogoText>
      </LogoArea>

      <Nav>
        <SectionLabel $open={sidebarOpen}>Main Menu</SectionLabel>
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.to + item.label}
            to={item.to}
            end={item.to === '/'}
            $open={sidebarOpen}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </NavItem>
        ))}
      </Nav>

      <BottomArea>
        <LogoutBtn $open={sidebarOpen} onClick={handleLogout}>
          <LogoutOutlined />
          <span className="nav-label">Logout</span>
        </LogoutBtn>
      </BottomArea>
    </SidebarWrap>
  )
}