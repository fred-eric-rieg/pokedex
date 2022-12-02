let currentPokemon;

let pokemons = [];

// default id
let ids = [];

// All sounds
let soundtrack = new Audio("sound/background.mp3");
soundtrack.volume = 0.2;
let fight = new Audio("sound/fight.mp3");
fight.volume = 0.2;
fight.currentTime = 1;
let click = new Audio('sound/click.wav');
click.volume = 0.2;
let spawn = new Audio('sound/spawn.wav');
spawn.volume = 0.2;
let cancel = new Audio('sound/cancel.wav');
cancel.volume = 0.2;
let attack = new Audio('sound/attack.mp3');
let dead = new Audio('sound/dead.mp3');


loadPokemon(1, 20);


function loadPokemon(start, end) {
    for (i = start; i < end+2; i++) {
        ids.push(i);
    }
}


function loadMore() {
    let loadbtn = document.getElementById('loadbtn');
    if (ids.length < 22) {
        loadbtn.innerHTML = "loading completed";
        pokemons = [];
        ids = [];
        click.play();
        loadPokemon(1, 150);
        getData();
    } else {
        cancel.play();
    }
}


async function getData() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    canvas.classList.add('d-none');
    for (let i = 0; i < ids.length; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${ids[i]}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        renderPokemon(currentPokemon, ids[i]);
    }
    canvas.classList.remove('d-none');
}


function renderPokemon(currentPokemon, id) {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML += templateHTML(currentPokemon, id);
}


function templateHTML(currentPokemon, id) {
    return `
        <div class="wrap">
            <div class="card" id="card${id}" onclick="showMenu(${id})" onmouseover="changeColor('${currentPokemon.types[0].type.name}', ${id})">
                <span>#${id}<br><b>${currentPokemon.name.toUpperCase()}</b></span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <span>Abilities</span>
                <span style="font-size:smaller;">+ ${currentPokemon.moves[0].move.name}</span>
                <span style="font-size:smaller;">+ ${checkAbility(currentPokemon, 1)}</span>
                <span style="font-size:smaller;">+ ${checkAbility(currentPokemon, 2)}</span>
            </div>
        </div>
    `;
}


function checkAbility(currentPokemon, index) {
    if (currentPokemon.moves[index]) {
        return `${currentPokemon.moves[index].move.name}`;
    } else {
        return '';
    }
}


function changeColor(type, id) {
    let card = document.getElementById(`card${id}`);
    if (type == "grass") {
        card.classList.add('green-card');
    } else if (type == "fire") {
        card.classList.add('red-card');
    } else if (type == "water") {
        card.classList.add('blue-card');
    } else if (type == "wind") {
        card.classList.add('blue-card');
    } else if (type == "normal") {
        card.classList.add('grey-card');
    } else if (type == "bug") {
        card.classList.add('brown-card');
    }
}


function showMenu(id) {
    click.currentTime = 0;
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
        <div class="wrap-nohover">
            <div class="card-nohover" id="card${id}" onclick="showMenu(${id})">
                <span>#${id}<br><b>${pokemons[id-1].name.toUpperCase()}</b></span>
                <img id="img${id}" style="height:150px;object-fit:contain;" src="${pokemons[id-1].sprites.front_default}">
                <div class="stats">health <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[0].base_stat}px;">${pokemons[id-1].stats[0].base_stat}/100</div></div></div>
                <div class="stats">attack <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[1].base_stat}px;">${pokemons[id-1].stats[1].base_stat}/100</div></div></div>
                <div class="stats">defense <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[2].base_stat}px;">${pokemons[id-1].stats[2].base_stat}/100</div></div></div>
                <div class="stats">speed <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[5].base_stat}px;">${pokemons[id-1].stats[5].base_stat}/100</div></div></div>
                <button class="btn" onclick="startFight(event, ${id})">select as Champion</button>
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
    sequenceOfCardEffects(card);
    let image = document.getElementById(`img${id}`);
    image.classList.add('rotate');
}


function sequenceOfCardEffects(card) {
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
}


function hideOverlayDelayed(event) {
    event.stopPropagation();
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    let arena = document.getElementById('arena');
    overlayTimeout(overlay, arena, miniCanvas);
    arena.classList.remove('big');
    arena.classList.add('small');
    arena.innerHTML = '';
    fight.pause();
    fight.currentTime = 1;
    overlay.setAttribute('onclick', 'hideOverlay();');
}


function overlayTimeout() {
    setTimeout(function() {
        overlay.classList.add('d-none');
        arena.classList.remove('d-flex');
        arena.classList.add('d-none');
        miniCanvas.classList.remove('d-none');
        cancel.currentTime = 0;
        cancel.play();
    }, 1000);
}


function hideOverlay() {
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    cancel.currentTime = 0;
    cancel.play();
}


function maintainOverlay(event) {
    event.stopPropagation();
}