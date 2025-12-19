import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users,
  BarChart3,
  Shield,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Star,
  Award,
  Activity,
  UserCheck,
  UserX,
  Flag,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $positive }) => $positive ? theme.colors.success[600] : theme.colors.error[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  color: ${({ theme, $active }) => $active ? theme.colors.primary[600] : theme.colors.gray[600]};
  font-weight: ${({ theme, $active }) => $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary[500] : 'transparent'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ContentSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const SectionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-color: ${({ theme }) => theme.colors.primary[500]};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const StatusBadge = styled.span<{ $status: 'active' | 'inactive' | 'suspended' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'active':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'inactive':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
      default:
        return '';
    }
  }}
`;

const RoleBadge = styled.span<{ $role: 'student' | 'tutor' | 'freelancer' | 'admin' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  ${({ $role, theme }) => {
    switch ($role) {
      case 'student':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case 'tutor':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'freelancer':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
      case 'admin':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      default:
        return '';
    }
  }}
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ChartContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      label: 'Total Users',
      value: '12,847',
      trend: '+12%',
      positive: true,
      icon: Users,
      color: '#3B82F6'
    },
    {
      label: 'Active Sessions',
      value: '3,421',
      trend: '+8%',
      positive: true,
      icon: Activity,
      color: '#10B981'
    },
    {
      label: 'Revenue',
      value: '$89,432',
      trend: '+23%',
      positive: true,
      icon: DollarSign,
      color: '#8B5CF6'
    },
    {
      label: 'Support Tickets',
      value: '127',
      trend: '-15%',
      positive: false,
      icon: MessageSquare,
      color: '#F59E0B'
    }
  ];

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student' as const,
      status: 'active' as const,
      joinDate: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'tutor' as const,
      status: 'active' as const,
      joinDate: '2023-11-20',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'freelancer' as const,
      status: 'suspended' as const,
      joinDate: '2024-02-10',
      lastActive: '1 week ago'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david@example.com',
      role: 'student' as const,
      status: 'inactive' as const,
      joinDate: '2024-03-01',
      lastActive: 'Never'
    },
    {
      id: 5,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin' as const,
      status: 'active' as const,
      joinDate: '2023-01-01',
      lastActive: '5 minutes ago'
    }
  ];

  const renderOverview = () => (
    <>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon size={24} />
              </StatIcon>
              <StatTrend $positive={stat.positive}>
                <TrendingUp size={16} />
                {stat.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentSection>
        <SectionHeader>
          <SectionTitle>Analytics Overview</SectionTitle>
          <SectionActions>
            <ActionButton>
              <Calendar size={16} />
              Last 30 days
              <ChevronDown size={16} />
            </ActionButton>
            <ActionButton>
              <Download size={16} />
              Export
            </ActionButton>
          </SectionActions>
        </SectionHeader>
        <ChartContainer>
          <div>Analytics charts would be rendered here</div>
        </ChartContainer>
      </ContentSection>
    </>
  );

  const renderUsers = () => (
    <ContentSection>
      <SectionHeader>
        <SectionTitle>User Management</SectionTitle>
        <SectionActions>
          <SearchContainer>
            <SearchIcon size={16} />
            <SearchInput
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          <ActionButton>
            <Filter size={16} />
            Filter
          </ActionButton>
          <ActionButton>
            <RefreshCw size={16} />
            Refresh
          </ActionButton>
          <PrimaryButton>
            <Plus size={16} />
            Add User
          </PrimaryButton>
        </SectionActions>
      </SectionHeader>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>User</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Join Date</TableHeaderCell>
            <TableHeaderCell>Last Active</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {mockUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <UserInfo>
                  <UserAvatar>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{user.name}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserDetails>
                </UserInfo>
              </TableCell>
              <TableCell>
                <RoleBadge $role={user.role}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </RoleBadge>
              </TableCell>
              <TableCell>
                <StatusBadge $status={user.status}>
                  {user.status === 'active' && <CheckCircle size={12} />}
                  {user.status === 'inactive' && <Clock size={12} />}
                  {user.status === 'suspended' && <XCircle size={12} />}
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell>{user.lastActive}</TableCell>
              <TableCell>
                <ActionMenu>
                  <MenuButton>
                    <MoreHorizontal size={16} />
                  </MenuButton>
                </ActionMenu>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ContentSection>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>Content Moderation</SectionTitle>
            </SectionHeader>
            <ChartContainer>
              Content moderation tools would be here
            </ChartContainer>
          </ContentSection>
        );
      case 'reports':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>Reports & Analytics</SectionTitle>
            </SectionHeader>
            <ChartContainer>
              Detailed reports and analytics would be here
            </ChartContainer>
          </ContentSection>
        );
      case 'settings':
        return (
          <ContentSection>
            <SectionHeader>
              <SectionTitle>System Settings</SectionTitle>
            </SectionHeader>
            <ChartContainer>
              System configuration settings would be here
            </ChartContainer>
          </ContentSection>
        );
      default:
        return renderOverview();
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <AdminContainer>
        <AdminContent>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Shield size={64} color="#EF4444" />
            <h2 style={{ marginTop: '1rem', color: '#374151' }}>Access Denied</h2>
            <p style={{ color: '#6B7280' }}>You don't have permission to access this page.</p>
          </div>
        </AdminContent>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminContent>
        <Header>
          <Title>Admin Dashboard</Title>
          <Subtitle>Manage users, content, and system settings</Subtitle>
        </Header>

        <TabsContainer>
          <Tab $active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </Tab>
          <Tab $active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            Users
          </Tab>
          <Tab $active={activeTab === 'content'} onClick={() => setActiveTab('content')}>
            Content
          </Tab>
          <Tab $active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
            Reports
          </Tab>
          <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Settings
          </Tab>
        </TabsContainer>

        {renderContent()}
      </AdminContent>
    </AdminContainer>
  );
};

export default Admin;