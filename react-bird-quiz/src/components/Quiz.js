import React, { useState } from 'react';
import Question from './Question';
import birdQuizData from '../birdQuizData';

console.log('Quiz component loaded');
console.log('birdQuizData:', birdQuizData);

// Helper: get indices of eligible quiz birds (not distractors)
function getEligibleQuizIndices() {
  return birdQuizData
    .map((bird, idx) => {
      const keys = Object.keys(bird);
      if (keys.length === 1 && keys[0] === 'title') return null; // distractor
      return idx;
    })
    .filter(idx => idx !== null);
}

// Helper: get title for a given index
function getTitle(idx) {
  return birdQuizData[idx].title;
}

function Quiz({ mode }) {
  // Shuffle eligible quiz birds for the quiz order
  const eligibleIndices = getEligibleQuizIndices();
  const [current, setCurrent] = useState(0);

  // For now, just use the first eligible bird as the question
  const questionIdx = eligibleIndices[current];
  const question = birdQuizData[questionIdx];

  console.log('Current question index:', current, 'Question:', question);

  // Set up choices (for now, just pick the first 4 distractors + correct answer)
  const distractorIndices = birdQuizData
    .map((bird, idx) => idx)
    .filter(idx => idx !== questionIdx)
    .slice(0, 4);
  const choices = [...distractorIndices, questionIdx].sort(() => Math.random() - 0.5);
  const choicesTitles = choices.map(getTitle);

  // Handle user choice
  function handleChoice(choiceIdx) {
    // For now, just go to the next question
    setCurrent((prev) => (prev + 1) % eligibleIndices.length);
  }

  return (
    <div>
      <Question
        question={{ ...question, choices, choicesTitles }}
        mode={mode}
        onChoice={handleChoice}
      />
    </div>
  );
}

export default Quiz; 