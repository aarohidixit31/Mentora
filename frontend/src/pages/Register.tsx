import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

/* ===================== STYLES ===================== */

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  position: relative;

  span {
    background: white;
    padding: 0 10px;
    position: relative;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #ddd;
  }
`;

const FooterText = styled.p`
  margin-top: 16px;
  text-align: center;
`;

/* ===================== COMPONENT ===================== */

const Register: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Hooks MUST be inside the component
  const { register, googleLogin } = useAuth();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor" | "freelancer";
  }>({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------- NORMAL SIGNUP ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success("Registration successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- GOOGLE SIGNUP ---------- */
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const googleToken = credentialResponse.credential;

      if (!googleToken) {
        throw new Error("Google token missing");
      }

      await googleLogin(googleToken);

      toast.success("Signed in with Google");
      navigate("/");
    } catch (error) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Create Account</Title>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Role</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="freelancer">Freelancer</option>
            </Select>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <Divider>
          <span>OR</span>
        </Divider>

        {/* GOOGLE LOGIN BUTTON */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google Sign-In failed")}
          useOneTap
        />

        <FooterText>
          Already have an account? <Link to="/login">Login</Link>
        </FooterText>
      </Card>
    </Container>
  );
};

export default Register;
