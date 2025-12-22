import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Clock, FileText, Link, Send } from "lucide-react";

/* ===================== TYPES ===================== */

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string; // 🔥 REQUIRED
  projectTitle: string;
  projectBudget: { min: number; max: number };
}

interface BidData {
  bidAmount: string;
  timeline: string;
  coverLetter: string;
  portfolioLinks: string;
}

/* ===================== STYLES ===================== */

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
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
  padding: ${({ theme }) => theme.spacing["2xl"]};
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

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ProjectTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const BudgetInfo = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-height: 120px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 16px;
  border-radius: 6px;
  border: ${({ primary }) => (primary ? "none" : "1px solid #ccc")};
  background: ${({ primary }) => (primary ? "#2563eb" : "#fff")};
  color: ${({ primary }) => (primary ? "#fff" : "#333")};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ===================== COMPONENT ===================== */

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  projectBudget,
}) => {
  const [bidForm, setBidForm] = useState<BidData>({
    bidAmount: "",
    timeline: "",
    coverLetter: "",
    portfolioLinks: "",
  });

  const BACKEND =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!bidForm.bidAmount || !bidForm.timeline || !bidForm.coverLetter) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND}/api/freelance/${projectId}/bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            bidAmount: bidForm.bidAmount,
            timeline: bidForm.timeline,
            coverLetter: bidForm.coverLetter,
            portfolioLinks: bidForm.portfolioLinks
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit proposal");
        return;
      }

      alert("✅ Proposal submitted successfully");
      setBidForm({
        bidAmount: "",
        timeline: "",
        coverLetter: "",
        portfolioLinks: "",
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit proposal");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal
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
              <div>
                <ModalTitle>Submit Proposal</ModalTitle>
                <ProjectTitle>{projectTitle}</ProjectTitle>
              </div>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <BudgetInfo>
              <strong>Budget:</strong> ₹{projectBudget.min} – ₹{projectBudget.max}
            </BudgetInfo>

            <FormGroup>
              <Label>
                <DollarSign size={16} /> Bid Amount *
              </Label>
              <Input
                name="bidAmount"
                value={bidForm.bidAmount}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Clock size={16} /> Timeline *
              </Label>
              <Input
                name="timeline"
                value={bidForm.timeline}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FileText size={16} /> Cover Letter *
              </Label>
              <TextArea
                name="coverLetter"
                value={bidForm.coverLetter}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Link size={16} /> Portfolio Links
              </Label>
              <TextArea
                name="portfolioLinks"
                value={bidForm.portfolioLinks}
                onChange={handleChange}
              />
            </FormGroup>

            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button primary onClick={handleSubmit}>
                <Send size={16} /> Submit Proposal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default BidModal;
