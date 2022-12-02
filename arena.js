
let currentPlayerHealth = 0;
let currentEnemyHealth = 0;

let chosenAttackName = '';
let chosenAttackDmg = 0;

let playersTurn = true;

let idEnemy = 18;


function createArena(id) {
    let miniCanvas = document.getElementById('miniCanvas');
    miniCanvas.classList.add('d-none');
    let arena = document.getElementById('arena');
    arena.classList.add('d-flex');
    arena.classList.remove('d-none');
    setTimeout(function () {
        arena.classList.add('big');
        setTimeout(function () {
            spawn.play();
            placePokoemon(arena, id);
            let overlay = document.getElementById('overlay');
            overlay.setAttribute('onclick', 'hideOverlayDelayed(event);');
        }, 2000);
    }, 1000);
}


function placePokoemon(arena, id) {
    arena.innerHTML = '';
    setTimeout(function () {
        arena.innerHTML += `
            <button class="btn" style="position:absolute;top:60px;" onclick="closeArena(event)">retreat</button>
            <div>
                <img id="champion" style="height:150px;object-fit:contain;" src="${pokemons[id - 1].sprites.back_default}">
                <img id="opponent" style="height:150px;object-fit:contain;" src="${pokemons[18].sprites.front_default}">
            </div>
        `;
    }, 600);
    setPlayerHealth(id - 1);
    setEnemyHealth(18);
    renderArenaMenu(arena, id - 1, 18);
}


function closeArena(event) {
    click.currentTime = 0;
    click.play();
    hideOverlayDelayed(event);
}


function setPlayerHealth(id) {
    currentPlayerHealth = pokemons[id].stats[0].base_stat;
    console.log(currentPlayerHealth);
}


function setEnemyHealth(id) {
    currentEnemyHealth = pokemons[id].stats[0].base_stat;
    console.log(currentEnemyHealth);
}


function renderArenaMenu(arena, idPlayer, idEnemy) {
    arena.innerHTML += `
        <div style="display:flex;justify-content:space-between;gap:50px;">
            <div>
                ${pokemons[idPlayer].name} hp
                <div class="stats"><div class="outer"><div class="inner" id="innerPlayer" style="width:${currentPlayerHealth * 100 / pokemons[idPlayer].stats[0].base_stat}px;">${currentPlayerHealth}/${pokemons[idPlayer].stats[0].base_stat}</div></div></div>
            </div>
            
            <div>
                ${pokemons[idEnemy].name} hp
                <div class="stats"><div class="outer"><div class="inner" id="innerEnemy" style="width:${currentEnemyHealth * 100 / pokemons[idEnemy].stats[0].base_stat}px;">${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}</div></div></div>
            </div>
        </div>

        <div class="move-container">
            <div>
                <button class="movebtn" id="move1" onclick="lockMove('move1', ${idPlayer})">${pokemons[idPlayer].moves[0].move.name}</button>
                <button class="movebtn" id="move2" onclick="lockMove('move2', ${idPlayer})">${checkArenaAbility(idPlayer, 1)}</button>
                <button class="movebtn" id="move3" onclick="lockMove('move2', ${idPlayer})">${checkArenaAbility(idPlayer, 2)}</button>
            </div>
            <span id="description" style="padding:2px;">Description</span>
            <button class="attackbtn" id="attackbtn">attack</button>
        </div>
    `;
}


function checkArenaAbility(idPlayer, index) {
    if (pokemons[idPlayer].moves[index]) {
        return `${pokemons[idPlayer].moves[index].move.name}`;
    } else {
        return '';
    }
}


function checkArenaAbilityUrl(idPlayer, index) {
    if (pokemons[idPlayer].moves[index]) {
        return `${pokemons[idPlayer].moves[index].move.url}`;
    } else {
        return '';
    }
}


function lockMove(moveId, idPlayer) {
    click.currentTime = 0;
    click.play();
    let attackbtn = document.getElementById('attackbtn');
    let description = document.getElementById('description');
    if (moveId == 'move1') {
        chosenAttackName = pokemons[idPlayer].moves[0].move.name;
        attackbtn.setAttribute('onclick', 'startAttack(18)');
        loadDescription(pokemons[idPlayer].moves[0].move.url, description);
        loadMove(pokemons[idPlayer].moves[0].move.url);
    } else if (moveId == 'move2') {
        chosenAttackName = checkArenaAbility(idPlayer, 1);
        attackbtn.setAttribute('onclick', 'startAttack(18)');
        loadDescription(checkArenaAbilityUrl(idPlayer, 1), description);
        loadMove(checkArenaAbilityUrl(idPlayer, 1));
    } else if (moveId == 'move3') {
        chosenAttackName = checkArenaAbility(idPlayer, 2);
        attackbtn.setAttribute('onclick', 'startAttack(18)');
        loadDescription(checkArenaAbilityUrl(idPlayer, 2), description);
        loadMove(checkArenaAbilityUrl(idPlayer, 2));
    }
}


function startAttack() {
    if (playersTurn) {
        click.currentTime = 0;
        click.play();
        currentEnemyHealth = currentEnemyHealth - chosenAttackDmg;
        let enemyHealth = document.getElementById('innerEnemy');
        let champion = document.getElementById('champion');
        let opponent = document.getElementById('opponent');
        champion.classList.add('move-img-left');
        setTimeout(function () {
            champion.classList.add('move-img-right');
            if (currentEnemyHealth < 0) {
                enemyHealth.setAttribute('style', `width:${0 * 100 / pokemons[idEnemy].stats[0].base_stat}px;`);
                enemyHealth.innerHTML = `0/${pokemons[idEnemy].stats[0].base_stat}`;
                opponent.classList.add('turn-img-round');
                setTimeout(function () {
                    opponent.classList.add('drop-img-down');
                }, 225);
            } else {
                enemyHealth.setAttribute('style', `width:${currentEnemyHealth * 100 / pokemons[idEnemy].stats[0].base_stat}px;`);
                enemyHealth.innerHTML = `${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}`;
                setTimeout(function () {
                    champion.classList.remove('move-img-left');
                    champion.classList.remove('move-img-right');
                    playersTurn = false;
                    startEnemyAttack();
                }, 2000);
            }
        }, 1000);
    } else {
        cancel.currentTime = 0;
        cancel.play();
    }
}


async function loadDescription(url, target) {
    let newUrl = url;
    let response = await fetch(newUrl);
    move = await response.json();
    target.innerHTML = move.effect_entries[0].short_effect;
}


async function loadMove(url) {
    let newUrl = url;
    let response = await fetch(newUrl);
    move = await response.json();
    chosenAttackDmg = move.power;
}


function startEnemyAttack() {
    let opponent = document.getElementById('opponent');
    setTimeout(function () {
        opponent.classList.remove('move-img-left');
        opponent.classList.remove('move-img-right');
        playersTurn = true;
    }, 2000);
}