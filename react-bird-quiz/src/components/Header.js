import React from 'react';

// Header component: displays the quiz title and (optionally) score/progress
function Header({ score, questionNumber, totalQuestions }) {
  return (
    <header style={{ marginBottom: '1em' }}>
      <h2>Colorado Bird Identification Quiz</h2>
      {/* Optionally show score and progress here */}
      {/* <div>Score: {score}</div> */}
      {/* <div>Question {questionNumber} of {totalQuestions}</div> */}
    </header>
  );
}

export default Header; 