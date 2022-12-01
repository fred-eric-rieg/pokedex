let currentPokemon;

let pokemons = [];

// default id
let ids = [];

// All sounds
let soundtrack = new Audio("sound/background.mp3");
let fight = new Audio("sound/fight.mp3");
let click = new Audio('sound/click.wav');
let spawn = new Audio('sound/spawn.wav');
let cancel = new Audio('sound/cancel.wav');

loadPokemon();





function loadPokemon() {
    console.log("pulling pokemon...");

    for (i = 1; i < 152; i++) {
        ids.push(i);
    }

    console.log("done");
}


async function getData() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    for (let i = 0; i < ids.length; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${ids[i]}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        renderPokemon(currentPokemon, ids[i]);
    }
    console.log(pokemons[0].name);
}


function renderPokemon(currentPokemon, id) {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML += `
        <div class="wrap">
            <div class="card" id="card${id}" onclick="showMenu(${id})">
                <span>Name<br><b>${currentPokemon.name}</b> ${id}</span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <span>Height: ${currentPokemon.height}</span>
                <span>Weight: ${currentPokemon.weight}</span>
            </div>
        </div>`;
}


function showMenu(id) {
    click.play();
    cancel.pause();
    cancel.currentTime = 0;
    soundtrack.play();
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.innerHTML = '';
    miniCanvas.innerHTML = renderSinglePokemon(id);;
}


function renderSinglePokemon(id) {
    return `
        <div class="wrap">
            <div class="card-nohover" id="card${id}" onclick="showMenu(${id})">
                <span>Name<br><b>${pokemons[id-1].name}</b> ${id}</span>
                <img id="img${id}" style="height:150px;object-fit:contain;" src="${pokemons[id-1].sprites.front_default}">
                <span>Height: ${pokemons[id-1].height}</span>
                <span>Weight: ${pokemons[id-1].weight}</span>
                <button class="btn" onclick="startFight(event, ${id})">Select as Champion</button>
            </div>
        </div>
`;
}


function startFight(event, id) {
    let overlay = document.getElementById('overlay');
    overlay.setAttribute('onclick', '');
    event.stopPropagation();
    click.play();
    startEffects(id);
    setTimeout(function() {
        soundtrack.pause();
        soundtrack.currentTime = 0;
    }, 1000);
    fight.play();
    setTimeout(function() {
        createArena(id);
    }, 3000);
}


function startEffects(id) {
    let card = document.getElementById(`card${id}`);
    setTimeout(function() {
        card.classList.add('green');
    }, 500);
    setTimeout(function() {
        card.classList.remove('green');
        card.classList.add('lightgreen');
    }, 1000);
    setTimeout(function() {
        card.classList.remove('lightgreen');
        card.classList.add('green');
    }, 1500);
    setTimeout(function() {
        card.classList.remove('green');
        card.classList.add('lightgreen');
    }, 2000);
    setTimeout(function() {
        card.classList.remove('lightgreen');
        card.classList.add('green');
    }, 2500);
    setTimeout(function() {
        card.classList.remove('green');
    }, 3000);
    card.classList.add('border-green');

    let image = document.getElementById(`img${id}`);
    image.classList.add('rotate');
}


function createArena(id) {
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.classList.add('d-none');
    let arena = document.getElementById('arena');
    arena.classList.add('d-flex');
    arena.classList.remove('d-none');
    setTimeout(function() {
        arena.classList.add('big');
        setTimeout(function() {
            spawn.play();
            placePokoemon(arena, id);
            let overlay = document.getElementById('overlay');
            overlay.setAttribute('onclick', 'hideOverlayDelayed();');
        }, 2000);
    }, 1000);
    
}


function placePokoemon(arena, id) {
    arena.innerHTML = '';
    arena.innerHTML += `
        <img id="champion" style="height:150px;object-fit:contain;" src="${pokemons[id-1].sprites.back_default}">
        <img id="opponent" style="height:150px;object-fit:contain;" src="${pokemons[55].sprites.front_default}">
    `;
}


function hideOverlayDelayed() {
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    let arena = document.getElementById('arena');

    setTimeout(function() {
        overlay.classList.add('d-none');
        arena.classList.remove('d-flex');
        arena.classList.add('d-none');
        miniCanvas.classList.remove('d-none');
        cancel.play();
    }, 1000);

    arena.classList.remove('big');
    arena.classList.add('small');
    arena.innerHTML = '';
    fight.pause();
    fight.currentTime = 0;
    overlay.setAttribute('onclick', 'hideOverlay();');
}


function hideOverlay() {
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    let arena = document.getElementById('arena');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    cancel.play();
}


function maintainOverlay(event) {
    event.stopPropagation();
}