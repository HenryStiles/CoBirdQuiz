import React from 'react';

// Question component: displays the image, sound button, and choices for the current question
function Question({ question, mode, onChoice }) {
  // Only show image if mode is not 'sound'
  // Only show sound button if mode is not 'picture'
  return (
    <div style={{ textAlign: 'center' }}>
      {mode !== 'sound' && question.image_url && (
        <img src={question.image_url} alt={question.title} style={{ maxHeight: '65vh', maxWidth: '80vw', objectFit: 'contain', margin: '1em auto' }} />
      )}
      {mode !== 'picture' && question.sound_url && (
        <button type="button" onClick={() => new Audio(question.sound_url).play()} style={{ fontSize: '2em', margin: '1em' }}>
          <span role="img" aria-label="Play sound">🔊</span>
        </button>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2em' }}>
        {question.choices && question.choices.map((choiceIdx, i) => (
          <button key={i} className="choices" style={{ margin: '0.5em', padding: '1em 2em', borderRadius: 20 }} onClick={() => onChoice(choiceIdx)}>
            {question.choicesTitles ? question.choicesTitles[i] : ''}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question; 