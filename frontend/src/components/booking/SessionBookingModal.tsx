import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, DollarSign, Video, CheckCircle } from 'lucide-react';

interface SessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  mentorAvatar: string;
  hourlyRate: number;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MentorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const HeaderText = styled.div``;

const MentorName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const SessionType = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
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

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DateTimeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: white;
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const PricingInfo = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  &:last-child {
    margin-bottom: 0;
    padding-top: ${({ theme }) => theme.spacing.xs};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const PriceLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PriceValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  background: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.white : theme.colors.gray[700]};

  &:hover {
    background: ${({ theme, $variant }) => 
      $variant === 'primary' ? theme.colors.primary[600] : theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SessionBookingModal: React.FC<SessionBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  mentorName, 
  mentorAvatar,
  hourlyRate 
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    topic: '',
    notes: ''
  });

  const [isBooked, setIsBooked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const durationHours = parseInt(formData.duration) / 60;
    return (hourlyRate * durationHours).toFixed(2);
  };

  const handleBookSession = () => {
    // TODO: Implement actual booking logic
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 2000);
  };

  const isFormValid = formData.date && formData.time && formData.topic;

  if (isBooked) {
    return (
      <AnimatePresence>
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
                Session Booked Successfully!
              </h3>
              <p style={{ margin: 0, color: '#6B7280' }}>
                You'll receive a confirmation email with the meeting details.
              </p>
            </div>
          </ModalContent>
        </ModalOverlay>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <HeaderInfo>
                <MentorAvatar>{mentorAvatar}</MentorAvatar>
                <HeaderText>
                  <MentorName>Book Session with {mentorName}</MentorName>
                  <SessionType>1-on-1 Mentoring Session</SessionType>
                </HeaderText>
              </HeaderInfo>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <Section>
                <SectionTitle>
                  <Calendar size={18} />
                  Schedule
                </SectionTitle>
                <DateTimeGrid>
                  <InputGroup>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>Time</Label>
                    <Input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </InputGroup>
                </DateTimeGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Clock size={18} />
                  Duration
                </SectionTitle>
                <Select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </Select>
              </Section>

              <Section>
                <SectionTitle>
                  <Video size={18} />
                  Session Details
                </SectionTitle>
                <InputGroup>
                  <Label>Topic/Subject *</Label>
                  <Input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    placeholder="e.g., System Design, React Development, Career Guidance"
                  />
                </InputGroup>
                <InputGroup style={{ marginTop: '1rem' }}>
                  <Label>Additional Notes</Label>
                  <TextArea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any specific questions or topics you'd like to cover..."
                  />
                </InputGroup>
              </Section>

              <Section>
                <SectionTitle>
                  <DollarSign size={18} />
                  Pricing
                </SectionTitle>
                <PricingInfo>
                  <PriceRow>
                    <PriceLabel>Hourly Rate</PriceLabel>
                    <PriceValue>${hourlyRate}/hour</PriceValue>
                  </PriceRow>
                  <PriceRow>
                    <PriceLabel>Duration</PriceLabel>
                    <PriceValue>{formData.duration} minutes</PriceValue>
                  </PriceRow>
                  <PriceRow>
                    <PriceLabel>Total</PriceLabel>
                    <PriceValue>${calculateTotal()}</PriceValue>
                  </PriceRow>
                </PricingInfo>
              </Section>
            </ModalBody>

            <ModalFooter>
              <Button $variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                $variant="primary" 
                onClick={handleBookSession}
                disabled={!isFormValid}
              >
                Book Session - ${calculateTotal()}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SessionBookingModal;