import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

/* ===================== STYLES ===================== */

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

const AskButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
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
  width: 500px;
  padding: 24px;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
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

/* ===================== TYPES ===================== */

interface Doubt {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  askedBy: {
    name: string;
    role: string;
  };
  answers?: {
    _id: string;
    content: string;
    answeredBy?: {
      name: string;
      role: string;
    };
    createdAt: string;
    updatedAt?: string;
  }[];
  createdAt: string;
}

/* ===================== COMPONENT ===================== */

const AskZone: React.FC = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const BACKEND_URL =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  /* ===================== SAFE JSON PARSER (FIX) ===================== */
  const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("❌ Non-JSON response:", text);
      throw new Error("Server returned invalid response");
    }
  };

  /* ===================== FETCH DOUBTS ===================== */
  const fetchDoubts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/doubts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await safeJson(res);

      if (data.success) {
        setDoubts(data.doubts);
      }
    } catch (err) {
      console.error("Failed to load doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  /* ===================== POST DOUBT (FIXED) ===================== */
  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/doubts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        alert(data.message || "Failed to post doubt");
        return;
      }

      setShowModal(false);
      setForm({ title: "", content: "", tags: "" });
      fetchDoubts();
    } catch (err: any) {
      console.error("POST DOUBT ERROR:", err);
      alert(err.message || "Failed to post doubt");
    }
  };

  /* ===================== FILTER ===================== */
  const filtered = doubts.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Ask Zone</Title>
        {user?.role === "student" && (
          <AskButton onClick={() => setShowModal(true)}>
            <Plus size={18} /> Ask Question
          </AskButton>
        )}
      </Header>

      <SearchBox>
        <Search size={18} style={{ position: "absolute", right: 10, top: 10 }} />
        <SearchInput
          placeholder="Search doubts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBox>

      {filtered.map((q) => (
        <QuestionCard key={q._id}>
          <QuestionTitle>{q.title}</QuestionTitle>
          <QuestionContent>{q.content}</QuestionContent>
          <div>
            {q.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <Meta>
            Asked by {q.askedBy.name} ({q.askedBy.role}) •{" "}
            {new Date(q.createdAt).toLocaleString()}
          </Meta>
          {q.answers && q.answers.length > 0 && (
  <div style={{ marginTop: 12 }}>
    <strong>Answers:</strong>

    {q.answers.map((a) => (
      <div
        key={a._id}
        style={{
          marginTop: 8,
          padding: 10,
          background: "#f1f5f9",
          borderRadius: 8,
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {a.answeredBy?.name} ({a.answeredBy?.role})
        </div>
        <div style={{ color: "#374151", marginTop: 4 }}>
          {a.content}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
          {new Date(a.createdAt).toLocaleString()}
        </div>
      </div>
    ))}
  </div>
)}

        </QuestionCard>
      ))}

      {showModal && (
        <ModalOverlay>
          <Modal>
            <h2>Ask a Question</h2>
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
            <TextArea
              placeholder="Describe your doubt"
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
            <Input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) =>
                setForm({ ...form, tags: e.target.value })
              }
            />
            <SubmitButton onClick={handleSubmit}>
              Post Doubt
            </SubmitButton>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AskZone;
