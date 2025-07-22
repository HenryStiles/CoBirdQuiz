import React from 'react';

// ModeSelector component: modal for picking quiz mode (picture, sound, both)
function ModeSelector({ onSelect }) {
  return (
    <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', zIndex: 1000, left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-content" style={{ background: '#fff', padding: '2em 3em', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.2)', textAlign: 'center' }}>
        <h2>Select Quiz Mode</h2>
        <button className="mode-btn" type="button" onClick={() => onSelect('both')}>Picture &amp; Sound</button>
        <button className="mode-btn" type="button" onClick={() => onSelect('picture')}>Picture Only</button>
        <button className="mode-btn" type="button" onClick={() => onSelect('sound')}>Sound Only</button>
      </div>
    </div>
  );
}

export default ModeSelector; 