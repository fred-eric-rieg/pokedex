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

// on/off for sound muting
let mute = false;

/**
 * 
 * @param {*} name as Audio object from list of variable declarations at the top
 */
function playSound(name) {
    if (name == soundtrack) {
        name.play();
    } else {
        name.currentTime = 0;
        name.play();
    }
}

/**
 * Simply pauses the currently running soundtrack (given as parameter)
 * @param {*} name 
 */
function pauseSound(name) {
    name.currentTime = 0;
    name.pause();
}

/**
 * Controls volume with two options: 0 or 0.05.
 * Activated by the one and only mute button.
 * Uses the mute boolean declared on top.
 */
function muteSoundtrack() {
    let mutebtn = document.getElementById('mutebtn');
    if (!mute) {
        mute = true;
        soundtrack.volume = 0;
        fight.volume = 0;
        mutebtn.innerHTML = 'play music';
    } else {
        mute = false;
        soundtrack.volume = 0.05;
        fight.volume = 0.05;
        mutebtn.innerHTML = 'no music';
    }
}