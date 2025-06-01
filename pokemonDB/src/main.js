import axios from 'axios';

const nameInput = document.getElementById('name');
const idInput = document.getElementById('numbah');
const imgElement = document.getElementById('Image');
const pokemonName = document.getElementById('pokemon_name');
const pokemonAbilities = document.getElementById('pokemon_abilities');
const pokemonType = document.getElementById('pokemon_type');
const typeImages = document.querySelectorAll('.scroll-container-types-imgs img');


const hpEl = document.getElementById('hp');
const attackEl = document.getElementById('attack');
const defenseEl = document.getElementById('defense');
const spAtkEl = document.getElementById('special-attack');
const spDefEl = document.getElementById('special-defense');
const speedEl = document.getElementById('speed');

const scrollRow = document.querySelector('.selection .scroll-container');

let allPokemonNames = [];

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
    data.stats.forEach(stat => stats[stat.stat.name] = stat.base_stat);

    hpEl.textContent = stats.hp;
    attackEl.textContent = stats.attack;
    defenseEl.textContent = stats.defense;
    spAtkEl.textContent = stats['special-attack'];
    spDefEl.textContent = stats['special-defense'];
    speedEl.textContent = stats.speed;
  } catch (err) {
    alert('Pokémon not found!');
  }
}

async function renderRandomPokemonRow(count = 8) {
  scrollRow.innerHTML = '';
  const usedIds = new Set();

  while (usedIds.size < count) {
    const id = Math.floor(Math.random() * 898) + 1;
    if (usedIds.has(id)) continue;
    usedIds.add(id);

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const pokemon = res.data;

      const img = document.createElement('img');
      img.src = pokemon.sprites.front_default;
      img.alt = pokemon.name;
      img.className = "border-secondary border-radius border border-3 border-radius-1 rounded-circle whiteBG";
      img.style.cursor = 'pointer';
      img.classList.add("pokemon-scroll-img");

      img.addEventListener('click', () => getPokemon(pokemon.name));
      scrollRow.appendChild(img);
    } catch {
    }
  }
}

async function fetchAllPokemonNames() {
  try {
    const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
    allPokemonNames = res.data.results.map(p => p.name);
  } catch (err) {
    console.error('Failed to fetch all names:', err);
  }
}


typeImages.forEach(img => {
  img.addEventListener('click', () => {
    const type = img.alt.toLowerCase();

    typeImages.forEach(i => i.classList.remove('selected-type'));
    img.classList.add('selected-type');

    renderPokemonByType(type);
  });
});

async function renderPokemonByType(type, count = 8) {
  scrollRow.innerHTML = '';
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
    const allOfType = res.data.pokemon.map(p => p.pokemon.name);
    const shuffled = allOfType.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const name of shuffled) {
      try {
        const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemon = pokeRes.data;

        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        img.className = "border-secondary border-radius border border-3 border-radius-1 rounded-circle whiteBG";
        img.style.cursor = 'pointer';
        img.classList.add("pokemon-scroll-img");

        img.addEventListener('click', () => getPokemon(pokemon.name));
        scrollRow.appendChild(img);
      } catch (err) {
        console.error(`Error loading Pokémon ${name}`, err);
      }
    }
  } catch (err) {
    console.error(`Could not fetch Pokémon of type ${type}`, err);
  }
}


function updateSuggestions(query) {
  const listId = 'name-suggestions';
  let dataList = document.getElementById(listId);

  if (!dataList) {
    dataList = document.createElement('datalist');
    dataList.id = listId;
    document.body.appendChild(dataList);
    nameInput.setAttribute('list', listId);
  }

  const filtered = allPokemonNames.filter(name => name.startsWith(query.toLowerCase())).slice(0, 10);
  dataList.innerHTML = filtered.map(name => `<option value="${name}">`).join('');
}

nameInput.addEventListener('input', () => {
  updateSuggestions(nameInput.value);
});

nameInput.addEventListener('change', () => {
  if (nameInput.value.trim()) {
    getPokemon(nameInput.value.trim());
  }
});

idInput.addEventListener('change', () => {
  const val = parseInt(idInput.value);
  if (!isNaN(val) && val > 0) {
    getPokemon(val);
  }
});

getPokemon('vaporeon');
renderRandomPokemonRow();
fetchAllPokemonNames();
