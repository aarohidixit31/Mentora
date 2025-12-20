import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

const Container = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: #f8fafc;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const QuestionCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const QuestionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const QuestionContent = styled.p`
  color: #475569;
  margin-bottom: 10px;
`;

const Meta = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const Tag = styled.span`
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 6px;
`;

const AnswerButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  width: 600px;
  padding: 24px;
  border-radius: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-height: 120px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

interface Answer {
  _id: string;
  content: string;
  answeredBy: { name: string; role: string };
  createdAt: string;
}

interface Doubt {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  askedBy: { name: string; role: string };
  answers?: Answer[];
  createdAt: string;
}

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

const AnswerZone: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeDoubt, setActiveDoubt] = useState<Doubt | null>(null);
  const [answerText, setAnswerText] = useState("");

  const fetchDoubts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/doubts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) setDoubts(data.doubts);
    } catch (err) {
      console.error("Failed to load doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const openAnswer = (doubt: Doubt) => {
    setActiveDoubt(doubt);
    setAnswerText("");
    setShowModal(true);
  };

  const submitAnswer = async () => {
    if (!activeDoubt) return;
    if (!answerText.trim()) return alert("Write an answer");

    try {
      const res = await fetch(`${BACKEND_URL}/api/doubts/${activeDoubt._id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: answerText.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setActiveDoubt(null);
        fetchDoubts();
      } else {
        alert(data.message || 'Failed to post answer');
      }
    } catch (err) {
      console.error('Submit answer error', err);
      alert('Failed to post answer');
    }
  };

  // If user is not a tutor, show unauthorized message
  if (user?.role !== 'tutor') {
    return (
      <Container>
        <Header>
          <Title>Answer Zone</Title>
        </Header>
        <p>You must be a tutor to access the Answer Zone.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Answer Zone</Title>
      </Header>

      {doubts.map((q) => (
        <QuestionCard key={q._id}>
          <QuestionTitle>{q.title}</QuestionTitle>
          <QuestionContent>{q.content}</QuestionContent>
          <div>
            {q.tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <Meta>
            Asked by {q.askedBy?.name} ({q.askedBy?.role}) • {new Date(q.createdAt).toLocaleString()}
          </Meta>

          <div style={{ marginTop: 12 }}>
            <AnswerButton onClick={() => openAnswer(q)}>Answer</AnswerButton>
          </div>

          {q.answers && q.answers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Answers:</strong>
              {q.answers.map((a) => (
                <div key={a._id} style={{ marginTop: 8, padding: 8, background: '#f3f4f6', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600 }}>{a.answeredBy?.name} ({a.answeredBy?.role})</div>
                  <div style={{ fontSize: 14, color: '#374151' }}>{a.content}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{new Date(a.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </QuestionCard>
      ))}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <h3>Answer Question</h3>
            <p style={{ marginBottom: 8 }}>{activeDoubt?.title}</p>
            <TextArea value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
            <SubmitButton onClick={submitAnswer}>Submit Answer</SubmitButton>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AnswerZone;
