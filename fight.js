let currentPlayerHealth = 0;
let currentEnemyHealth = 0;

let chosenAttackName = '';
let chosenAttackDmg = 0;

let chosenEnemyAttackName = '';
let chosenEnemyAttackDmg = 0;

let playersTurn = true;

/**
 * Called when player selects a move.
 */
function lockMove(moveId) {
    playSound(click);
    if (moveId == 'move1') {
        chosenAttackName = returnValidMoveName(0);
        hightlightMove(moveId);
        writeAttackDescription('move', idPlayer);
        activateAttackBtn();
        loadMove(pokemons[idPlayer].moves[0].move.url, "player");
    } else if (moveId == 'move2') {
        chosenAttackName = returnValidMoveName(1);
        hightlightMove(moveId);
        writeAttackDescription('move', idPlayer);
        activateAttackBtn();
        loadMove(checkArenaAbilityUrl(1), "player");
    } else if (moveId == 'move3') {
        chosenAttackName = returnValidMoveName(2);
        hightlightMove(moveId);
        writeAttackDescription('move', idPlayer);
        activateAttackBtn();
        loadMove(checkArenaAbilityUrl(2), "player");
    }
}

/**
 * Called when player clicks the attack button
 */
function startAttack() {
    if (playersTurn) {
        deactivateAttackBtn();
        playSound(attack);
        playSound(click);
        calculateDamageToEnemy();
        writeAttackDescription('', idPlayer);
        visualiseAttackEffect(idPlayer);
        setTimeout(function () {
            checkIfDead(idEnemy);
        }, 1000);
    } else {
        playSound(cancel);
    }
}


function calculateDamageToEnemy() {
    currentEnemyHealth -= Math.floor(chosenAttackDmg
        * pokemons[idEnemy].stats[2].base_stat / 100
        * pokemons[idPlayer].stats[1].base_stat / 100);
}


/**
 * Activates the attack button and sets the onclick attribute to startAttack().
 * Is called when a move is selected.
 */
function activateAttackBtn() {
    let attackbtn = document.getElementById('attackbtn');
    attackbtn.classList.remove('attackbtn-inactive');
    attackbtn.setAttribute('onclick', 'startAttack()');
}


function deactivateAttackBtn() {
    let attackbtn = document.getElementById('attackbtn');
    attackbtn.classList.add('attackbtn-inactive');
    attackbtn.removeAttribute('onclick', 'startAttack()');
}

/**
 * 
 * @param {*} id
 */
function checkIfDead(id) {
    if (id == idEnemy) {
        if (currentEnemyHealth < 1) {
            playSound(dead);
            updateHealthpoints(idEnemy, "dead");
            visualiseDeath(idEnemy);
            displayWinner();
            setTimeout(function () {
                closeArena();
                hideWinner();
            }, 2000);
        } else {
            updateHealthpoints(idEnemy, "alive");
            visualiseHitEffect(opponent);
            setTimeout(function () {
                playersTurn = false;
                startEnemyAttack();
            }, 2000);
        }
    } else {
        if (currentPlayerHealth < 1) {
            playSound(dead);
            updateHealthpoints(idPlayer, "dead");
            visualiseDeath(idPlayer);
            setTimeout(function () {
                closeArena();
            }, 2000);
        } else {
            updateHealthpoints(idPlayer, "alive");
            visualiseHitEffect(champion);
            setTimeout(function () {
                playersTurn = true;
                writeAttackDescription("Choose your attack!", idPlayer);
            }, 2000);
        }
    }
}

/**
 * 
 * @param {*} id 
 * @param {*} status 
 */
function updateHealthpoints(id, status) {
    let enemyHealth = document.getElementById('innerEnemy');
    let playerHealth = document.getElementById('innerPlayer');
    if (id == idEnemy & status == "dead") {
        enemyHealth.setAttribute('style', `width:0px;`);
        enemyHealth.innerHTML = `0/${pokemons[idEnemy].stats[0].base_stat}`;
    }
    if (id == idEnemy & status == "alive") {
        enemyHealth.setAttribute('style', `width:${Math.floor(currentEnemyHealth * 100 / pokemons[idEnemy].stats[0].base_stat)}px;`);
        enemyHealth.innerHTML = `${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}`;
    }
    if (id == idPlayer & status == "dead") {
        playerHealth.setAttribute('style', `width:0px;`);
        playerHealth.innerHTML = `0/${pokemons[idPlayer].stats[0].base_stat}`;
    }
    if (id == idPlayer & status == "alive") {
        playerHealth.setAttribute('style', `width:${Math.floor(currentPlayerHealth * 100 / pokemons[idPlayer].stats[0].base_stat)}px;`);
        playerHealth.innerHTML = `${currentPlayerHealth}/${pokemons[idPlayer].stats[0].base_stat}`;
    }
}

