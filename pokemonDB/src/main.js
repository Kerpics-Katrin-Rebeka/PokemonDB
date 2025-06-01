import axios from 'axios';

const nameInput = document.getElementById('name');
const idInput = document.getElementById('numbah');
const imgElement = document.getElementById('Image');
const pokemonName = document.getElementById('pokemon_name');
const pokemonAbilities = document.getElementById('pokemon_abilities');
const pokemonType = document.getElementById('pokemon_type');

const hpEl = document.getElementById('hp');
const attackEl = document.getElementById('attack');
const defenseEl = document.getElementById('defense');
const spAtkEl = document.getElementById('special-attack');
const spDefEl = document.getElementById('special-defense');
const speedEl = document.getElementById('speed');

const scrollRow = document.querySelector('.selection .scroll-container');

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

async function getPokemon(query) {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${query.toString().toLowerCase()}`);
    const data = response.data;

    imgElement.src = data.sprites.front_default;

    pokemonName.textContent = capitalize(data.name);
    pokemonAbilities.textContent = data.abilities.map(a => a.ability.name).join(', ');
    pokemonType.textContent = data.types.map(t => t.type.name).join(', ');

    const stats = {};
    data.stats.forEach(stat => {
      stats[stat.stat.name] = stat.base_stat;
    });

    hpEl.textContent = stats.hp;
    attackEl.textContent = stats.attack;
    defenseEl.textContent = stats.defense;
    spAtkEl.textContent = stats['special-attack'];
    spDefEl.textContent = stats['special-defense'];
    speedEl.textContent = stats.speed;
  } catch (error) {
    console.error('Pokémon not found:', query, error);
    alert('Failed to fetch Pokémon. Try again.');
  }
}

async function renderRandomPokemonRow(count = 8) {
  scrollRow.innerHTML = ''; 
  const usedIds = new Set();

  while (usedIds.size < count) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    if (usedIds.has(randomId)) continue;
    usedIds.add(randomId);

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const pokemon = response.data;

      const img = document.createElement('img');
      img.src = pokemon.sprites.front_default;
      img.alt = pokemon.name;
      img.className = "border-secondary border-radius border border-3 border-radius-1 rounded-circle whiteBG";
      img.style.cursor = 'pointer';

      img.addEventListener('click', () => getPokemon(pokemon.name));

      scrollRow.appendChild(img);
    } catch (error) {
      console.warn('Skipping failed Pokémon ID:', randomId);
    }
  }
}

nameInput.addEventListener('change', () => {
  if (nameInput.value.trim()) getPokemon(nameInput.value.trim());
});
idInput.addEventListener('change', () => {
  if (idInput.value) getPokemon(idInput.value);
});

getPokemon('vaporeon');
renderRandomPokemonRow();
