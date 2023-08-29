let currentQuestion = 0;
let right = 0;
let wrong = 0;

const birdImage = document.getElementById("bird-image");
const choicesContainer = document.getElementById("choices-container");
const nextButton = document.getElementById("next-button");
const rightElement = document.getElementById("right");
const wrongElement = document.getElementById("wrong");

function displayQuestion() {
    const question = birdQuizData[currentQuestion];
    birdImage.src = question.image;
    choicesContainer.innerHTML = "";

    question.choices.forEach((choice, index) => {
        const choiceButton = document.createElement("button");
        choiceButton.innerText = choice;
        choiceButton.classList.add("choices");

        if (choice === question.answer) {
            choiceButton.dataset.correct = true;
        }

        choiceButton.addEventListener("click", (e) => {
            const selected = e.target;
            const correct = selected.dataset.correct;

            if (correct) {
                right++;
                console.log("right");
            } else {
                wrong++;
                console.log("wrong");
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

    if (currentQuestion < birdQuizData.length) {
        displayQuestion();
    } else {
        alert("Quiz completed! Your score: " + score);
        currentQuestion = 0;
        score = 0;
        scoreElement.innerText = score;
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

for (let i = 0; i < birdQuizData.length; i++) {
    // create a new array
    choices = new Array(birdQuizData.length);
    // file array with indices of the original array
    for (let j = 0; j < choices.length; j++) {
        choices[j] = j;
    }
    // shuffle the choices array
    let shuffled = shuffle(choices);

    // remove i from the shuffled array
    for (let j = 0; j < shuffled.length; j++) {
        if (shuffled[j] === i) {
            shuffled.splice(j, 1);
        }
    }

    
    birdQuizData[i].choices = [];
    for (let j = 0; j < 10; j++) {
        birdQuizData[i].choices[j] = birdQuizData[shuffled[j]].answer;
    }
    // insert the correct answer at a random index
    let randomIndex = Math.floor(Math.random() * 5);
    birdQuizData[i].choices[randomIndex] = birdQuizData[i].answer;
}

displayQuestion();
