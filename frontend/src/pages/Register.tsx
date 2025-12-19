import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.secondary[50]} 100%);
  padding: ${({ theme }) => theme.spacing.md};
`;

const RegisterCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

const RoleSection = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const RoleCard = styled.div<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.primary[500] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary[50] : theme.colors.white};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const RoleTitle = styled.div<{ $selected: boolean }>`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary[700] : theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RoleDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StrengthBar = styled.div<{ $strength: number }>`
  height: 4px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ $strength }) => $strength * 25}%;
    background: ${({ $strength, theme }) => {
      if ($strength <= 1) return theme.colors.error[500];
      if ($strength <= 2) return theme.colors.warning[500];
      if ($strength <= 3) return theme.colors.warning[400];
      return theme.colors.success[500];
    }};
    transition: all ${({ theme }) => theme.transitions.default};
  }
`;

const StrengthText = styled.div<{ $strength: number }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $strength, theme }) => {
    if ($strength <= 1) return theme.colors.error[600];
    if ($strength <= 2) return theme.colors.warning[600];
    if ($strength <= 3) return theme.colors.warning[500];
    return theme.colors.success[600];
  }};
`;

const PasswordRequirements = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Requirement = styled.div<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $met }) => 
    $met ? theme.colors.success[600] : theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
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

const LoginLink = styled.div`
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'tutor' | 'freelancer'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      value: 'student' as const,
      title: 'Student',
      description: 'Ask questions and learn from others'
    },
    {
      value: 'tutor' as const,
      title: 'Tutor',
      description: 'Share knowledge and mentor students'
    },
    {
      value: 'freelancer' as const,
      title: 'Freelancer',
      description: 'Offer services and work on projects'
    }
  ];

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Upper & lowercase letters', met: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) },
    { text: 'At least one number', met: /\d/.test(formData.password) },
    { text: 'At least one special character', met: /[^a-zA-Z\d]/.test(formData.password) }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
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

  const handleRoleSelect = (role: 'student' | 'tutor' | 'freelancer') => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo>
          <LogoIcon>M</LogoIcon>
          <Title>Join Mentora</Title>
          <Subtitle>Create your account and start your journey</Subtitle>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                $hasIcon
                $hasError={!!errors.name}
              />
            </InputWrapper>
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </InputGroup>

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

          <RoleSection>
            <Label>I want to join as a</Label>
            <RoleGrid>
              {roles.map((role) => (
                <RoleCard
                  key={role.value}
                  $selected={formData.role === role.value}
                  onClick={() => handleRoleSelect(role.value)}
                >
                  <RoleTitle $selected={formData.role === role.value}>
                    {role.title}
                  </RoleTitle>
                  <RoleDescription>{role.description}</RoleDescription>
                </RoleCard>
              ))}
            </RoleGrid>
          </RoleSection>

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
                placeholder="Create a strong password"
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
            {formData.password && (
              <PasswordStrength>
                <StrengthBar $strength={passwordStrength} />
                <StrengthText $strength={passwordStrength}>
                  {passwordStrength <= 1 && 'Weak password'}
                  {passwordStrength === 2 && 'Fair password'}
                  {passwordStrength === 3 && 'Good password'}
                  {passwordStrength === 4 && 'Strong password'}
                </StrengthText>
                <PasswordRequirements>
                  {passwordRequirements.map((req, index) => (
                    <Requirement key={index} $met={req.met}>
                      <Check size={12} />
                      {req.text}
                    </Requirement>
                  ))}
                </PasswordRequirements>
              </PasswordStrength>
            )}
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                $hasIcon
                $hasError={!!errors.confirmPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          <SubmitButton type="submit" disabled={loading} $loading={loading}>
            {loading ? 'Creating Account...' : (
              <>
                Create Account <ArrowRight size={20} />
              </>
            )}
          </SubmitButton>
        </Form>

        <Divider>
          <span>Already have an account?</span>
        </Divider>

        <LoginLink>
          <Link to="/login">Sign in to your account</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;