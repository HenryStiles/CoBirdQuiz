let currentQuestion = 0;
let right = 0;
let wrong = 0;
let quizLength = 10;
let numChoices = 10;

const birdImage = document.getElementById("bird-image");
const choicesContainer = document.getElementById("choices-container");
const nextButton = document.getElementById("next-button");
const scoreElement = document.getElementById("score");
const captureElement = document.getElementById("capture-date");
scoreElement.innerText = "Score: 0%";

let currentSoundFile = ''; // This will hold the URL of the sound file associated with the button

const audioPlayer = document.createElement('audio');
document.body.appendChild(audioPlayer);

document.getElementById('soundButton').addEventListener('click', () => {
    if (currentSoundFile) {
        audioPlayer.src = currentSoundFile;
        audioPlayer.play();
    }
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

function displayQuestion() {
    nextButton.disabled = true;
    const question = birdQuizData[currentQuestion];
    birdImage.src = question.image_url;
    if (!audioPlayer.paused) {
        audioPlayer.pause();
    }
    currentSoundFile = question.sound_url;
    captureElement.innerText = `Capture Date & Time: ${question.date_taken}`;
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
            currentQuestion = 0;
            right = 0;
            wrong = 0;
            scoreElement.innerText = "Score: 0%";
            nextButton.textContent = "Next";
            nextButton.disabled = false;
            shuffleData();
            setChoices();
            displayQuestion();
        }
    }
});

// Knuth shuffle
function shuffleData() {
    let currentIndex = birdQuizData.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = birdQuizData[currentIndex];
        birdQuizData[currentIndex] = birdQuizData[randomIndex];
        birdQuizData[randomIndex] = temporaryValue;
    }

    return birdQuizData;
}

// list of unique randon integers between 0 and birdQuizData.length - 1
function getRandomInts(num, exclude) {
    let ints = [];
    while (ints.length < num) {
        let randomInt = Math.floor(Math.random() * birdQuizData.length);
        if ((randomInt != exclude) && (!ints.includes(randomInt))) {
            ints.push(randomInt);
        }
    }
    return ints;
}

function setChoices() {
    for (let i = 0; i < birdQuizData.length; i++) {
        birdQuizData[i].choices = getRandomInts(numChoices, i);
        // overwrite one of answers with the right answer.
        let randomIndex = Math.floor(Math.random() * numChoices);
        birdQuizData[i].choices[randomIndex] = i;
    }
}

shuffleData();
setChoices();
displayQuestion();
