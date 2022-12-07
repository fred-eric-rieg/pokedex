// Current Pokemon that is fetched from server is stored here (one after another).
let currentPokemon;

// Collects all pokemon that were fetched.
let pokemons = [];

// Collects ids off all pokemon that were fetched.
let ids = [];


loadPokemon(1, 20);


function loadPokemon(start, end) {
    for (i = start; i < end+2; i++) {
        ids.push(i);
    }
}

/**
 * Onclick function of loadbtn that loads the remaining pokemon if user clickes on it.
 */
function loadMore() {
    if (ids.length < 22) {
        let loadbtn = document.getElementById('loadbtn');
        loadbtn.innerHTML = "loading completed";
        pokemons = [];
        ids = [];
        playSound(click);
        loadPokemon(1, 150);
        getData();
    } else {
        playSound(cancel);
    }
}


async function getData() {
    hideCanvas();
    for (let i = 0; i < ids.length; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${ids[i]}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        renderPokemon(currentPokemon, ids[i]);
    }
    showCanvas();
}


function hideCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    canvas.classList.add('d-none');
}


function showCanvas() {
    let canvas = document.getElementById('canvas');
    canvas.classList.remove('d-none');
}


function renderPokemon(currentPokemon, id) {
    let canvas = document.getElementById('canvas');
    canvas.innerHTML += templateHTML(currentPokemon, id);
    changeTypeColor(currentPokemon, id);
}


function templateHTML(currentPokemon, id) {
    return `
        <div class="wrap">
            <div class="card" id="card${id}" onclick="showPokemon(${id})" onmouseover="changeColor('${currentPokemon.types[0].type.name}', ${id})">
                <span>#${id}<br><b>${currentPokemon.name.toUpperCase()}</b></span>
                <img style="height:150px;object-fit:contain;" src="${currentPokemon.sprites.front_default}">
                <div class="type" id="types${id}">${currentPokemon.types[0].type.name.toUpperCase()}</div>
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


function changeTypeColor(currentPokemon, id) {
        let typeName = currentPokemon.types[0].type.name;
        let type = document.getElementById(`types${id}`);
        if      (typeName == "grass")   type.style.background = 'lightgreen';
        else if (typeName == "fire")    type.style.background = 'lightcoral';
        else if (typeName == "water")   type.style.background = 'lightskyblue';
        else if (typeName == "wind")    type.style.background = 'lightskyblue';
        else if (typeName == "normal")  type.style.background = '#ccc';
        else if (typeName == "bug")     type.style.background = 'burlywood';
}


function changeColor(type, id) {
    let card = document.getElementById(`card${id}`);
    if      (type == "grass")   card.classList.add('green-card');
    else if (type == "fire")    card.classList.add('red-card');
    else if (type == "water")   card.classList.add('blue-card');
    else if (type == "wind")    card.classList.add('blue-card');
    else if (type == "normal")  card.classList.add('grey-card');
    else if (type == "bug")     card.classList.add('brown-card');
}


function showPokemon(id) {
    playSound(click);
    playSound(soundtrack);
    let overlay = document.getElementById('overlay');
    overlay.classList.remove('d-none');
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.innerHTML = '';
    miniCanvas.innerHTML = renderSinglePokemon(id);;
}


function renderSinglePokemon(id) {
    return `
        <div class="wrap-nohover">
            <div class="card-nohover" id="card${id}">
                <div style="display:flex;justify-content:space-between;">
                    <span>#${id}<br><b>${pokemons[id-1].name.toUpperCase()}</b></span>
                    <button class="btn" id="closebtn" onclick="hideOverlay(event)" style="align-self:end;width:50px;height:40px;margin-top:0;">X</button>
                </div>
                <img id="img${id}" style="height:150px;object-fit:contain;" src="${pokemons[id-1].sprites.front_default}">
                <div class="stats">health <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[0].base_stat}px;">${pokemons[id-1].stats[0].base_stat}/100</div></div></div>
                <div class="stats">attack <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[1].base_stat}px;">${pokemons[id-1].stats[1].base_stat}/100</div></div></div>
                <div class="stats">defense <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[2].base_stat}px;">${pokemons[id-1].stats[2].base_stat}/100</div></div></div>
                <div class="stats">speed <div class="outer"><div class="inner" style="width:${pokemons[id-1].stats[5].base_stat}px;">${pokemons[id-1].stats[5].base_stat}/100</div></div></div>
                <button class="btn" onclick="startFight(event, ${id})">select Champion</button>
            </div>
        </div>
    `;
}


function startFight(event, id) {
    let overlay = document.getElementById('overlay');
    overlay.setAttribute('onclick', '');
    let closebtn = document.getElementById('closebtn')
    closebtn.setAttribute('onclick', '');
    event.stopPropagation();
    playSound(click);
    startEffects(id);
    setTimeout(function() {
        pauseSound(soundtrack);
    }, 1000);
    playSound(fight);
    setTimeout(function() {
        openArena(id);
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
    let arena = document.getElementById('arena');
    overlayTimeout(overlay, arena);
    arena.classList.remove('big');
    arena.classList.add('small');
    arena.innerHTML = '';
    pauseSound(fight);
    overlay.setAttribute('onclick', 'hideOverlay();');
}


function overlayTimeout(overlay, arena) {
    let miniCanvas = document.getElementById('miniCanvas');
    setTimeout(function() {
        overlay.classList.add('d-none');
        arena.classList.remove('d-flex');
        arena.classList.add('d-none');
        miniCanvas.classList.remove('d-none');
        playSound(cancel);
    }, 1000);
}


function hideOverlay(event) {
    event.stopPropagation();
    let overlay = document.getElementById('overlay');
    let miniCanvas = document.getElementById('miniCanvas');
    overlay.classList.add('d-none');
    miniCanvas.classList.remove('d-none');
    let closebtn = document.getElementById('closebtn');
    closebtn.setAttribute('onclick', 'closeArena(event)');
    cancel.currentTime = 0;
    cancel.play();
}


function maintainOverlay(event) {
    event.stopPropagation();
}