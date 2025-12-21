import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Video } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import SessionBookingModal from "../components/booking/SessionBookingModal";

/* ===================== STYLES ===================== */

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["3xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SessionCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MentorName = styled.div`
  font-weight: 600;
`;

const Meta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Price = styled.div`
  font-weight: 700;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 8px 12px;
  border-radius: 8px;
  border: ${({ variant }) =>
    variant === "secondary" ? "1px solid #ccc" : "none"};
  background: ${({ variant }) =>
    variant === "secondary" ? "#fff" : "#2563eb"};
  color: ${({ variant }) => (variant === "secondary" ? "#333" : "#fff")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

/* ===================== COMPONENT ===================== */

const Mentors: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    mentorName: string;
    mentorAvatar: string;
    session?: any;
  }>({
    isOpen: false,
    mentorName: "",
    mentorAvatar: "",
    session: undefined,
  });

  const BACKEND =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  /* ===================== FETCH SESSIONS ===================== */

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/mentors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // 🔥 flatten mentors → sessions
        const allSessions = data.mentors.flatMap((entry: any) =>
          (entry.sessions || []).map((s: any) => ({
            ...s,
            mentor: entry.mentor,
          }))
        );

        setSessions(allSessions);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ===================== RENDER ===================== */

  return (
    <Container>
      <Content>
        <Title>Available Sessions</Title>

        {sessions.length === 0 && <p>No sessions available</p>}

        {sessions.map((s) => (
          <SessionCard key={s._id}>
            <SessionInfo>
              <MentorName>{s.mentor.name}</MentorName>

              <Meta>
                {new Date(s.date).toLocaleDateString()} •{" "}
                {new Date(s.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                • {s.duration} min
              </Meta>

              <Price>₹{s.price}</Price>
              {s.isBooked && s.meetLink && (
                <a
                  href={s.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginTop: "6px",
                    fontSize: "14px",
                    color: "#2563eb",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  🎥 Join Google Meet
                </a>
              )}
            </SessionInfo>

            {/* STUDENT VIEW */}
            {user?.role === "student" &&
              (s.isBooked ? (
                <Button variant="secondary" disabled>
                  Booked
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setBookingModal({
                      isOpen: true,
                      mentorName: s.mentor.name,
                      mentorAvatar: s.mentor.name.charAt(0),
                      session: s,
                    })
                  }
                >
                  <Video size={16} /> Book
                </Button>
              ))}

            {/* TUTOR VIEW */}
            {user?.role === "tutor" && user._id === s.mentor._id && (
              <Button
                variant="secondary"
                onClick={async () => {
                  await fetch(`${BACKEND}/api/sessions/${s._id}/cancel`, {
                    method: "PATCH",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  fetchSessions();
                }}
              >
                Cancel
              </Button>
            )}
          </SessionCard>
        ))}
      </Content>

      {/* ================= BOOKING MODAL ================= */}
      <SessionBookingModal
        isOpen={bookingModal.isOpen}
        mentorName={bookingModal.mentorName}
        mentorAvatar={bookingModal.mentorAvatar}
        session={bookingModal.session}
        onClose={() => {
          setBookingModal({
            isOpen: false,
            mentorName: "",
            mentorAvatar: "",
            session: undefined,
          });
          fetchSessions();
        }}
      />
    </Container>
  );
};

export default Mentors;
