

const creditsListElement = document.getElementById('creditsList');

if (creditsListElement) {
    birdQuizData.forEach(bird => {
        const listItem = document.createElement('li');
        listItem.textContent = `${bird.title} - ${bird.sound_artist} - ${bird.sound_license}`;
        creditsListElement.appendChild(listItem);
    });
}