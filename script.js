let currentQuestion = 0;
let right = 0;
let wrong = 0;
let quizLength = 10;
let numChoices = 10;

const birdImage = document.getElementById("bird-image");
const choicesContainer = document.getElementById("choices-container");
const nextButton = document.getElementById("next-button");
const rightElement = document.getElementById("right");
const wrongElement = document.getElementById("wrong");

function displayQuestion() {
    nextButton.disabled = true;
    const question = birdQuizData[currentQuestion];
    birdImage.src = question.image_url;
    choicesContainer.innerHTML = "";
    question.choices.forEach((choice, index) => {
        const choiceButton = document.createElement("button");
        // remove the underscore and everything after from the choice and display that in the button.
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
            }
            rightElement.innerText = right;
            wrongElement.innerText = wrong;
            nextButton.disabled = false;
        });

        choicesContainer.appendChild(choiceButton);
    });
}

nextButton.addEventListener("click", () => {
    currentQuestion++;

    if (currentQuestion < quizLength) {
        displayQuestion();
    } else {
        alert(`Quiz completed! Your got ${right} right of ${quizLength} questions.`);
        currentQuestion = 0;
    }
});

// Knuth shuffle
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array; 
}

birdQuizData = shuffle(birdQuizData);

for (let i = 0; i < birdQuizData.length; i++) {
    // create a new array
    choices = [];
    // fill array with indices of the original array
    // TODO: this is a bit wasteful, we could select a random index from the original array.
    // The choice array only needs to be as long as the number of choices we want to display.
    for (let j = 0; j < birdQuizData.length; j++) {
        if (j === i) {
            continue;
        }
        if (choices.length === numChoices) {
            break;
        }
        choices.push(j);
    }
    birdQuizData[i].choices = choices;
    // overwrite one of answers with the right answer.
    let randomIndex = Math.floor(Math.random() * numChoices);
    birdQuizData[i].choices[randomIndex] = i;
}

displayQuestion();
