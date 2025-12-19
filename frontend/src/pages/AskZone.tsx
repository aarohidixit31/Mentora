import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Search,
  Filter,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  Tag as TagIcon,
  User,
  Award,
  BookOpen,
  TrendingUp,
  Star,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MentorBookingCard from '../components/MentorBookingCard';
import MessageModal from '../components/messaging/MessageModal';
import SessionBookingModal from '../components/booking/SessionBookingModal';

const AskZoneContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const AskZoneContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  flex: 1;
`;

const AskButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
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

const ContentArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const QuestionsSection = styled.div``;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    border-color: #e0e0e0;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  flex-shrink: 0;
`;

const QuestionMeta = styled.div`
  flex: 1;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const UserRole = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const QuestionTime = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const QuestionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`;

const QuestionPreview = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const QuestionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const QuestionStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Sidebar = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const SidebarCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TrendingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrendingIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const TrendingContent = styled.div`
  flex: 1;
`;

const TrendingTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: 2px;
`;

const TrendingMeta = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CloseButton = styled.button`
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
  min-height: 120px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const mockQuestions = [
    {
      id: 1,
      title: "How to implement authentication in React with JWT tokens?",
      content: "I'm building a React application and need to implement user authentication using JWT tokens. What's the best approach for storing tokens securely and handling token refresh?",
      author: { name: "John Doe", role: "student", avatar: "JD" },
      tags: ["React", "JWT", "Authentication", "Security"],
      stats: { answers: 5, upvotes: 12, views: 89 },
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Best practices for database design in Node.js applications",
      content: "I'm working on a Node.js project with MongoDB. What are the best practices for schema design, indexing, and query optimization?",
      author: { name: "Sarah Wilson", role: "freelancer", avatar: "SW" },
      tags: ["Node.js", "MongoDB", "Database", "Performance"],
      stats: { answers: 8, upvotes: 24, views: 156 },
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "Understanding React hooks and their lifecycle",
      content: "Can someone explain the difference between useEffect, useMemo, and useCallback? When should I use each one?",
      author: { name: "Mike Chen", role: "student", avatar: "MC" },
      tags: ["React", "Hooks", "Performance", "JavaScript"],
      stats: { answers: 12, upvotes: 31, views: 203 },
      timeAgo: "6 hours ago"
    }
  ];

