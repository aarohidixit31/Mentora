import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Briefcase, 
  TrendingUp,
  Award,
  Clock,
  Plus,
  ArrowRight,
  Star,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const WelcomeMessage = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
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

const QuickActions = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    background: ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActionTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const ActionDescription = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;

const RecentActivity = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActivityTime = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getStats = () => {
    switch (user?.role) {
      case 'student':
        return [
          { icon: MessageCircle, label: 'Questions Asked', value: '12', color: '#3B82F6' },
          { icon: BookOpen, label: 'Answers Received', value: '28', color: '#10B981' },
          { icon: Award, label: 'XP Points', value: user?.xp || '0', color: '#F59E0B' },
          { icon: TrendingUp, label: 'Level', value: user?.level || '1', color: '#8B5CF6' }
        ];
      case 'tutor':
        return [
          { icon: Users, label: 'Students Helped', value: '45', color: '#10B981' },
          { icon: MessageCircle, label: 'Answers Given', value: '89', color: '#3B82F6' },
          { icon: Star, label: 'Average Rating', value: '4.8', color: '#F59E0B' },
          { icon: Award, label: 'XP Points', value: user?.xp || '0', color: '#8B5CF6' }
        ];
      case 'freelancer':
        return [
          { icon: Briefcase, label: 'Projects Completed', value: '8', color: '#10B981' },
          { icon: Star, label: 'Client Rating', value: '4.9', color: '#F59E0B' },
          { icon: TrendingUp, label: 'Earnings', value: '$2,450', color: '#8B5CF6' },
          { icon: Award, label: 'XP Points', value: user?.xp || '0', color: '#3B82F6' }
        ];
      default:
        return [
          { icon: MessageCircle, label: 'Total Questions', value: '1,234', color: '#3B82F6' },
          { icon: Users, label: 'Active Users', value: '567', color: '#10B981' },
          { icon: Briefcase, label: 'Projects', value: '89', color: '#F59E0B' },
          { icon: TrendingUp, label: 'Growth', value: '+12%', color: '#8B5CF6' }
        ];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case 'student':
        return [
          { icon: Plus, title: 'Ask Question', description: 'Get help with your doubts', link: '/ask-zone', color: '#3B82F6' },
          { icon: Users, title: 'Find Mentor', description: 'Connect with experts', link: '/mentors', color: '#10B981' },
          { icon: BookOpen, title: 'Browse Questions', description: 'Learn from others', link: '/ask-zone', color: '#F59E0B' }
        ];
      case 'tutor':
        return [
          { icon: MessageCircle, title: 'Answer Questions', description: 'Help students learn', link: '/ask-zone', color: '#3B82F6' },
          { icon: Users, title: 'My Sessions', description: 'Manage your sessions', link: '/sessions', color: '#10B981' },
          { icon: Award, title: 'My Profile', description: 'Update your expertise', link: '/profile', color: '#8B5CF6' }
        ];
      case 'freelancer':
        return [
          { icon: Briefcase, title: 'Browse Projects', description: 'Find new opportunities', link: '/freelance', color: '#3B82F6' },
          { icon: Plus, title: 'Post Service', description: 'Offer your skills', link: '/freelance', color: '#10B981' },
          { icon: TrendingUp, title: 'My Portfolio', description: 'Showcase your work', link: '/profile', color: '#F59E0B' }
        ];
      default:
        return [
          { icon: Users, title: 'Manage Users', description: 'User administration', link: '/admin', color: '#3B82F6' },
          { icon: TrendingUp, title: 'Analytics', description: 'Platform insights', link: '/admin', color: '#10B981' },
          { icon: MessageCircle, title: 'Content Moderation', description: 'Review reports', link: '/admin', color: '#F59E0B' }
        ];
    }
  };

  const getRecentActivity = () => {
    const activities = [
      { icon: MessageCircle, text: 'New question posted in Mathematics', time: '2 minutes ago', color: '#3B82F6' },
      { icon: Award, text: 'You earned 50 XP for helping a student', time: '1 hour ago', color: '#F59E0B' },
      { icon: Users, text: 'New mentor match request received', time: '3 hours ago', color: '#10B981' },
      { icon: Briefcase, text: 'Project proposal submitted', time: '1 day ago', color: '#8B5CF6' },
      { icon: Star, text: 'Received 5-star rating from client', time: '2 days ago', color: '#F59E0B' }
    ];
    return activities.slice(0, 4);
  };

  const stats = getStats();
  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

  return (
    <DashboardContainer>
      <DashboardContent>
        <Header>
          <WelcomeMessage>
            Welcome back, {user?.name}! 👋
          </WelcomeMessage>
          <Subtitle>
            Here's what's happening with your {user?.role} account today.
          </Subtitle>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatHeader>
                <StatIcon $color={stat.color}>
                  <stat.icon size={24} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <QuickActions>
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionsGrid>
            {quickActions.map((action, index) => (
              <ActionCard
                key={action.title}
                to={action.link}
              >
                <ActionIcon $color={action.color}>
                  <action.icon size={28} />
                </ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDescription>{action.description}</ActionDescription>
              </ActionCard>
            ))}
          </ActionsGrid>
        </QuickActions>

        <RecentActivity>
          <SectionTitle>Recent Activity</SectionTitle>
          {recentActivity.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon $color={activity.color}>
                <activity.icon size={20} />
              </ActivityIcon>
              <ActivityContent>
                <ActivityText>{activity.text}</ActivityText>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </RecentActivity>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;