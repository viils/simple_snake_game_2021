// Canvases
const canvas = document.getElementById("myCanvas");
const ctx    = canvas.getContext("2d");

// Pictures
const headPicL      = document.getElementById("headPicL");
const headPicR      = document.getElementById("headPicR");
const headPicU      = document.getElementById("headPicU");
const headPicD      = document.getElementById("headPicD");
const bodyPic       = document.getElementById("bodyPic");
const fruitPic      = document.getElementById("fruitPic");
const text          = document.getElementById("test text");
const text2         = document.getElementById("second text");
const currentScore  = document.getElementById("current score text");
const highScores    = document.getElementById("high score text");

//Buttons and events
document.addEventListener('keydown', keyInput);
const playButton   = document.getElementById("playButton");
const resetButton  = document.getElementById("resetButton");
const slowButton   = document.getElementById("slowSpeed");
const mediumButton = document.getElementById("mediumSpeed"); 
const fastButton   = document.getElementById("fastSpeed");
playButton.addEventListener("click", playButtonClicked);
resetButton.addEventListener("click", resetButtonClicked);
fastButton.addEventListener("click", speedButtonClicked(0));
mediumButton.addEventListener("click", speedButtonClicked(1));
slowButton.addEventListener("click", speedButtonClicked(2));

// Reset values
const oDirection = [2];
const oCoordsX   = [243,243,243,243];
const oCoordsY   = [243,221,199,177];
const oComingDir = [0];

// in game values
var direction = oDirection[0];
var  xCoords  = [243,243,243,243];
var  yCoords  = [243,221,199,177];
var comingDir = oComingDir[0];
var highScore = 0;
var speed     = 250;

// other constants
const dimensions = [590, 590];
const bColor     = "#BFCDD9";
const lColor     = "black";

var didntAte   = true;
var fruitCoord = [23,23];
var gameIsOn   = false;

// Draws the grid for snake 
function drawVerticalLine(coordinate) {
    ctx.moveTo(coordinate, 0);
    ctx.lineTo(coordinate, dimensions[0]);
    ctx.stroke();
}
function drawHorizontalLine(coordinate) {
    ctx.moveTo(0,   coordinate);
    ctx.lineTo(dimensions[1], coordinate);
    ctx.stroke();
}

// Handles playButton
function playButtonClicked() {
    if(gameIsOn) {
        playButton.innerHTML = "Play";
        gameIsOn = false;
    } else {
        playButton.innerHTML = "Pause";
        gameIsOn = true;
    }
}

function resetButtonClicked() {
    newGame();
}

function speedButtonClicked(num) {
    if (num==0) {
        fastButton.disabled = true;
        speed = 125;
    } else {
        fastButton.disabled = false;
    }

    if (num==1) {
        mediumButton.disabled = true;
        speed = 250;
    } else {
        mediumButton.disabled = false;
    }
    
    if (num==2) {
        fastButton.disabled = true;
        speed = 500;
    } else {
        fastButton.disabled = false;
    }
}

// returns the next Xcoord in this direction
function nextX() {
    if (direction == 1) {
        return (xCoords[0] +22);
    } else if (direction == 3) {
        return (xCoords[0] - 22);
    } else {
        return xCoords[0];
    }
}

// returns the next yCoord in current
function nextY(){
    if (direction == 0) {
        return (yCoords[0] - 22);
    } else if (direction == 2) {
        return (yCoords[0] + 22);
    } else {
        return yCoords[0];
    }
}


// checks if snake can move forward to current direction
function snakeCanMove(newX, newY) {
    for (let i = 0; i<xCoords.length; i++) {
        if ( newX == xCoords[i] && newY == yCoords[i]) {
            return false;
        }
    }
    if (newX < 0 || newX > dimensions[0] || newY < 0 || newY > dimensions[1]) {
        return false;
    }
    return true;
}

// checks if snake is going to eat a fruit
function tryEat(newX, newY) {
    if (newX == fruitCoord[0] && newY == fruitCoord[1]) {
        didntAte = false;
        newFruit();
        text.textContent = "ate";
        document.getElementById("current score text").innerHTML = "Current score: " + xCoords.length-4;
        if (xCoords.length-4>highScore) {
            document.getElementById("high score text").innerHTML = "High score: " +xCoords.length-4;
        }
        return true;
    }
    return false;
}


