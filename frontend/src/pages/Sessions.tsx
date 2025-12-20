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

/* ===================== COMPONENT ===================== */

const Sessions: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [sessions, setSessions] = useState<any[]>([]);
  const [mySessions, setMySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingSession, setBookingSession] = useState<any | null>(null);

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
                  <strong>{s.topic}</strong>
                  <div>{new Date(s.date).toLocaleString()}</div>

                 
                  {s.meetLink ? (
                    <a
                      href={s.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", fontWeight: 600 }}
                    >
                      🎥 Join Google Meet
                    </a>
                  ) : (
                    <small style={{ color: "#999" }}>
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
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        mentorName={bookingSession?.mentor?.name || ""}
        mentorAvatar={bookingSession?.mentor?.avatar || ""}
        hourlyRate={bookingSession?.price || 0}
        sessionId={bookingSession?._id}
      />
    </Container>
  );
};

export default Sessions;
