import React, { useState } from 'react';
import './NotificationToast.css';

// Usage: <NotificationToast message={message} show={show} onClose={...} />
export default function NotificationToast({ message, show, onClose }) {
  if (!show) return null;
  return (
    <div className="notification-toast" onClick={onClose}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose} aria-label="Close notification">×</button>
    </div>
  );
}
