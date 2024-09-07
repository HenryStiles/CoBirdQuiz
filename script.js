let currentQuestion = 0;
let right = 0;
let wrong = 0;
let quizLength = 10;
let numChoices = 10;

const birdImage = document.getElementById("bird-image");
const choicesContainer = document.getElementById("choices-container");
const nextButton = document.getElementById("next-button");
const scoreElement = document.getElementById("score");
scoreElement.innerText = "Score: 0%";

let currentSoundFile = ''; // This will hold the URL of the sound file associated with the button

const audioPlayer = document.createElement('audio');
document.body.appendChild(audioPlayer);

const soundButton = document.getElementById('soundButton');
const soundIcon = soundButton.querySelector('i');

function setSoundButtonState(isPlaying) {
    if (isPlaying) {
        soundButton.classList.add('active');
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-pause');
        soundButton.setAttribute('aria-label', 'Pause sound');
    } else {
        soundButton.classList.remove('active');
        soundIcon.classList.remove('fa-pause');
        soundIcon.classList.add('fa-volume-up');
        soundButton.setAttribute('aria-label', 'Play sound');
    }
}

soundButton.addEventListener('click', () => {
    if (!currentSoundFile) return;
    if (audioPlayer.src !== currentSoundFile) {
        audioPlayer.src = currentSoundFile;
    }
    if (audioPlayer.paused) {
        audioPlayer.play();
        setSoundButtonState(true);
    } else {
        audioPlayer.pause();
        setSoundButtonState(false);
    }
});

audioPlayer.addEventListener('ended', () => {
    setSoundButtonState(false);
});

// Add event listeners to the bird image to allow zooming
birdImage.addEventListener('wheel', function(event) {
    event.preventDefault();
    var scale = 1.05;
    var delta = event.deltaY;
    if (delta < 0) {
        // Zoom in
        birdImage.style.width = birdImage.offsetWidth * scale + 'px';
        birdImage.style.height = birdImage.offsetHeight * scale + 'px';
    } else {
        // Zoom out
        birdImage.style.width = birdImage.offsetWidth / scale + 'px';
        birdImage.style.height = birdImage.offsetHeight / scale + 'px';
    }
});

// Mode selection logic
let quizMode = null;
const modeModal = document.getElementById('mode-modal');
const modeButtons = document.querySelectorAll('.mode-btn');

function showModeModal() {
    modeModal.style.display = 'flex';
}

function hideModeModal() {
    modeModal.style.display = 'none';
}

modeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        quizMode = this.dataset.mode;
        hideModeModal();
        startQuiz();
    });
});

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

// Override shuffleData and setChoices to use only eligible birds as questions
function shuffleData() {
    // Only shuffle eligible quiz birds
    const eligibleIndices = getEligibleQuizIndices();
    // Shuffle eligible indices
    for (let i = eligibleIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligibleIndices[i], eligibleIndices[j]] = [eligibleIndices[j], eligibleIndices[i]];
    }
    // Return array of eligible indices in random order
    return eligibleIndices;
}

function setChoices() {
    // For each eligible quiz bird, set up choices
    const eligibleIndices = getEligibleQuizIndices();
    for (let i = 0; i < eligibleIndices.length; i++) {
        const correctIdx = eligibleIndices[i];
        // Get distractor indices (all except correct)
        let distractorIndices = Array.from({length: birdQuizData.length}, (_, idx) => idx)
            .filter(idx => idx !== correctIdx);
        // Shuffle distractors
        for (let j = distractorIndices.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [distractorIndices[j], distractorIndices[k]] = [distractorIndices[k], distractorIndices[j]];
        }
        // Pick numChoices-1 distractors
        const choices = distractorIndices.slice(0, numChoices - 1);
        // Insert correct answer at a random position
        const insertAt = Math.floor(Math.random() * numChoices);
        choices.splice(insertAt, 0, correctIdx);
        birdQuizData[correctIdx].choices = choices;
    }
}

// Store the shuffled eligible indices for quiz order
let quizOrder = [];

function startQuiz() {
    currentQuestion = 0;
    right = 0;
    wrong = 0;
    scoreElement.innerText = "Score: 0%";
    nextButton.textContent = "Next";
    nextButton.disabled = false;
    quizOrder = shuffleData();
    setChoices();
    displayQuestion();
}

// Show mode modal on load
window.addEventListener('DOMContentLoaded', showModeModal);

function displayQuestion() {
    nextButton.disabled = true;
    // Use quizOrder for eligible questions
    const questionIdx = quizOrder[currentQuestion];
    const question = birdQuizData[questionIdx];
    const mediaRow = document.querySelector('.media-row');
    // Show/hide image and sound button based on quizMode
    if (quizMode === 'sound') {
        birdImage.style.display = 'none';
        soundButton.style.display = '';
        mediaRow.style.justifyContent = 'center';
        mediaRow.style.flexDirection = 'row';
    } else if (quizMode === 'picture') {
        birdImage.style.display = '';
        soundButton.style.display = 'none';
        mediaRow.style.justifyContent = 'center';
        mediaRow.style.flexDirection = 'row';
    } else {
        birdImage.style.display = '';
        soundButton.style.display = '';
        mediaRow.style.justifyContent = 'center';
        mediaRow.style.flexDirection = 'row';
    }
    birdImage.src = question.image_url;
    if (!audioPlayer.paused) {
        audioPlayer.pause();
    }
    setSoundButtonState(false); // Always reset to off at new question
    currentSoundFile = question.sound_url;
    choicesContainer.innerHTML = "";
    question.choices.forEach((choice, index) => {
        const choiceButton = document.createElement("button");
        choiceButton.innerText = birdQuizData[choice].title;
        choiceButton.classList.add("choices");
        if (birdQuizData[choice].title === question.title) {
            choiceButton.dataset.correct = true;
        }

        choiceButton.addEventListener("click", (e) => {
            const selected = e.target;
            const correct = selected.dataset.correct;

            const allChoiceButtons = choicesContainer.querySelectorAll(".choices");
            allChoiceButtons.forEach(button => button.disabled = true);

            if (correct) {
                right++;
                selected.innerText += " ✅"
            } else {
                wrong++;
                selected.innerText += " ❌"
                // mark the correct answer as well.
                allChoiceButtons.forEach(button => {
                    if (button.dataset.correct) {
                        button.innerText += " ✅"
                    }
                });
            }
            // Calculate a percentage score.
            const score = Math.round((right / (right + wrong)) * 100);
            scoreElement.innerText = `Score: ${score}%`;
            nextButton.disabled = false;
            if (currentQuestion === quizLength - 1) {
                nextButton.textContent = "Play Again?";
            }
        });

        choicesContainer.appendChild(choiceButton);
    });
}

nextButton.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizLength) {
        nextButton.textContent = "Next";
        displayQuestion();
    } else {
        if (nextButton.textContent === "Play Again?") {
            showModeModal();
        }
    }
});

// Validate birdQuizData on load
validateBirdQuizData();

shuffleData();
setChoices();
displayQuestion();