// moves snake
function snakeForward(newX, newY) {
    
    if (didntAte) {
        ctx.fillStyle = bColor;
        ctx.fillRect(xCoords.pop(), yCoords.pop(), 20,20);
    } 

    xCoords = [newX].concat(xCoords);
    yCoords = [newY].concat(yCoords);
    comingDir = (direction + 2) % 4

    ctx.drawImage(bodyPic, xCoords[1], yCoords[1]);
    headTurner();

    didntAte = true;
}

// Event lisener for keys, that turns snakes head and updates the current direction
function keyInput(e) {
    text.textContent = e.keyCode;
    if (!gameIsOn) {
        return;
    } else {
        if (e.keyCode == 65 && comingDir != 3) {
            direction = 3;
        } else if (e.keyCode == 83 && comingDir != 2) {
            text.textContent = " dir set to 2";
            direction = 2;
        } else if (e.keyCode == 68 && comingDir != 1) {
            direction = 1;
        } else if (e.keyCode == 87 && comingDir != 0) {
            direction = 0;
        }
        text.textContent += " dir: " + direction;
        headTurner()
    } 
}


function headTurner() {
    ctx.fillStyle = bColor;
    ctx.fillRect(xCoords[0], yCoords[0], 20,20);
    if (direction == 3) {
        ctx.drawImage(headPicL, xCoords[0], yCoords[0]);
    } else if (direction == 2) {
        ctx.drawImage(headPicD, xCoords[0], yCoords[0]);
    } else if (direction == 1) {
        ctx.drawImage(headPicR, xCoords[0], yCoords[0]);
    } else if (direction == 0) {
        ctx.drawImage(headPicU, xCoords[0], yCoords[0]);
    }

}

// Removes the previous fruit, and adds a new randomly located fruit
function newFruit() {
    ctx.fillStyle = bColor;
    ctx.fillRect(fruitCoord[0], fruitCoord[1], 20,20);

    let newX = fruitCoord[0];
    let newY = fruitCoord[1];

    let fruitLocationNotFound = true;
    while (fruitLocationNotFound) {
        newX = Math.floor(Math.random()*dimensions[0]/22)*22 + 1;
        newY = Math.floor(Math.random()*dimensions[1]/22)*22 + 1;

        if (!xCoords.includes(newX) && !yCoords.includes(newY)) {
            fruitLocationNotFound = false;
        }
    }


    ctx.drawImage(fruitPic, newX, newY);
    fruitCoord = [newX, newY];
    text.textContent = "new fruit at " + fruitCoord;
}


// Sets up a new game 
function newGame() {

    // Setting up the variables
    xCoords = [...oCoordsX];
    yCoords = [...oCoordsY];
    direction = oDirection[0];
    comingDir = oComingDir[0];
    playButton.disabled = false;
    playButton.innerHTML = "Play";

    // Setups canvas
    ctx.fillStyle = bColor;
    ctx.fillRect(0,0, dimensions[0], dimensions[1]);

    ctx.fillStyle = lColor;
    for (let i = 22; i<600; i = i+22) {
        drawVerticalLine(i);
        drawHorizontalLine(i);
    }

    // Draws the snake
    for(let i = 1; i< 4; i++) {
        ctx.drawImage(bodyPic, xCoords[i], yCoords[i]);
    }
    ctx.drawImage(headPicD, xCoords[0], yCoords[0]);

    newFruit();
}


function forwardGame() {
    if (gameIsOn) {
        text.textContent = " dir in forward: " + direction;
        let newX = nextX();
        let newY = nextY();
        
        if (snakeCanMove(newX, newY)) {
            tryEat(newX,newY);
            snakeForward(newX, newY);
            text2.textContent = "x: " + xCoords + " y: " + yCoords;
        } else {
            text.textContent = "Game over";
            gameIsOn = false;
            playButton.disabled = true;
        }

    }
}

newGame();
// Time
setInterval(forwardGame, speed);

