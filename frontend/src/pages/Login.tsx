import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.secondary[50]} 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const LoginCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $hasIcon?: boolean; $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ $hasIcon, theme }) => $hasIcon ? '48px' : theme.spacing.md};
  padding-right: ${({ $hasIcon, theme }) => $hasIcon ? '48px' : theme.spacing.md};
  border: 2px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error[300] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.base};
  transition: all ${({ theme }) => theme.transitions.default};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  transition: all ${({ theme }) => theme.transitions.default};
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
    transform: translateY(-1px);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray[200]};
  }
  
  span {
    background: ${({ theme }) => theme.colors.white};
    padding: 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const SignupLink = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
      text-decoration: underline;
    }
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <LogoIcon>M</LogoIcon>
          <Title>Welcome back</Title>
          <Subtitle>Sign in to your Mentora account</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                $hasIcon
                $hasError={!!errors.email}
              />
            </InputWrapper>
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                $hasIcon
                $hasError={!!errors.password}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={loading} $loading={loading}>
            {loading ? 'Signing in...' : (
              <>
                Sign In <ArrowRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>Don't have an account?</span>
        </Divider>

        <SignupLink>
          <Link to="/register">Create your account</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;