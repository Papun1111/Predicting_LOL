// Import the raw JSON data from your ML folder
import champInfo from './champion_info.json';

/**
 * Transforms the Riot JSON structure into a flat array 
 * sorted alphabetically for the Champion Picker UI.
 */
export const getChampions = () => {
  const data = champInfo.data;
  const champions = Object.values(data).map((champ) => {
    return {
      id: parseInt(champ.id),
      name: champ.name,
      key: champ.key,
      // Using Riot's official Data Dragon CDN for champion icons
      icon: `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${champ.key}.png`,
      splash: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.key}_0.jpg`
    };
  });

  return champions.sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Helper to find a specific champion's details by their ID
 */
export const getChampById = (id) => {
  const allChamps = getChampions();
  return allChamps.find(c => c.id === parseInt(id));
};