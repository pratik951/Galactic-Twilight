import React, { useState } from 'react';
import './NotificationBell.css';

// Usage: <NotificationBell notifications={notifications} onBellClick={...} wsConnected={bool} />
export default function NotificationBell({ notifications = [], onBellClick, wsConnected }) {
  const [open, setOpen] = useState(false);

  const handleBellClick = () => {
    if (onBellClick) onBellClick();
    setOpen(o => !o);
  };

  return (
    <div className="notification-bell-container">
      <button className="notification-bell-btn" onClick={handleBellClick} aria-label="Show notifications">
        <span className="bell-icon">🔔</span>
        {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
        {wsConnected && <span className="ws-dot" title="Live updates enabled" />}
      </button>
      {open && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-empty">No updates</div>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="notification-item">
                <div className="notification-title">{n.title || n.message}</div>
                <div className="notification-desc">{n.description || ''}</div>
                {n.date && <div className="notification-date">{n.date}</div>}
                {n.timestamp && <div className="notification-date">{new Date(n.timestamp).toLocaleString()}</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
