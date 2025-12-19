import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Video,
  Award,
  BookOpen,
  Users,
  Calendar,
  ChevronDown,
  Heart,
  Share2,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MessageModal from '../components/messaging/MessageModal';
import SessionBookingModal from '../components/booking/SessionBookingModal';

const MentorsContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const MentorsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto;
`;

const SearchAndFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
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

const FilterButton = styled.button`
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
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const MentorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MentorCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const MentorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MentorAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  flex-shrink: 0;
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: ${({ theme }) => theme.colors.success[500]};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const MentorInfo = styled.div`
  flex: 1;
`;

const MentorName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MentorTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MentorRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const RatingText = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MentorLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const MentorActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button`
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

const MentorBio = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MentorSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Skill = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const MentorStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: 2px;
`;

const MentorPricing = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PriceInfo = styled.div``;

const PriceAmount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const PriceUnit = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
`;

const AvailabilityBadge = styled.div<{ $available: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme, $available }) => $available ? theme.colors.success[100] : theme.colors.warning[100]};
  color: ${({ theme, $available }) => $available ? theme.colors.success[700] : theme.colors.warning[700]};
`;

const MentorFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ContactButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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
    background: ${theme.colors.white};
    color: ${theme.colors.gray[700]};
    border: 1px solid ${theme.colors.gray[300]};
    
    &:hover {
      background: ${theme.colors.gray[50]};
      border-color: ${theme.colors.gray[400]};
    }
  `}
`;

const mockMentors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Senior Software Engineer at Google",
    avatar: "SJ",
    rating: 4.9,
    reviews: 127,
    location: "San Francisco, CA",
    bio: "Passionate about helping developers grow their careers. With 10+ years at Google, I specialize in system design, algorithms, and career advancement strategies.",
    skills: ["System Design", "Algorithms", "Python", "Go", "Leadership"],
    hourlyRate: 150,
    available: true,
    stats: { sessions: 234, students: 89, rating: 4.9 },
    specialties: ["Career Growth", "Technical Interviews", "System Architecture"]
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Principal Frontend Engineer at Meta",
    avatar: "MC",
    rating: 4.8,
    reviews: 93,
    location: "Seattle, WA",
    bio: "Frontend architecture expert with a passion for performance optimization and modern web technologies. I love mentoring developers transitioning to senior roles.",
    skills: ["React", "TypeScript", "Performance", "Architecture", "GraphQL"],
    hourlyRate: 120,
    available: true,
    stats: { sessions: 156, students: 67, rating: 4.8 },
    specialties: ["Frontend Architecture", "React Ecosystem", "Performance Optimization"]
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Data Science Director at Netflix",
    avatar: "ER",
    rating: 4.9,
    reviews: 156,
    location: "Los Angeles, CA",
    bio: "Leading data science initiatives at Netflix. I help aspiring data scientists build strong foundations in ML, statistics, and practical problem-solving.",
    skills: ["Machine Learning", "Python", "Statistics", "Deep Learning", "MLOps"],
    hourlyRate: 180,
    available: false,
    stats: { sessions: 298, students: 134, rating: 4.9 },
    specialties: ["Machine Learning", "Data Strategy", "Career Transition"]
  },
  {
    id: 4,
    name: "David Kim",
    title: "DevOps Engineer at Amazon",
    avatar: "DK",
    rating: 4.7,
    reviews: 78,
    location: "Austin, TX",
    bio: "Cloud infrastructure and DevOps specialist. I help developers understand scalable systems, CI/CD, and cloud-native architectures.",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    hourlyRate: 140,
    available: true,
    stats: { sessions: 187, students: 92, rating: 4.7 },
    specialties: ["Cloud Architecture", "DevOps Practices", "Infrastructure as Code"]
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "Product Manager at Stripe",
    avatar: "LW",
    rating: 4.8,
    reviews: 112,
    location: "New York, NY",
    bio: "Product strategy and management expert. I mentor engineers transitioning to product roles and help PMs develop technical understanding.",
    skills: ["Product Strategy", "Analytics", "User Research", "Agile", "Leadership"],
    hourlyRate: 160,
    available: true,
    stats: { sessions: 203, students: 78, rating: 4.8 },
    specialties: ["Product Strategy", "Career Transition", "Technical Product Management"]
  },
  {
    id: 6,
    name: "James Thompson",
    title: "Security Engineer at Apple",
    avatar: "JT",
    rating: 4.9,
    reviews: 89,
    location: "Cupertino, CA",
    bio: "Cybersecurity expert with focus on application security and secure coding practices. I help developers build security-first mindset.",
    skills: ["Security", "Penetration Testing", "Secure Coding", "Cryptography", "Risk Assessment"],
    hourlyRate: 170,
    available: true,
    stats: { sessions: 145, students: 56, rating: 4.9 },
    specialties: ["Application Security", "Secure Development", "Security Architecture"]
  }
];