const AskZone: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState(mockQuestions);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    content: '',
    tags: ''
  });

  // Modal states for mentor booking
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    mentorName: '',
    mentorAvatar: ''
  });

  const [sessionModal, setSessionModal] = useState({
    isOpen: false,
    mentorName: '',
    mentorAvatar: '',
    hourlyRate: 0
  });

  // Mock mentor data for sidebar
  const featuredMentors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Senior React Developer",
      avatar: "SJ",
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 85,
      sessionsCompleted: 340,
      responseTime: "< 2h",
      expertise: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"]
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Full Stack Engineer",
      avatar: "MC",
      rating: 4.8,
      reviewCount: 89,
      hourlyRate: 75,
      sessionsCompleted: 256,
      responseTime: "< 1h",
      expertise: ["JavaScript", "Python", "MongoDB", "Docker", "Kubernetes"]
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredQuestions(mockQuestions);
    } else {
      const filtered = mockQuestions.filter(question =>
        question.title.toLowerCase().includes(query.toLowerCase()) ||
        question.content.toLowerCase().includes(query.toLowerCase()) ||
        question.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        question.author.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  const trendingTopics = [
    { icon: BookOpen, title: "React Hooks", count: "45 questions", color: "#3B82F6" },
    { icon: Award, title: "JavaScript ES6", count: "32 questions", color: "#F59E0B" },
    { icon: TrendingUp, title: "Node.js", count: "28 questions", color: "#10B981" },
    { icon: Star, title: "Python", count: "24 questions", color: "#8B5CF6" }
  ];

  const handleAskQuestion = () => {
    if (!user) {
      alert('Please log in to ask a question');
      return;
    }
    
    if (!questionForm.title.trim() || !questionForm.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    // Create new question
    const newQuestion = {
      id: mockQuestions.length + 1,
      title: questionForm.title,
      content: questionForm.content,
      author: { 
        name: user.name || 'Anonymous', 
        role: user.role || 'student', 
        avatar: (user.name || 'A').charAt(0).toUpperCase() 
      },
      tags: questionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      stats: { answers: 0, upvotes: 0, views: 0 },
      timeAgo: "just now"
    };

    // Add to questions list
    mockQuestions.unshift(newQuestion);
    setFilteredQuestions([...mockQuestions]);
    
    // Reset form and close modal
    setShowModal(false);
    setQuestionForm({ title: '', content: '', tags: '' });
    
    // Show success message
    alert('Question posted successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  // Mentor booking handlers
  const handleMentorMessage = (mentor: any) => {
    setMessageModal({
      isOpen: true,
      mentorName: mentor.name,
      mentorAvatar: mentor.avatar
    });
  };

  const handleMentorBookSession = (mentor: any) => {
    setSessionModal({
      isOpen: true,
      mentorName: mentor.name,
      mentorAvatar: mentor.avatar,
      hourlyRate: mentor.hourlyRate
    });
  };

  return (
    <AskZoneContainer>
      <AskZoneContent>
        <Header>
          <Title>Ask Zone</Title>
          <AskButton onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Ask Question
          </AskButton>
        </Header>

        <SearchAndFilters>
          <SearchContainer>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </SearchContainer>
          <FilterButton>
            <Filter size={16} />
            Filters
            <ChevronDown size={16} />
          </FilterButton>
        </SearchAndFilters>

        <ContentArea>
          <QuestionsSection>
            {filteredQuestions.map((question) => (
              <Link 
                key={question.id} 
                to={`/ask-zone/question/${question.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <QuestionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionHeader>
                    <UserAvatar>{question.author.avatar}</UserAvatar>
                    <QuestionMeta>
                      <UserInfo>
                        <UserName>{question.author.name}</UserName>
                        <UserRole>{question.author.role}</UserRole>
                      </UserInfo>
                      <QuestionTime>
                        <Clock size={14} />
                        {question.timeAgo}
                      </QuestionTime>
                    </QuestionMeta>
                  </QuestionHeader>

                  <QuestionTitle>{question.title}</QuestionTitle>
                  <QuestionPreview>{question.content}</QuestionPreview>

                  <QuestionTags>
                    {question.tags.map((tag, tagIndex) => (
                      <Tag key={tagIndex}>{tag}</Tag>
                    ))}
                  </QuestionTags>

                  <QuestionStats>
                    <StatItem>
                      <MessageCircle size={16} />
                      {question.stats.answers} answers
                    </StatItem>
                    <StatItem>
                      <ThumbsUp size={16} />
                      {question.stats.upvotes} upvotes
                    </StatItem>
                    <StatItem>
                      <Eye size={16} />
                      {question.stats.views} views
                    </StatItem>
                  </QuestionStats>
                </QuestionCard>
              </Link>
            ))}
          </QuestionsSection>

          <Sidebar>
            <SidebarCard>
              <SidebarTitle>Featured Mentors</SidebarTitle>
              {featuredMentors.map((mentor) => (
                <MentorBookingCard
                  key={mentor.id}
                  mentor={mentor}
                  onMessage={() => handleMentorMessage(mentor)}
                  onBookSession={() => handleMentorBookSession(mentor)}
                />
              ))}
            </SidebarCard>

            <SidebarCard>
              <SidebarTitle>Trending Topics</SidebarTitle>
              {trendingTopics.map((topic, index) => (
                <TrendingItem key={index}>
                  <TrendingIcon $color={topic.color}>
                    <topic.icon size={16} />
                  </TrendingIcon>
                  <TrendingContent>
                    <TrendingTitle>{topic.title}</TrendingTitle>
                    <TrendingMeta>{topic.count}</TrendingMeta>
                  </TrendingContent>
                </TrendingItem>
              ))}
            </SidebarCard>

            <SidebarCard>
              <SidebarTitle>Quick Tips</SidebarTitle>
              <div style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.5' }}>
                <p style={{ marginBottom: '12px' }}>
                  • Be specific and clear in your question title
                </p>
                <p style={{ marginBottom: '12px' }}>
                  • Provide context and what you've already tried
                </p>
                <p style={{ marginBottom: '12px' }}>
                  • Use relevant tags to help others find your question
                </p>
                <p>
                  • Show appreciation by upvoting helpful answers
                </p>
              </div>
            </SidebarCard>
          </Sidebar>
        </ContentArea>

        <AnimatePresence>
          {showModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Ask a Question</ModalTitle>
                  <CloseButton onClick={() => setShowModal(false)}>
                    <X size={20} />
                  </CloseButton>
                </ModalHeader>

                <FormGroup>
                  <Label>Question Title</Label>
                  <Input
                    type="text"
                    name="title"
                    value={questionForm.title}
                    onChange={handleInputChange}
                    placeholder="What's your programming question?"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Question Details</Label>
                  <TextArea
                    name="content"
                    value={questionForm.content}
                    onChange={handleInputChange}
                    placeholder="Provide more details about your question. Include what you've tried and any error messages..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Tags</Label>
                  <Input
                    type="text"
                    name="tags"
                    value={questionForm.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. react, javascript, node.js (comma separated)"
                  />
                </FormGroup>

                <SubmitButton
                  onClick={handleAskQuestion}
                  disabled={!questionForm.title || !questionForm.content}
                >
                  Post Question
                </SubmitButton>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>

        {/* Message Modal */}
        <MessageModal
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
          mentorName={messageModal.mentorName}
          mentorAvatar={messageModal.mentorAvatar}
        />

        {/* Session Booking Modal */}
        <SessionBookingModal
          isOpen={sessionModal.isOpen}
          onClose={() => setSessionModal({ ...sessionModal, isOpen: false })}
          mentorName={sessionModal.mentorName}
          mentorAvatar={sessionModal.mentorAvatar}
          hourlyRate={sessionModal.hourlyRate}
        />
      </AskZoneContent>
    </AskZoneContainer>
  );
};

export default AskZone;