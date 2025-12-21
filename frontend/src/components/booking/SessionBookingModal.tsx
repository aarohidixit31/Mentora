import React, { useState } from "react";
import styled from "styled-components";
import { Calendar, Clock, Video, X, CheckCircle } from "lucide-react";

/* ===================== STYLES ===================== */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #374151;
  margin-bottom: 6px;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin: 16px 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
`;

const MeetBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #ecfeff;
  border-radius: 10px;
  text-align: center;
`;

/* ===================== PROPS ===================== */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  mentorAvatar: string;
  session?: {
    _id: string;
    date: string;
    duration: number;
    price: number;
  };
}

/* ===================== COMPONENT ===================== */

const SessionBookingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mentorName,
  session,
}) => {
  const [loading, setLoading] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const BACKEND =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  if (!isOpen || !session) return null;

  const handleBookSession = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BACKEND}/api/sessions/${session._id}/book`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setMeetLink(data.meetLink);
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Book Session with {mentorName}</Title>
          <button onClick={onClose}>
            <X />
          </button>
        </Header>

        {!meetLink && (
          <>
            <Row>
              <Calendar size={16} />
              {new Date(session.date).toLocaleDateString()}
            </Row>

            <Row>
              <Clock size={16} />
              {new Date(session.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • {session.duration} min
            </Row>

            <Price>₹{session.price}</Price>

            <Button disabled={loading} onClick={handleBookSession}>
              {loading ? "Booking..." : "Pay & Book Session"}
            </Button>
          </>
        )}

        {meetLink && (
          <MeetBox>
            <CheckCircle size={32} color="#16a34a" />
            <p style={{ fontWeight: 600, marginTop: 8 }}>
              Session Booked Successfully
            </p>

            <a
              href={meetLink}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontWeight: 600 }}
            >
              <Video size={18} /> Join Google Meet
            </a>
          </MeetBox>
        )}
      </Modal>
    </Overlay>
  );
};

export default SessionBookingModal;