const Mentors: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState(mockMentors);
  const [messageModal, setMessageModal] = useState<{
    isOpen: boolean;
    mentorName: string;
    mentorAvatar: string;
  }>({
    isOpen: false,
    mentorName: '',
    mentorAvatar: ''
  });
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    mentorName: string;
    mentorAvatar: string;
    hourlyRate: number;
  }>({
    isOpen: false,
    mentorName: '',
    mentorAvatar: '',
    hourlyRate: 0
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMentors(mockMentors);
    } else {
      const filtered = mockMentors.filter(mentor =>
        mentor.name.toLowerCase().includes(query.toLowerCase()) ||
        mentor.title.toLowerCase().includes(query.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(query.toLowerCase()) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        mentor.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMentors(filtered);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Math.floor(rating) ? '#F59E0B' : 'none'}
        color={index < Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  return (
    <MentorsContainer>
      <MentorsContent>
        <Header>
          <Title>Find Your Perfect Mentor</Title>
          <Subtitle>
            Connect with experienced professionals who can guide you on your learning journey
          </Subtitle>
        </Header>

        <SearchAndFilters>
            <SearchContainer>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search mentors by name, skills, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchContainer>
            <FilterButton>
              <Filter size={16} />
              Filters
            </FilterButton>
          </SearchAndFilters>

        <MentorsGrid>
          {filteredMentors.map((mentor) => (
            <Link 
              key={mentor.id} 
              to={`/mentors/${mentor.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MentorCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <MentorHeader>
                  <MentorAvatar>
                    {mentor.avatar}
                    <OnlineIndicator />
                  </MentorAvatar>
                </MentorHeader>

                <MentorInfo>
                  <MentorName>{mentor.name}</MentorName>
                  <MentorTitle>{mentor.title}</MentorTitle>
                  
                  <MentorRating>
                    <RatingStars>
                      {renderStars(mentor.rating)}
                    </RatingStars>
                    <RatingText>{mentor.rating} ({mentor.reviews} reviews)</RatingText>
                  </MentorRating>

                  <MentorLocation>
                    <MapPin size={14} />
                    {mentor.location}
                  </MentorLocation>
                </MentorInfo>

                <MentorBio>{mentor.bio}</MentorBio>

                <MentorSkills>
                  {mentor.skills.slice(0, 3).map((skill, index) => (
                    <Skill key={index}>{skill}</Skill>
                  ))}
                  {mentor.skills.length > 3 && (
                    <Skill>+{mentor.skills.length - 3} more</Skill>
                  )}
                </MentorSkills>

                <MentorActions>
                  <ContactButton 
                    $variant="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMessageModal({
                        isOpen: true,
                        mentorName: mentor.name,
                        mentorAvatar: mentor.name.charAt(0)
                      });
                    }}
                  >
                    <MessageCircle size={16} />
                    Message
                  </ContactButton>
                  <ContactButton 
                    $variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBookingModal({
                        isOpen: true,
                        mentorName: mentor.name,
                        mentorAvatar: mentor.name.charAt(0),
                        hourlyRate: mentor.hourlyRate
                      });
                    }}
                  >
                    <Video size={16} />
                    Book Call
                  </ContactButton>
                </MentorActions>
              </MentorCard>
            </Link>
          ))}
        </MentorsGrid>
      </MentorsContent>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, mentorName: '', mentorAvatar: '' })}
        mentorName={messageModal.mentorName}
        mentorAvatar={messageModal.mentorAvatar}
      />

      {/* Session Booking Modal */}
      <SessionBookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ isOpen: false, mentorName: '', mentorAvatar: '', hourlyRate: 0 })}
        mentorName={bookingModal.mentorName}
        mentorAvatar={bookingModal.mentorAvatar}
        hourlyRate={bookingModal.hourlyRate}
      />
    </MentorsContainer>
  );
};

export default Mentors;