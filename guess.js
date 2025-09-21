let gameName = "Guess The Word Game"

const container = document.getElementById('stars-container');
const letters = "abcdefgjielajclueqwpnmvcxzty?".replace(/\s+/g, '-');

letters.split('').forEach((letter, i) => {
    const square = document.createElement('div');
    square.classList.add('square');

    square.classList.add(i % 2 === 0 ? "yallow" : "orange");

    square.textContent = letter;

    const top = Math.random() * 80 + 10; // Random top position between 10% and 90%
    const left = Math.random() * 50 + 10; // Random left position between 10% and 90%
    square.style.top = `${top + "%"}`;
    square.style.left = `${left + "%"}`;

    square.style.animationDelay = `${Math.random() * 4 + 4 + 's'}`


    // حجم عشوائي للنجوم


    container.appendChild(square);
});


document.querySelector("h1").innerText = gameName;

//game logic
let numOfTries = 6;
let numOfLaetters = 6;
let currentTry = 1;
let massegeArea = document.querySelector(".massege");
let numOfHints = 3;
let difficulty = "normal"; //default difficulty


let wordToGuess = "";
let words ={ normal: [
    "planet",
    "bridge",
    "silver",
    "yellow",
    "forest",
    "rocket",
    "purple",
    "summer",
    "dragon",
    "circle"
], hard: [
    "beacon",
    "riddle",
    "fabric",
    "laptop",
    "pencil",
    "rocket",
    "spirit",
    "winter",
    "silver",
    "banana"
  ]
};
wordToGuess = words[difficulty][Math.floor(Math.random() * words[difficulty].length)].toLowerCase();


function setword(){
    if (difficulty === "normal") {
        numOfTries = 6;
        numOfLaetters = 6;
        wordToGuess = words.normal[Math.floor(Math.random() * words.normal.length)].toLowerCase();
    } else if (difficulty === "hard") {
        numOfTries = 3;
        numOfLaetters = 6;
        wordToGuess = words.hard[Math.floor(Math.random() * words.hard.length)].toLowerCase();
    }
}
setword();

//mange hint
document.querySelector(".hint span").innerHTML = numOfHints;
const getHintBottun = document.querySelector(".hint");
getHintBottun.addEventListener("click", getHint);

function geninputs() {
    const inputContainer = document.querySelector(".inputs");

    for (let i = 1; i <= numOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`)
        tryDiv.innerHTML = `<span>try ${i}</span>`;

        if (i !== 1) tryDiv.classList.add("hidden");

        for (let j = 1; j <= numOfLaetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.maxLength = 1;
            tryDiv.appendChild(input);
        }


        inputContainer.appendChild(tryDiv);
    }
    inputContainer.children[0].children[1].focus();


    const hideinputs = document.querySelectorAll(".hidden input");
    hideinputs.forEach((input) => (input.disabled = true));

    //convert inputs to uppercase
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.toUpperCase();

            const nextinput = inputs[index + 1];
            if (nextinput) nextinput.focus();
        });

        input.addEventListener("keydown", (e) => {
            const currentindex = Array.from(inputs).indexOf(e.target);
            if (e.key === "ArrowRight") {
                const nextinput = currentindex + 1;
                if (nextinput < inputs.length) inputs[nextinput].focus();
            }
            if (e.key === "ArrowLeft") {
                const previnput = currentindex - 1;
                if (previnput >= 0) inputs[previnput].focus();
            }
        });
    });
}

const guessButton = document.querySelector(".chack");
guessButton.addEventListener("click", handleguess);
//console.log(wordToGuess)

function handleguess() {
    let success = true;
    for (let i = 1; i <= numOfLaetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const aletter = wordToGuess[i - 1];

        if (letter === aletter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-place");
            success = false;
        } else {
            inputField.classList.add("no");
            success = false;
        }
    }
    if (success) {
        massegeArea.innerHTML = `you win! the word is:<span> ${wordToGuess}</span>`;
        let alltries = document.querySelectorAll(".inputs div");
        alltries.forEach((tryDiv) => tryDiv.classList.add("hidden"));
        guessButton.disabled = true;
        getHintBottun.disabled = true;
    } else {
        document.querySelector(`.try-${currentTry}`).classList.add("hidden");
        const currntTryinputs = document.querySelectorAll(`.try-${currentTry} input`);
        currntTryinputs.forEach((input) => (input.disabled = true));
        currentTry++;
        const nextTryinputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryinputs.forEach((input) => (input.disabled = false));
        massegeArea.innerHTML = `you have ${numOfTries - currentTry} tries left`;
    }
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
        document.querySelector(`.try-${currentTry}`).classList.remove("hidden");
        el.children[1].focus();
    } else {
        massegeArea.innerHTML = `you lose! the word is:<span> ${wordToGuess}</span> your soul is mine`;
        guessButton.disabled = true;
        getHintBottun.disabled = true;
    }
    let restButton = document.querySelector(".rest");
    restButton.addEventListener("click", () => {
        location.reload();
    });
}

function getHint() {
    if (numOfHints > 0) {
        numOfHints--;
        document.querySelector(".hint span").innerHTML = numOfHints;
    }
    if (numOfHints === 0) {
        getHintBottun.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyenabledInputs = Array.from(enabledInputs).filter(input => input.value === "");

    if (emptyenabledInputs.length > 0) {
        const randomindex = Math.floor(Math.random() * emptyenabledInputs.length);
        const randomInput = emptyenabledInputs[randomindex];
        randomInput.value = wordToGuess[Array.from(enabledInputs).indexOf(randomInput)].toUpperCase();
    }
}

function handlebackspace(e) {
    if (e.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            currentInput.value = ""; // Clear the current input
            prevInput.value = ""; // Clear the previous input
            prevInput.focus();
        }
    }
}
document.addEventListener("keydown", handlebackspace);
window.onload = () => {
    geninputs();
}


document.querySelectorAll(".difficulty button").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".difficulty button").forEach(b => b.classList.remove("active"));
    this.classList.add("active");

    difficulty = this.dataset.level;
    setword();   // غير الكلمة والمحاولات حسب الصعوبة
    currentTry = 1;
      document.querySelectorAll(".inputs input").forEach((input) => (input.disabled = true));
    document.querySelector(".inputs").innerHTML = ""; // امسح الانبتات القديمة
    geninputs();
    //geninputs(); // ارسم الانبتات من جديد
    massegeArea.innerHTML = `Difficulty set to ${difficulty}`;
    //console.log("Word to guess:", wordToGuess); //for cheating :))
  });
});


// End of the game logic
