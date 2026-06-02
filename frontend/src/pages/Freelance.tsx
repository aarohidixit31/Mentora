import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import BidModal from "../components/freelance/BidModal";

/* ===================== STYLES ===================== */

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
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

const PostButton = styled.button`
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

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding-bottom: 6px;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#2563eb" : "#555")};
  border-bottom: ${({ $active }) =>
    $active ? "2px solid #2563eb" : "none"};
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 36px 10px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const ProjectTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const Tag = styled.span`
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 6px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  resize: none;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1e4fd6;
  }
`;


const BidButton = styled.button<{ $disabled?: boolean }>`
  display: block;        /* ✅ THIS IS THE KEY */
  margin-top: 12px;
  background: ${({ $disabled }) => ($disabled ? "#9ca3af" : "#10b981")};
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};

  &:hover {
    background: ${({ $disabled }) => ($disabled ? "#9ca3af" : "#059669")};
  }
`;

const ProposalsSection = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
`;

const ProposalsTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 12px;
`;

const ProposalCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  font-size: 13px;
`;

const ProposalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const FreelancerName = styled.strong`
  color: #2563eb;
`;

const BidAmount = styled.span`
  color: #10b981;
  font-weight: 600;
`;

const ProposalDetail = styled.p`
  margin: 6px 0;
  color: #666;
  line-height: 1.4;
`;

const PortfolioLinks = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #d1d5db;
`;

const PortfolioLink = styled.a`
  display: inline-block;
  margin-right: 8px;
  color: #2563eb;
  text-decoration: none;
  font-size: 12px;
  
  &:hover {
    text-decoration: underline;
  }
`;


const EmptyState = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  color: #555;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const Modal = styled.div`
  background: white;
  padding: 24px;
  width: 500px;
  border-radius: 10px;
