
let currentPlayerHealth = 0;

let currentEnemyHealth = 0;


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
                <div class="stats"><div class="outer"><div class="inner" style="width:${currentPlayerHealth * 100/pokemons[idPlayer].stats[0].base_stat}px;">${currentPlayerHealth}/${pokemons[idPlayer].stats[0].base_stat}</div></div></div>
            </div>
            
            <div>
                ${pokemons[idEnemy].name} hp
                <div class="stats"><div class="outer"><div class="inner" style="width:${currentEnemyHealth * 100/pokemons[idEnemy].stats[0].base_stat}px;">${currentEnemyHealth}/${pokemons[idEnemy].stats[0].base_stat}</div></div></div>
            </div>
        </div>
    `;
}