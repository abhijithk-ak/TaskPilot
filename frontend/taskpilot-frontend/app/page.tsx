'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsLoggingIn(true);
    
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem('userEmail', email);
    router.push('/dashboard');
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(120deg, #eef4ff, #f7fbff, #eef4ff)',
      backgroundSize: '300% 300%',
      animation: 'gradientMove 12s ease infinite'
    }}>
      <div style={{
        background: 'white',
        padding: '40px 50px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        minWidth: '350px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            ✓
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            TaskPilot
          </h1>
        </div>
        <p style={{ 
          color: '#6b7280', 
          margin: 0, 
          marginBottom: '20px',
          fontSize: '14px',
          paddingLeft: '60px',
          fontWeight: 500
        }}>
          Plan smarter. Let AI prioritize your tasks.
        </p>

        {/* Feature Bullets */}
        <div style={{
          marginBottom: '24px',
          paddingLeft: '60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
            <span>AI-assisted task categorization</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
            <span>Smart daily focus</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
            <span>Clean productivity dashboard</span>
          </div>
        </div>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          disabled={isLoggingIn}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            border: emailError ? '1px solid #ef4444' : '1px solid #e5e7eb',
            borderRadius: '8px',
            marginBottom: '4px',
            outline: 'none',
            transition: 'all 0.2s ease',
            backgroundColor: isLoggingIn ? '#f9fafb' : 'white'
          }}
          onFocus={(e) => {
            if (!emailError) e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onBlur={(e) => {
            if (!emailError) e.currentTarget.style.borderColor = '#e5e7eb';
          }}
        />

        {emailError && (
          <p style={{
            color: '#ef4444',
            fontSize: '12px',
            marginBottom: '12px',
            marginTop: '0'
          }}>
            {emailError}
          </p>
        )}

        {!emailError && <div style={{ marginBottom: '16px' }} />}

        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '15px',
            fontWeight: 600,
            background: isLoggingIn ? '#93c5fd' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transform: isLoggingIn ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {isLoggingIn ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Signing in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </div>
    </div>
  );
}
