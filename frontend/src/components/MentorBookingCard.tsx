import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Calendar, Clock, Award } from 'lucide-react';

const BookingCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const MentorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MentorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const MentorInfo = styled.div`
  flex: 1;
`;

const MentorName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 2px;
`;

const MentorTitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const RatingText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const MentorStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Expertise = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ExpertiseTitle = styled.h5`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ExpertiseTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ExpertiseTag = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: 2px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  border: none;

  ${({ $variant, theme }) => $variant === 'primary' ? `
    background: ${theme.colors.primary[500]};
    color: white;
    
    &:hover {
      background: ${theme.colors.primary[600]};
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

const Price = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const PriceAmount = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[700]};
`;

const PriceLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

interface Mentor {
  id: number;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  sessionsCompleted: number;
  responseTime: string;
  expertise: string[];
}

interface MentorBookingCardProps {
  mentor: Mentor;
  onMessage: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
}

const MentorBookingCard: React.FC<MentorBookingCardProps> = ({
  mentor,
  onMessage,
  onBookSession
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        fill={index < Math.floor(rating) ? '#fbbf24' : 'none'}
        color={index < Math.floor(rating) ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  return (
    <BookingCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MentorHeader>
        <MentorAvatar>{mentor.avatar}</MentorAvatar>
        <MentorInfo>
          <MentorName>{mentor.name}</MentorName>
          <MentorTitle>{mentor.title}</MentorTitle>
          <Rating>
            <RatingStars>{renderStars(mentor.rating)}</RatingStars>
            <RatingText>
              {mentor.rating} ({mentor.reviewCount} reviews)
            </RatingText>
          </Rating>
        </MentorInfo>
      </MentorHeader>

      <MentorStats>
        <StatItem>
          <StatValue>{mentor.sessionsCompleted}</StatValue>
          <StatLabel>Sessions</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{mentor.responseTime}</StatValue>
          <StatLabel>Response</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>
            <Award size={16} color="#10b981" />
          </StatValue>
          <StatLabel>Verified</StatLabel>
        </StatItem>
      </MentorStats>

      <Expertise>
        <ExpertiseTitle>Expertise</ExpertiseTitle>
        <ExpertiseTags>
          {mentor.expertise.slice(0, 3).map((skill, index) => (
            <ExpertiseTag key={index}>{skill}</ExpertiseTag>
          ))}
          {mentor.expertise.length > 3 && (
            <ExpertiseTag>+{mentor.expertise.length - 3} more</ExpertiseTag>
          )}
        </ExpertiseTags>
      </Expertise>

      <Price>
        <PriceAmount>${mentor.hourlyRate}/hr</PriceAmount>
        <PriceLabel>Starting price</PriceLabel>
      </Price>

      <ActionButtons>
        <ActionButton onClick={() => onMessage(mentor)}>
          <MessageCircle size={16} />
          Message
        </ActionButton>
        <ActionButton $variant="primary" onClick={() => onBookSession(mentor)}>
          <Calendar size={16} />
          Book Session
        </ActionButton>
      </ActionButtons>
    </BookingCard>
  );
};

export default MentorBookingCard;