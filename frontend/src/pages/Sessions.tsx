import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import SessionBookingModal from "../components/booking/SessionBookingModal";

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

const Column = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const SessionItem = styled.div`
  background: #f5f7fa;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eef2f7;
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StudentList = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #2563eb;
`;

const StudentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const StudentAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #111;
`;

const StudentEmail = styled.div`
  font-size: 12px;
  color: #666;
`;

/* ===================== COMPONENT ===================== */

const Sessions: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [sessions, setSessions] = useState<any[]>([]);
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingSession, setBookingSession] = useState<any | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessionStudents, setSessionStudents] = useState<{ [key: string]: any[] }>({});
  const [loadingStudents, setLoadingStudents] = useState<{ [key: string]: boolean }>({});

  const [form, setForm] = useState({
    date: "",
    time: "",
    duration: "60",
    topic: "",
    notes: "",
    price: "0",
  });

  const BACKEND =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  /* ===================== SAFE JSON ===================== */

  const safeJson = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Non-JSON response:", text);
      throw new Error("Invalid server response");
    }
  };

  /* ===================== FETCHERS ===================== */

  const fetchSessions = async () => {
    const res = await fetch(`${BACKEND}/api/sessions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await safeJson(res);
    if (data.success) setSessions(data.sessions || []);
  };

  const fetchMySessions = async () => {
    const res = await fetch(`${BACKEND}/api/sessions/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await safeJson(res);
    if (data.success) setMySessions(data.sessions || []);
  };

  const fetchSessionStudents = async (sessionId: string) => {
    try {
      setLoadingStudents((prev) => ({ ...prev, [sessionId]: true }));
      const res = await fetch(`${BACKEND}/api/sessions/${sessionId}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await safeJson(res);
      if (data.success) {
        setSessionStudents((prev) => ({ ...prev, [sessionId]: data.students }));
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  const toggleSessionExpanded = (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
      if (!sessionStudents[sessionId]) {
        fetchSessionStudents(sessionId);
      }
    }
  };

  /* ===================== EFFECTS ===================== */

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSessions(),
      user?.role === "tutor" ? fetchMySessions() : Promise.resolve(),
    ]).finally(() => setLoading(false));
  }, []);

  // Google OAuth return
  useEffect(() => {
    if (window.location.search.includes("google=connected")) {
      (async () => {
        await refreshUser();
        await fetchMySessions(); // 🔥 FORCE refresh
        window.history.replaceState({}, document.title, "/sessions");
      })();
    }
  }, []);

  /* ===================== CREATE SESSION ===================== */

  const createSession = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: form.date,
          time: form.time,
          duration: Number(form.duration),
          topic: form.topic,
          notes: form.notes,
          price: Number(form.price),
        }),
      });

      const data = await safeJson(res);
      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      setForm({
        date: "",
        time: "",
        duration: "60",
        topic: "",
        notes: "",
        price: "0",
      });

      // 🔥 CRITICAL: await refetch
      await fetchMySessions();
      await fetchSessions();

      alert("Session created");
    } catch (err) {
      console.error(err);
      alert("Failed");
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <Container>
      <Header>
        <Title>Sessions</Title>
      </Header>

      <Column>
        {/* LEFT */}
        <Card>
          <h3>Available Sessions</h3>
          {loading ? <p>Loading...</p> : (
            <List>
              {mySessions.map((s) => (
                <div key={s._id}>
                  <SessionItem onClick={() => toggleSessionExpanded(s._id)}>
                    <SessionHeader>
                      <div>
                        <strong>{s.topic}</strong>
                        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                          {new Date(s.date).toLocaleString()}
                        </div>
                        <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "4px" }}>
                          {s.students?.length || 0} student{s.students?.length !== 1 ? "s" : ""} booked
                        </div>
                      </div>
                      <span style={{ fontSize: "18px" }}>
                        {expandedSessionId === s._id ? "▼" : "▶"}
                      </span>
                    </SessionHeader>
                  </SessionItem>

                  {expandedSessionId === s._id && (
                    <StudentList>
                      {loadingStudents[s._id] ? (
                        <p>Loading students...</p>
                      ) : (sessionStudents[s._id] && sessionStudents[s._id].length > 0) ? (
                        <div>
                          <strong style={{ marginBottom: "12px", display: "block" }}>
                            📚 Students Booked:
                          </strong>
                          {sessionStudents[s._id].map((student: any) => (
                            <StudentItem key={student._id}>
                              <StudentAvatar
                                src={student.avatar || "https://via.placeholder.com/32"}
                                alt={student.name}
                              />
                              <StudentInfo>
                                <StudentName>{student.name}</StudentName>
                                <StudentEmail>{student.email}</StudentEmail>
                              </StudentInfo>
                            </StudentItem>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#999", fontSize: "14px" }}>
                          No students have booked this session yet
                        </p>
                      )}
                    </StudentList>
                  )}

                  {s.meetLink ? (
                    <a
                      href={s.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", fontWeight: 600, marginTop: "8px", display: "block" }}
                    >
                      🎥 Join Google Meet
                    </a>
                  ) : (
                    <small style={{ color: "#999", marginTop: "8px", display: "block" }}>
                      Meet link not generated yet
                    </small>
                  )}
                </div>
              ))}
            </List>
          )}
        </Card>

        {/* RIGHT */}
        {user?.role === "tutor" && (
          <Card >
            <h3>Create Sessions</h3>

            {!user?.google?.accessToken && (
              <Button
                style={{ background: "#ea4335", width: "100%", marginBottom: 12 }}
                onClick={async () => {
                  const res = await fetch(`${BACKEND}/api/google/connect`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  const data = await safeJson(res);
                  if (data.url) window.location.href = data.url;
                }}
              >
                🔗 Connect Google Account
              </Button>
            )}

            <strong>Create a new session</strong>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <Input value={form.topic} placeholder="Topic" onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            <Button onClick={createSession}>Create</Button>

           

            
          </Card>
        )}
      </Column>

      <SessionBookingModal
  isOpen={!!bookingSession}
  mentorName={bookingSession?.mentor?.name || ""}
  mentorAvatar={bookingSession?.mentor?.avatar || ""}
  session={bookingSession || undefined}
  onClose={() => setBookingSession(null)}
/>


    </Container>
  );
};

export default Sessions;
