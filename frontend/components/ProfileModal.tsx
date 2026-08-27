'use client';
import { useState, useEffect } from 'react';
import { X, Save, Key, Settings, Bell } from 'lucide-react';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  currentName: string;
  onProfileUpdated: (newName: string) => void;
};

export default function ProfileModal({ isOpen, onClose, userEmail, currentName, onProfileUpdated }: ProfileModalProps) {
  const [name, setName] = useState(currentName);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Notification Preferences States
  const [notifTask, setNotifTask] = useState(true);
  const [notifPersonal, setNotifPersonal] = useState(true);
  const [notifQuote, setNotifQuote] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setPassword('');
      setNewPassword('');
      setError('');
      setSuccess('');

      // Read preferences from localStorage
      setNotifTask(localStorage.getItem('notif-pref-task') !== 'false');
      setNotifPersonal(localStorage.getItem('notif-pref-personal') !== 'false');
      setNotifQuote(localStorage.getItem('notif-pref-quote') !== 'false');
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleUpdateProfile = async () => {
    if (!name.trim()) { setError('Name cannot be empty'); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:5000/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update name');
      
      localStorage.setItem('userName', name.trim());
      onProfileUpdated(name.trim());
      setSuccess('Name updated successfully!');
    } catch (err: any) {
      console.warn('Backend connection failed, falling back locally');
      localStorage.setItem('userName', name.trim());
      onProfileUpdated(name.trim());
      setSuccess('Name updated (Offline Mode)!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!password.trim() || !newPassword.trim()) { setError('Enter both current and new passwords'); return; }
    if (newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // 1. Authenticate first
      const loginRes = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error('Incorrect current password');

      // 2. Change password
      const resetRes = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, newPassword }),
      });
      const resetData = await resetRes.json();
      if (!resetRes.ok) throw new Error(resetData.error || 'Failed to reset password');

      setSuccess('Password updated successfully!');
      setPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Database might be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePreference = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    localStorage.setItem(`notif-pref-${key}`, String(value));
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '440px' }}>
        <div className="modal-top">
          <div className="modal-heading">
            <div className="modal-heading-icon">
              <Settings size={18} />
            </div>
            Settings
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '18px', maxHeight: '78vh', overflowY: 'auto' }}>
          {success && (
            <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '12px', color: 'var(--green-text)' }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '12px', color: 'var(--red-text)' }}>
              {error}
            </div>
          )}

          {/* Section: Edit Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)' }}>
              Profile Options
            </h3>
            <div className="field">
              <label className="field-label" htmlFor="settings-name">Edit Username</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="settings-name"
                  type="text"
                  className="field-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                />
                <button className="btn btn-primary" onClick={handleUpdateProfile} disabled={loading} style={{ padding: '8px 12px' }}>
                  <Save size={14} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Section: Push Notification Preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bell size={13} /> Push Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={notifTask}
                  onChange={e => handleTogglePreference('task', e.target.checked, setNotifTask)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Task Related Alerts
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={notifPersonal}
                  onChange={e => handleTogglePreference('personal', e.target.checked, setNotifPersonal)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Personal Care Reminders
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                <input
                  type="checkbox"
                  checked={notifQuote}
                  onChange={e => handleTogglePreference('quote', e.target.checked, setNotifQuote)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Mindful Quotes
              </label>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border)' }} />

          {/* Section: Change Password with Authentication */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)' }}>
              Security Settings
            </h3>
            <div className="field">
              <label className="field-label" htmlFor="settings-old-pass">Current Password</label>
              <input
                id="settings-old-pass"
                type="password"
                className="field-input"
                placeholder="Enter current password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="settings-new-pass">New Password</label>
              <input
                id="settings-new-pass"
                type="password"
                className="field-input"
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button className="btn btn-ghost" onClick={handleChangePassword} disabled={loading} style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 600 }}>
              <Key size={14} /> Authenticate & Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
