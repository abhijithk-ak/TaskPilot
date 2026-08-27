'use client';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setExit(true);
      setTimeout(onComplete, 520);
    }, 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className={`loading-screen${exit ? ' exit' : ''}`} role="status" aria-label="Loading TaskPilot">
      <div className="loading-orbit">
        <div className="loading-ring" />
        <div className="loading-ring" />
        <div className="loading-ring" />
        <div className="loading-icon" style={{ overflow: 'hidden', padding: 0 }}>
          <img src="/icon-192.png" alt="TaskPilot Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="loading-label">TaskPilot</div>
        <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px', marginBottom: '12px' }}>
          Your intelligent productivity workspace
        </div>
        <div className="loading-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
