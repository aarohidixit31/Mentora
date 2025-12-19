import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  MessageCircle, 
  Users, 
  Briefcase, 
  Star,
  TrendingUp,
  Shield,
  Zap,
  Sparkles,
  ChevronUp
} from 'lucide-react';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[50]} 0%, 
    ${({ theme }) => theme.colors.secondary[50]} 100%);
`;

// Add floating animation keyframes
const FloatingElement = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  opacity: 0.1;
  z-index: 0;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
`;

const HeroSection = styled.section`
  position: relative;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: ${({ theme }) => theme.lineHeights.tight};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: all ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.default};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }
`;

const FeatureIcon = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const StatsSection = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const StatsGrid = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
`;

const Home: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Ask Zone',
      description: 'Get instant help with your doubts from peers and experts. Tag subjects and get quality answers.',
      color: '#3B82F6',
      link: '/ask-zone'
    },
    {
      icon: Users,
      title: 'Mentor Match',
      description: 'Connect with experienced mentors for 1:1 guidance, career advice, and skill development.',
      color: '#10B981',
      link: '/mentors'
    },
    {
      icon: Briefcase,
      title: 'Freelance Board',
      description: 'Find freelance opportunities or hire talented students for your projects. Build your portfolio.',
      color: '#F59E0B',
      link: '/freelance'
    },
    {
      icon: TrendingUp,
      title: 'Reputation System',
      description: 'Earn XP, badges, and build your reputation by helping others and completing projects.',
      color: '#8B5CF6',
      link: '/profile'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Students' },
    { number: '500+', label: 'Mentors' },
    { number: '2K+', label: 'Doubts Solved' },
    { number: '300+', label: 'Projects' }
  ];

  const floatingElements = [
    { icon: Star, size: 24, delay: 0 },
    { icon: Sparkles, size: 20, delay: 2 },
    { icon: Zap, size: 28, delay: 4 },
    { icon: Shield, size: 22, delay: 6 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <HomeContainer>
      <AnimatedBackground>
        {floatingElements.map((element, index) => (
          <FloatingElement
            key={index}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 0
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: 360
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: element.delay
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <element.icon size={element.size} />
          </FloatingElement>
        ))}
      </AnimatedBackground>

      <motion.div style={{ y: backgroundY, opacity: heroOpacity }}>
        <HeroSection>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <HeroTitle
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              Learn. Solve. Grow Together.
            </HeroTitle>
            
            <HeroSubtitle
              variants={itemVariants}
            >
              Your go-to space for doubt-solving, mentorship, and freelancing—built for students, by students.
            </HeroSubtitle>
            
            <CTAButtons
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PrimaryButton to="/register">
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Get Started
                  </motion.span>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </PrimaryButton>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SecondaryButton to="/ask-zone">
                  Explore Ask Zone
                </SecondaryButton>
              </motion.div>
            </CTAButtons>
          </motion.div>
        </HeroSection>
      </motion.div>

      <FeaturesSection>
        <FeaturesContainer>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>Everything you need to succeed</SectionTitle>
            <SectionSubtitle>
              Mentora provides a complete ecosystem for learning, growing, and earning together as a community.
            </SectionSubtitle>
          </motion.div>
          
          <FeaturesGrid>
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link} style={{ textDecoration: 'none' }}>
                <FeatureCard
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    z: 50,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  style={{ transformStyle: "preserve-3d", cursor: 'pointer' }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FeatureIcon $color={feature.color}>
                      <feature.icon size={28} />
                    </FeatureIcon>
                  </motion.div>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              </Link>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatsSection>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>Join our growing community</SectionTitle>
        </motion.div>
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1,
                rotateY: 10,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                <StatNumber>{stat.number}</StatNumber>
              </motion.div>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTopButton
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
          >
            <ChevronUp size={24} />
          </ScrollToTopButton>
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Home;