import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search,
  MessageCircle,
  Users,
  Briefcase,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NavbarContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.navbar};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary[600] : theme.colors.gray[600]};
  font-weight: ${({ theme, $isActive }) => 
    $isActive ? theme.fontWeights.semibold : theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  ${({ $isActive, theme }) => $isActive && `
    background: ${theme.colors.primary[50]};
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const IconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: ${({ theme }) => theme.colors.error[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
`;

const UserMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const MobileNavLink = styled(Link)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} 0;
  text-decoration: none;
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary[600] : theme.colors.gray[700]};
  font-weight: ${({ theme, $isActive }) => 
    $isActive ? theme.fontWeights.semibold : theme.fontWeights.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter current page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // TODO: Mark notifications as read
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home', icon: Home }
    ];

    if (!user) {
      return baseItems;
    }

    switch (user.role) {
      case 'student':
        return [
          ...baseItems,
          { path: '/ask-zone', label: 'Ask Zone', icon: MessageCircle },
          { path: '/mentors', label: 'Find Mentors', icon: Users },
        ];
      case 'tutor':
        return [
          ...baseItems,
          { path: '/answer-zone', label: 'Answer Zone', icon: MessageCircle },
          { path: '/sessions', label: 'My Sessions', icon: Users },
        ];
      case 'freelancer':
        return [
          ...baseItems,
          { path: '/freelance', label: 'Projects', icon: Briefcase },
        ];
      case 'admin':
        return [
          ...baseItems,
          { path: '/ask-zone', label: 'Ask Zone', icon: MessageCircle },
          { path: '/mentors', label: 'Mentors', icon: Users },
          { path: '/freelance', label: 'Freelance', icon: Briefcase },
          { path: '/admin', label: 'Admin', icon: Settings },
        ];
      default:
        return [
          ...baseItems,
          { path: '/ask-zone', label: 'Ask Zone', icon: MessageCircle },
          { path: '/mentors', label: 'Mentors', icon: Users },
          { path: '/freelance', label: 'Freelance', icon: Briefcase },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <LogoIcon>M</LogoIcon>
          Mentora
        </Logo>

        <NavLinks>
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} $isActive={isActive(path)}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </NavLinks>

        <UserSection>
          <SearchBar>
              <SearchForm onSubmit={handleSearch}>
                <SearchIcon />
                <SearchInput
                  type="text"
                  placeholder="Search doubts, mentors, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchButton type="submit">
                  <Search size={16} />
                </SearchButton>
              </SearchForm>
            </SearchBar>

          {user ? (
            <>
              <IconButton onClick={handleNotificationClick}>
                <Bell size={20} />
                <NotificationBadge>3</NotificationBadge>
              </IconButton>

              <div style={{ position: 'relative' }}>
                <IconButton onClick={() => setShowUserMenu(!showUserMenu)}>
                  <User size={20} />
                </IconButton>

                <AnimatePresence>
                  {showUserMenu && (
                    <UserMenu
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <UserMenuItem onClick={() => navigate('/profile')}>
                        <User size={16} />
                        Profile
                      </UserMenuItem>
                      <UserMenuItem onClick={() => navigate('/dashboard')}>
                        <Settings size={16} />
                        Dashboard
                      </UserMenuItem>
                      <UserMenuItem onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </UserMenuItem>
                    </UserMenu>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Sign Up</NavLink>
            </div>
          )}

          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </MobileMenuButton>
        </UserSection>
      </NavContent>

      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map(({ path, label, icon: Icon }) => (
              <MobileNavLink
                key={path}
                to={path}
                $isActive={isActive(path)}
                onClick={() => setShowMobileMenu(false)}
              >
                <Icon size={20} />
                {label}
              </MobileNavLink>
            ))}
            
            {!user && (
              <>
                <MobileNavLink to="/login" onClick={() => setShowMobileMenu(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink to="/register" onClick={() => setShowMobileMenu(false)}>
                  Sign Up
                </MobileNavLink>
              </>
            )}
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;