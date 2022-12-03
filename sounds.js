// All sounds
let soundtrack = new Audio("sound/background.mp3");
soundtrack.volume = 0.05;
let fight = new Audio("sound/fight.mp3");
fight.volume = 0.05;
fight.currentTime = 1;
let click = new Audio('sound/click.wav');
click.volume = 0.1;
let spawn = new Audio('sound/spawn.wav');
spawn.volume = 0.1;
let cancel = new Audio('sound/cancel.wav');
cancel.volume = 0.1;
let attack = new Audio('sound/attack.mp3');
attack.volume = 0.1;
let dead = new Audio('sound/dead.mp3');
dead.volume = 0.1;


function playSound(name) {
    name.currentTime = 0;
    name.play();
}


function pauseSound(name) {
    name.currentTime = 0;
    name.pause();
}