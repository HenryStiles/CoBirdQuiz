import React, { useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import Quiz from './components/Quiz';

// Main App component
function App() {
  // State for quiz mode (null until picked)
  const [mode, setMode] = useState(null);

  console.log('App rendered. Current mode:', mode);

  return (
    <div className="App">
      <Header />
      {/* Show mode selector until mode is picked */}
      {!mode && <ModeSelector onSelect={setMode} />}
      {/* Show quiz once mode is picked */}
      {mode && <Quiz mode={mode} />}
    </div>
  );
}
export default App; 