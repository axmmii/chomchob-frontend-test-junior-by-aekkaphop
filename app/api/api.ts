const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    return [];
  }
};

export const fetchPokemonDetails = async (name: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${name}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    return null;
  }
};