`;

/* ===================== TYPES ===================== */

interface Bid {
  _id: string;
  freelancer: { _id: string; name: string; email: string };
  bidAmount: number;
  timeline: string;
  coverLetter: string;
  portfolioLinks?: string[];
  submittedAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  skills?: string[];
  budget?: { min: number; max: number };
  postedBy?: { _id: string; name: string };
  bids?: Bid[];
  proposalsCount?: number;
}

/* ===================== COMPONENT ===================== */

const Freelance: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "browse" | "my-projects" | "my-proposals"
  >("browse");

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    timeline: "",
    skills: "",
  });

  const BACKEND =
    (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5000";

  /* ===================== API CALLS ===================== */

  const fetchBrowseProjects = async () => {
    const res = await fetch(`${BACKEND}/api/freelance`);
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  const fetchMyProjects = async () => {
    const res = await fetch(`${BACKEND}/api/freelance/my-projects`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  const fetchMyProposals = async () => {
    const res = await fetch(`${BACKEND}/api/freelance/my-proposals`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (data.success) setProjects(data.projects);
  };

  /* ===================== POST PROJECT ===================== */

  const postProject = async () => {
    if (!form.title || !form.description || !form.budget) {
      alert("Please fill all required fields");
      return;
    }

    const [min, max] = form.budget
      .replace(/[^\d-]/g, "")
      .split("-")
      .map(Number);

    try {
      const res = await fetch(`${BACKEND}/api/freelance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          timeline: form.timeline,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          budget: { min, max },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to post project");
        return;
      }

      setShowPostModal(false);
      setForm({
        title: "",
        description: "",
        budget: "",
        timeline: "",
        skills: "",
      });

      fetchBrowseProjects();
      alert("✅ Project posted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to post project");
    }
  };

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    if (activeTab === "browse") fetchBrowseProjects();
    if (activeTab === "my-projects") fetchMyProjects();
    if (activeTab === "my-proposals") fetchMyProposals();
  }, [activeTab]);

  const filteredProjects =
    activeTab === "browse"
      ? projects.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        )
      : projects;

  const isEmpty = filteredProjects.length === 0;

  /* ===================== RENDER ===================== */

  return (
    <Container>
      <Header>
        <Title>Freelance Board</Title>
        {user?.role === "freelancer" && activeTab === "browse" && (
          <PostButton onClick={() => setShowPostModal(true)}>
            <Plus size={18} /> Post Project
          </PostButton>
        )}
      </Header>

      <Tabs>
        <Tab $active={activeTab === "browse"} onClick={() => setActiveTab("browse")}>
          Browse Projects
        </Tab>
        <Tab
          $active={activeTab === "my-projects"}
          onClick={() => setActiveTab("my-projects")}
        >
          My Projects
        </Tab>
        {/* <Tab
          $active={activeTab === "my-proposals"}
          onClick={() => setActiveTab("my-proposals")}
        >
          My Proposals
        </Tab> */}
      </Tabs>

      {activeTab === "browse" && (
        <SearchBox>
          <Search size={18} style={{ position: "absolute", right: 10, top: 10 }} />
          <SearchInput
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
      )}

      {isEmpty && activeTab !== "browse" && (
        <EmptyState>
          {activeTab === "my-projects"
            ? "You haven’t posted any projects yet."
            : "You haven’t submitted any proposals yet."}
        </EmptyState>
      )}

      {filteredProjects.map((p) => (
        <Card key={p._id}>
          <ProjectTitle>{p.title}</ProjectTitle>
          <p>{p.description}</p>

          <div>
            {p.skills?.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>

          <small>
            Budget: ₹{p.budget?.min ?? 0} – ₹{p.budget?.max ?? 0}
            {activeTab !== "my-projects" && <> • Posted by {p.postedBy?.name}</>}
            {activeTab === "my-projects" && p.proposalsCount && (
              <> • {p.proposalsCount} proposal{p.proposalsCount !== 1 ? "s" : ""}</>
            )}
          </small>

          {activeTab === "browse" &&
            user?.role === "freelancer" &&
            p.postedBy?._id !== user?._id && (
              <BidButton
                $disabled={p.bids?.some((b) => b.freelancer?._id === user?._id)}
                onClick={() => {
                  if (!p.bids?.some((b) => b.freelancer?._id === user?._id)) {
                    setSelectedProject(p);
                    setShowBidModal(true);
                  }
                }}
              >
                {p.bids?.some((b) => b.freelancer?._id === user?._id)
                  ? "✓ Submitted"
                  : "Submit Proposal"}
              </BidButton>
            )}

          {activeTab === "my-projects" && p.bids && p.bids.length > 0 && (
            <ProposalsSection>
              <ProposalsTitle>📋 Proposals Received ({p.bids.length})</ProposalsTitle>
              {p.bids.map((bid) => (
                <ProposalCard key={bid._id}>
                  <ProposalHeader>
                    <FreelancerName>{bid.freelancer?.name}</FreelancerName>
                    <BidAmount>₹{bid.bidAmount}</BidAmount>
                  </ProposalHeader>
                  <ProposalDetail>
                    <strong>Timeline:</strong> {bid.timeline}
                  </ProposalDetail>
                  <ProposalDetail>
                    <strong>Message:</strong> {bid.coverLetter}
                  </ProposalDetail>
                  {bid.portfolioLinks && bid.portfolioLinks.length > 0 && (
                    <PortfolioLinks>
                      <strong style={{ fontSize: "12px" }}>Portfolio:</strong>
                      <div>
                        {bid.portfolioLinks.map((link, idx) => (
                          <PortfolioLink
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Link {idx + 1}
                          </PortfolioLink>
                        ))}
                      </div>
                    </PortfolioLinks>
                  )}
                  <ProposalDetail style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>
                    📅 {new Date(bid.submittedAt).toLocaleDateString()}
                  </ProposalDetail>
                </ProposalCard>
              ))}
            </ProposalsSection>
          )}
        </Card>
      ))}

      {showPostModal && (
  <ModalOverlay onClick={() => setShowPostModal(false)}>
    <Modal onClick={(e) => e.stopPropagation()}>
      <ModalTitle>Post Project</ModalTitle>

      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <TextArea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Input
        placeholder="Budget (1000-2000)"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />

      <Input
        placeholder="Timeline"
        value={form.timeline}
        onChange={(e) => setForm({ ...form, timeline: e.target.value })}
      />

      <Input
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e) => setForm({ ...form, skills: e.target.value })}
      />

      <SubmitButton onClick={postProject}>
        Post Project
      </SubmitButton>
    </Modal>
  </ModalOverlay>
)}

      {selectedProject && (
        <BidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          projectId={selectedProject._id}
          projectTitle={selectedProject.title}
          projectBudget={selectedProject.budget ?? { min: 0, max: 0 }}
        />
      )}
    </Container>
  );
};

export default Freelance;
