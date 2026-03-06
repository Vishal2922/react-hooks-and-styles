import React from 'react'
import styled from 'styled-components'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  WarningFilled,
  UserOutlined,
} from '@ant-design/icons'
import { Badge } from 'antd'
import { useAppContext } from '../context/AppContext'

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: ${({ $sidebarOpen }) => $sidebarOpen ? '250px' : '72px'};
  right: 0;
  height: 64px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 200;
  transition: ${({ theme }) => theme.transition};

  @media (max-width: 768px) {
    left: 0;
    padding: 0 14px;
  }
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`

const ToggleBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transition};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active { transform: scale(0.93); }
`

const PageLabel = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  letter-spacing: -0.3px;
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const NavBadgeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $bg }) => $bg};
  cursor: default;
`

const NavBadgeText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

const AvatarBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  color: white;
  font-weight: 800;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    transform: scale(1.08);
    box-shadow: ${({ theme }) => theme.shadow.blue};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.colors.success};
    border-radius: 50%;
    border: 2px solid white;
  }
`

export default function Navbar() {
  const { sidebarOpen, toggleSidebar, user, totalPatients } = useAppContext()

  return (
    <Bar $sidebarOpen={sidebarOpen}>
      <Left>
        <ToggleBtn onClick={toggleSidebar} title="Toggle sidebar">
          {sidebarOpen
            ? <MenuFoldOutlined />
            : <MenuUnfoldOutlined />
          }
        </ToggleBtn>
        <PageLabel>MediCare Dashboard</PageLabel>
      </Left>

      <Right>
        {/* Patients count badge */}
        <NavBadgeWrap $bg="rgba(14,165,233,0.1)">
          <TeamOutlined style={{ color: '#0ea5e9', fontSize: 15 }} />
          <NavBadgeText $color="#0ea5e9">{totalPatients || 0} Patients</NavBadgeText>
        </NavBadgeWrap>

        {/* Critical badge */}
        <NavBadgeWrap $bg="rgba(239,68,68,0.1)">
          <WarningFilled style={{ color: '#ef4444', fontSize: 15 }} />
          <NavBadgeText $color="#ef4444">6 Critical</NavBadgeText>
        </NavBadgeWrap>

        {/* Avatar */}
        <AvatarBtn title={user?.name || 'Admin'}>
          <UserOutlined style={{ fontSize: 16 }} />
        </AvatarBtn>
      </Right>
    </Bar>
  )
}