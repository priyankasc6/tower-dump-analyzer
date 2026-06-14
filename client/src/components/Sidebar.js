import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: '⊞', label: 'Dashboard', path: '/' },
  { icon: '◈', label: 'Cases', path: '/cases' },
  { icon: '↑', label: 'Upload Evidence', path: '/upload' },
  { icon: '⊕', label: 'Correlate', path: '/correlate' },
  { icon: '◎', label: 'Route Map', path: '/map' },
  { icon: '≡', label: 'Reports', path: '/reports' },
  { icon: '⊛', label: 'Audit Trail', path: '/audit' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoTitle}>⬡ CIPHERTRACE</div>
        <div style={styles.logoSub}>DFIR ANALYSIS PLATFORM</div>
      </div>
      <div style={styles.nav}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
              {isActive && <div style={styles.statusDot}></div>}
            </div>
          );
        })}
      </div>
      <div style={styles.sidebarFooter}>
        <div style={styles.footerText}>● SYSTEM ONLINE</div>
        <div style={styles.footerSub}>v1.0.0 · CipherTrace</div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: '220px',
    background: '#0d1117',
    borderRight: '0.5px solid #1e2d40',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
  },
  logo: {
    padding: '24px 20px 20px',
    borderBottom: '0.5px solid #1e2d40',
  },
  logoTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#00d4aa',
    letterSpacing: '2px',
  },
  logoSub: {
    fontSize: '10px',
    color: '#4a6080',
    letterSpacing: '1px',
    marginTop: '4px',
  },
  nav: {
    flex: 1,
    padding: '16px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 20px',
    fontSize: '13px',
    color: '#6a8099',
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
  },
  navItemActive: {
    color: '#00d4aa',
    borderLeft: '2px solid #00d4aa',
    background: '#0f1d2e',
  },
  navIcon: {
    fontSize: '16px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00d4aa',
    marginLeft: 'auto',
  },
  sidebarFooter: {
    padding: '16px 20px',
    borderTop: '0.5px solid #1e2d40',
  },
  footerText: {
    fontSize: '11px',
    color: '#00d4aa',
    letterSpacing: '1px',
  },
  footerSub: {
    fontSize: '10px',
    color: '#4a6080',
    marginTop: '4px',
  },
};

export default Sidebar;