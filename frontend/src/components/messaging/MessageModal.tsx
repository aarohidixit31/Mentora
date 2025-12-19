import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Smile } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  mentorAvatar: string;
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
  height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const MentorInfo = styled.div`
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

const MentorName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
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

const MessagesContainer = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Message = styled.div<{ $isOwn: boolean }>`
  display: flex;
  justify-content: ${({ $isOwn }) => $isOwn ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div<{ $isOwn: boolean }>`
  max-width: 70%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $isOwn }) => 
    $isOwn ? theme.colors.primary[500] : theme.colors.gray[100]};
  color: ${({ theme, $isOwn }) => 
    $isOwn ? theme.colors.white : theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.4;
`;

const MessageInput = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.white};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const SendButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  mentorName, 
  mentorAvatar 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm interested in learning more about system design. Could you help me?", isOwn: true },
    { id: 2, text: "Absolutely! I'd be happy to help you with system design. What specific areas are you looking to improve?", isOwn: false },
    { id: 3, text: "I'm particularly struggling with database design and scaling strategies.", isOwn: true },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isOwn: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate mentor response
      setTimeout(() => {
        const response = {
          id: messages.length + 2,
          text: "Great question! Let me share some insights about database scaling...",
          isOwn: false
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <MentorInfo>
                <MentorAvatar>{mentorAvatar}</MentorAvatar>
                <MentorName>{mentorName}</MentorName>
              </MentorInfo>
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <MessagesContainer>
              {messages.map((msg) => (
                <Message key={msg.id} $isOwn={msg.isOwn}>
                  <MessageBubble $isOwn={msg.isOwn}>
                    {msg.text}
                  </MessageBubble>
                </Message>
              ))}
            </MessagesContainer>

            <MessageInput>
              <InputContainer>
                <ActionButton>
                  <Paperclip size={18} />
                </ActionButton>
                <TextInput
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                />
                <ActionButton>
                  <Smile size={18} />
                </ActionButton>
                <SendButton 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send size={18} />
                </SendButton>
              </InputContainer>
            </MessageInput>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;