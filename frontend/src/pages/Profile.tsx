import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Award,
  Star,
  Briefcase,
  BookOpen,
  Users,
  TrendingUp,
  Camera,
  Shield,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const ProfileContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const AvatarSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  position: relative;
  overflow: hidden;
`;

const AvatarUpload = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  border: 3px solid ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserRole = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserBio = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const ProfileTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
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
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const TabContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-height: 100px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  ${({ theme, $variant = 'primary' }) => $variant === 'primary' ? `
    background: ${theme.colors.primary[500]};
    color: white;
    border: none;
    
    &:hover {
      background: ${theme.colors.primary[600]};
      transform: translateY(-1px);
    }
  ` : `
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[700]};
    border: 1px solid ${theme.colors.gray[300]};
    
    &:hover {
      background: ${theme.colors.gray[200]};
    }
  `}
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const AchievementCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const AchievementIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`;

const AchievementTitle = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AchievementDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      skills: '',
      experience: ''
    });
    setIsEditing(false);
  };

  const getUserStats = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'Questions', value: '12' },
          { label: 'Answers', value: '28' },
          { label: 'XP Points', value: user?.xp || '0' },
          { label: 'Level', value: user?.level || '1' }
        ];
      case 'tutor':
        return [
          { label: 'Students', value: '45' },
          { label: 'Answers', value: '89' },
          { label: 'Rating', value: '4.8' },
          { label: 'XP Points', value: user?.xp || '0' }
        ];
      case 'freelancer':
        return [
          { label: 'Projects', value: '8' },
          { label: 'Rating', value: '4.9' },
          { label: 'Earnings', value: '$2.4K' },
          { label: 'XP Points', value: user?.xp || '0' }
        ];
      default:
        return [
          { label: 'Users', value: '567' },
          { label: 'Questions', value: '1.2K' },
          { label: 'Projects', value: '89' },
          { label: 'Growth', value: '+12%' }
        ];
    }
  };

  const getAchievements = () => {
    return [
      { icon: Award, title: 'First Answer', description: 'Answered your first question', color: '#F59E0B' },
      { icon: Star, title: 'Top Contributor', description: 'Earned 1000+ XP points', color: '#8B5CF6' },
      { icon: Users, title: 'Mentor', description: 'Helped 10+ students', color: '#10B981' },
      { icon: Briefcase, title: 'Freelancer', description: 'Completed first project', color: '#3B82F6' }
    ];
  };

  const stats = getUserStats();
  const achievements = getAchievements();

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileHeader>
          <HeaderTop>
            <AvatarSection>
              <Avatar>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
                <AvatarUpload>
                  <Camera size={16} />
                </AvatarUpload>
              </Avatar>
            </AvatarSection>
            
            <UserInfo>
              <UserName>{user?.name || 'User Name'}</UserName>
              <UserRole>
                <Shield size={16} />
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </UserRole>
              <UserBio>
                Passionate about learning and sharing knowledge. Always ready to help others grow and succeed.
              </UserBio>
              <UserStats>
                {stats.map((stat, index) => (
                  <StatItem key={index}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </UserStats>
            </UserInfo>
            
            <EditButton onClick={() => setIsEditing(!isEditing)}>
              <Edit3 size={16} />
              Edit Profile
            </EditButton>
          </HeaderTop>
        </ProfileHeader>

        <ProfileTabs>
          <Tab $active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
            Personal Info
          </Tab>
          <Tab $active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')}>
            Achievements
          </Tab>
          <Tab $active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Settings
          </Tab>
        </ProfileTabs>

        <TabContent>
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormGrid>
                <FormGroup>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City, Country"
                  />
                </FormGroup>
              </FormGrid>
              
              <FormGroup>
                <Label>Bio</Label>
                <TextArea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Skills</Label>
                <Input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="JavaScript, React, Node.js..."
                />
              </FormGroup>
              
              {isEditing && (
                <ButtonGroup>
                  <Button $variant="secondary" onClick={handleCancel}>
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save size={16} />
                    Save Changes
                  </Button>
                </ButtonGroup>
              )}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AchievementGrid>
                {achievements.map((achievement, index) => (
                  <AchievementCard key={index}>
                    <AchievementIcon $color={achievement.color}>
                      <achievement.icon size={24} />
                    </AchievementIcon>
                    <AchievementTitle>{achievement.title}</AchievementTitle>
                    <AchievementDescription>{achievement.description}</AchievementDescription>
                  </AchievementCard>
                ))}
              </AchievementGrid>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormGroup>
                <Label>Notification Preferences</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked />
                    Email notifications for new messages
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked />
                    Push notifications for mentions
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" />
                    Weekly digest emails
                  </label>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Privacy Settings</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked />
                    Show profile to other users
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" defaultChecked />
                    Allow direct messages
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" />
                    Show online status
                  </label>
                </div>
              </FormGroup>
              
              <ButtonGroup>
                <Button>
                  <Settings size={16} />
                  Save Settings
                </Button>
              </ButtonGroup>
            </motion.div>
          )}
        </TabContent>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;