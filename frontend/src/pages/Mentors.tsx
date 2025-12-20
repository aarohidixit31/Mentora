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

// real mentors will be fetched from backend

const Mentors: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMentors, setFilteredMentors] = useState<any[]>([]);
  const [allMentors, setAllMentors] = useState<any[]>([]);
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
    sessionId?: string;
  }>({
    isOpen: false,
    mentorName: '',
    mentorAvatar: '',
    hourlyRate: 0
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredMentors(allMentors);
    } else {
      const filtered = allMentors.filter((entry: any) => {
        const m = entry.mentor;
        return (
          m.name?.toLowerCase().includes(query.toLowerCase()) ||
          m.title?.toLowerCase().includes(query.toLowerCase()) ||
          m.bio?.toLowerCase().includes(query.toLowerCase()) ||
          (m.skills || []).some((skill: string) => skill.toLowerCase().includes(query.toLowerCase())) ||
          m.location?.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredMentors(filtered);
    }
  };

  const BACKEND = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5000';

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/mentors`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      if (data.success) {
        setAllMentors(data.mentors);
        setFilteredMentors(data.mentors);
      }
    } catch (err) {
      console.error('Fetch mentors error', err);
    }
  };

  React.useEffect(() => { fetchMentors(); }, []);

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
          {filteredMentors.map((entry: any) => {
            const mentor = entry.mentor;
            const sessions = entry.sessions || [];
            return (
              <MentorCard key={mentor._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} whileHover={{ y: -5 }}>
                <MentorHeader>
                  <MentorAvatar>{mentor.avatar || (mentor.name ? mentor.name.charAt(0) : 'M')}<OnlineIndicator /></MentorAvatar>
                </MentorHeader>

                <MentorInfo>
                  <MentorName>{mentor.name}</MentorName>
                  <MentorTitle>{mentor.title}</MentorTitle>
                  <MentorRating>
                    <RatingText>{mentor.hourlyRate ? `$${mentor.hourlyRate}/hr` : ''}</RatingText>
                  </MentorRating>
                  <MentorLocation><MapPin size={14} />{mentor.location}</MentorLocation>
                </MentorInfo>

                <MentorBio>{mentor.bio}</MentorBio>

                <MentorSkills>
                  {(mentor.skills || []).slice(0,3).map((skill: string, index: number) => <Skill key={index}>{skill}</Skill>)}
                  {(mentor.skills || []).length > 3 && <Skill>+{mentor.skills.length - 3} more</Skill>}
                </MentorSkills>

                {/* Sessions list */}
                {sessions.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Upcoming Sessions</strong>
                    <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                      {sessions.map((s: any) => (
                        <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, background: '#fafafa', borderRadius: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{s.topic}</div>
                            <div style={{ color: '#666' }}>{new Date(s.date).toLocaleString()} • {s.duration} min</div>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {user?.role === 'student' ? (
                              <ContactButton $variant="primary" onClick={() => setBookingModal({ isOpen: true, mentorName: mentor.name, mentorAvatar: mentor.name.charAt(0), hourlyRate: s.price, sessionId: s._id })}>
                                <Video size={16} /> Book
                              </ContactButton>
                            ) : null}
                            {user?.role === 'tutor' && user._id === mentor._id && (
                              <ContactButton $variant="secondary" onClick={async () => {
                                // cancel session
                                try {
                                  const res = await fetch(`${BACKEND}/api/sessions/${s._id}/cancel`, {
                                    method: 'PATCH',
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                  });
                                  const d = await res.json();
                                  if (d.success) fetchMentors(); else alert(d.message || 'Failed');
                                } catch (err) { console.error(err); alert('Failed'); }
                              }}>
                                Cancel
                              </ContactButton>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <MentorActions>
                  <ContactButton $variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMessageModal({ isOpen: true, mentorName: mentor.name, mentorAvatar: mentor.name.charAt(0) }); }}>
                    <MessageCircle size={16} /> Message
                  </ContactButton>
                  <ContactButton $variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (sessions && sessions.length) { setBookingModal({ isOpen: true, mentorName: mentor.name, mentorAvatar: mentor.name.charAt(0), hourlyRate: sessions[0].price, sessionId: sessions[0]._id }); } else { setBookingModal({ isOpen: true, mentorName: mentor.name, mentorAvatar: mentor.name.charAt(0), hourlyRate: mentor.hourlyRate || 0, sessionId: undefined }); } }}>
                    <Video size={16} /> Book Call
                  </ContactButton>
                </MentorActions>
              </MentorCard>
            );
          })}
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
        onClose={() => { setBookingModal({ isOpen: false, mentorName: '', mentorAvatar: '', hourlyRate: 0 }); fetchMentors(); }}
        mentorName={bookingModal.mentorName}
        mentorAvatar={bookingModal.mentorAvatar}
        hourlyRate={bookingModal.hourlyRate}
        sessionId={bookingModal.sessionId}
      />
    </MentorsContainer>
  );
};

export default Mentors;