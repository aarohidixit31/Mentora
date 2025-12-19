import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, FileText, Link, Send } from 'lucide-react';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectBudget: { min: number; max: number };
  onSubmitBid: (bidData: BidData) => void;
}

interface BidData {
  bidAmount: string;
  timeline: string;
  coverLetter: string;
  portfolioLinks: string;
}

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
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
`;

const ModalHeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProjectTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const BudgetInfo = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BudgetLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BudgetRange = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
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

const HelperText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ModalFooter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SubmitButton = styled.button`
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
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectBudget,
  onSubmitBid
}) => {
  const [bidForm, setBidForm] = useState<BidData>({
    bidAmount: '',
    timeline: '',
    coverLetter: '',
    portfolioLinks: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBidForm({
      ...bidForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!bidForm.bidAmount || !bidForm.timeline || !bidForm.coverLetter) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmitBid(bidForm);
    setBidForm({
      bidAmount: '',
      timeline: '',
      coverLetter: '',
      portfolioLinks: ''
    });
    onClose();
  };

  const handleClose = () => {
    setBidForm({
      bidAmount: '',
      timeline: '',
      coverLetter: '',
      portfolioLinks: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalHeaderContent>
                <ModalTitle>Submit Proposal</ModalTitle>
                <ProjectTitle>{projectTitle}</ProjectTitle>
              </ModalHeaderContent>
              <CloseButton onClick={handleClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <BudgetInfo>
              <BudgetLabel>Client Budget Range</BudgetLabel>
              <BudgetRange>
                <DollarSign size={18} />
                ${projectBudget.min.toLocaleString()} - ${projectBudget.max.toLocaleString()}
              </BudgetRange>
            </BudgetInfo>

            <FormGroup>
              <Label>
                <DollarSign size={16} />
                Your Bid Amount *
              </Label>
              <Input
                type="text"
                name="bidAmount"
                value={bidForm.bidAmount}
                onChange={handleInputChange}
                placeholder="e.g. $2500"
              />
              <HelperText>Enter your proposed price for this project</HelperText>
            </FormGroup>

            <FormGroup>
              <Label>
                <Clock size={16} />
                Delivery Timeline *
              </Label>
              <Input
                type="text"
                name="timeline"
                value={bidForm.timeline}
                onChange={handleInputChange}
                placeholder="e.g. 4-6 weeks"
              />
              <HelperText>How long will it take you to complete this project?</HelperText>
            </FormGroup>

            <FormGroup>
              <Label>
                <FileText size={16} />
                Cover Letter *
              </Label>
              <TextArea
                name="coverLetter"
                value={bidForm.coverLetter}
                onChange={handleInputChange}
                placeholder="Introduce yourself and explain why you're the best fit for this project. Highlight your relevant experience and approach..."
              />
              <HelperText>Explain your approach and why you're the right choice for this project</HelperText>
            </FormGroup>

            <FormGroup>
              <Label>
                <Link size={16} />
                Portfolio Links
              </Label>
              <TextArea
                name="portfolioLinks"
                value={bidForm.portfolioLinks}
                onChange={handleInputChange}
                placeholder="Share links to relevant work samples, GitHub repositories, or portfolio pieces (one per line)"
              />
              <HelperText>Optional: Include links to showcase your relevant work</HelperText>
            </FormGroup>

            <ModalFooter>
              <CancelButton onClick={handleClose}>
                Cancel
              </CancelButton>
              <SubmitButton
                onClick={handleSubmit}
                disabled={!bidForm.bidAmount || !bidForm.timeline || !bidForm.coverLetter}
              >
                <Send size={16} />
                Submit Proposal
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default BidModal;