/**
 * 
 * @param {*} id 
 */
function visualiseDeath(id) {
    if (id == idEnemy) {
        let opponent = document.getElementById('opponent');
        opponent.classList.add('turn-img-round');
        setTimeout(function () {
            opponent.classList.add('drop-img-down');
        }, 225);
    } else {
        let champion = document.getElementById('champion');
        champion.classList.add('turn-img-round');
        setTimeout(function () {
            champion.classList.add('drop-img-down');
        }, 225);
    }
}

/**
 * 
 * @param {*} id 
 */
function visualiseAttackEffect(id) {
    let opponent = document.getElementById('opponent');
    let champion = document.getElementById('champion');
    if (id == idPlayer) {
        for (let i = 1; i < 4; i++) {
            setTimeout(function () {
                champion.classList.remove('move-img-left');
                champion.classList.add('move-img-right');
            }, i * 100)
            setTimeout(function () {
                champion.classList.remove('move-img-right');
                champion.classList.add('move-img-left');
            }, i * 200);
        };
    } else {
        for (let i = 1; i < 4; i++) {
            setTimeout(function () {
                opponent.classList.remove('move-img-right');
                opponent.classList.add('move-img-left');
            }, i * 100)
            setTimeout(function () {
                opponent.classList.remove('move-img-left');
                opponent.classList.add('move-img-right');
            }, i * 200);
        };
    }
}


function visualiseHitEffect(pokemon) {
    pokemon.classList.add('hit');
    for (let i = 1; i < 6; i++) {
        if (i == 1 || i == 3 || i == 5) {
            setTimeout(function () {
                pokemon.classList.remove('hit');
            }, i * 100);
        } else {
            setTimeout(function () {
                pokemon.classList.add('hit');
            }, i * 100);
        }
    }
}

/**
 * 
 */
function startEnemyAttack() {
    playSound(attack);
    visualiseAttackEffect(idEnemy);
    chooseEnemyAttack();
    setTimeout(function () {
        visualiseHitEffect(champion);
        writeAttackDescription("move", idEnemy);
        claculateEnemyDamage();
        setTimeout(function () {
            writeAttackDescription("", idEnemy);
        }, 1000);
        checkIfDead(idPlayer);
    }, 1000);
}


function chooseEnemyAttack() {
    randomIndex = Math.floor(Math.random() * 3);
    chosenEnemyAttackName = pokemons[idEnemy].moves[randomIndex].move.name;
    loadMoveEnemy(pokemons[idEnemy].moves[randomIndex].move.url);
}


function claculateEnemyDamage() {
    currentPlayerHealth -= Math.floor(chosenEnemyAttackDmg
        * pokemons[idPlayer].stats[2].base_stat / 100
        * pokemons[idEnemy].stats[1].base_stat / 100);
}

/**
 * 
 * @param {*} url 
 */
async function loadMoveEnemy(url) {
    let newUrl = url;
    let response = await fetch(newUrl);
    move = await response.json();
    chosenEnemyAttackDmg = move.power;
}

/**
 * 
 * @param {*} type 
 * @param {*} id 
 */
function writeAttackDescription(type, id) {
    let attackDescription = document.getElementById('attackDescription');
    if (id == idPlayer) {
        if (type == "move") {
            attackDescription.innerHTML = chosenAttackName;
        } else if (type == "Choose your attack!") {
            attackDescription.innerHTML = "Choose your attack!";
            chosenAttackName = '';
            chosenAttackDmg = 0;
        } else {
            attackDescription.innerHTML = `
                ${pokemons[idPlayer].name} inflicted ${Math.floor(chosenAttackDmg
                    * pokemons[idEnemy].stats[2].base_stat / 100
                    * pokemons[idPlayer].stats[1].base_stat / 100)} dmg
                `;
        }
    } else {
        if (type == "move") {
            attackDescription.innerHTML = `${pokemons[idEnemy].name} chooses ${chosenEnemyAttackName}`;
        } else {
            attackDescription.innerHTML = `
                ${pokemons[idEnemy].name} inflicted ${Math.floor(chosenEnemyAttackDmg
                    * pokemons[idPlayer].stats[2].base_stat / 100
                    * pokemons[idEnemy].stats[1].base_stat / 100)} dmg
                `;
        }
    }
}


async function loadMove(url, who) {
    let newUrl = url;
    let response = await fetch(newUrl);
    move = await response.json();
    chosenAttackDmg = move.power;
    if (who == "player") activateAttackBtn();
}


function displayWinner() {
    let arena = document.getElementById('arena');
    arena.classList.add('winner');
}


function hideWinner() {
    let arena = document.getElementById('arena');
    arena.classList.remove('winner');
}