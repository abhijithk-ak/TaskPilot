'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!email) {
      alert('Please enter email');
      return;
    }

    localStorage.setItem('userEmail', email);
    router.push('/dashboard');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h1>TaskPilot</h1>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
