import fs from "fs/promises";
import path from "path";

const charactersFilePath = path.resolve("./data/characters.json");
const baseStatsFilePath = path.resolve("./data/baseStats.json");
const inventoriesDirPath = path.resolve("./data/inventories");
const equippedItemsDirPath = path.resolve("./data/equippedItems");

const classesStatsGainLevelUpFilePath = path.resolve("./data/classesStatsGainLevelUp.json");
const configFilePath = path.resolve('./data/config.json');
const inventoryDirPath = path.resolve('./data/inventories');



async function createCharacter(username, character) {
  try {
    const characters = await getCharacters();
    const baseStats = await getBaseStats();

    // Verifica se já existe um personagem com o mesmo nome
    const existingCharacter = characters.find((char) => char.name === character.name);

    if (existingCharacter) {
      return { success: false, message: "Character name already exists" };
    }

    // Gera um ID único para o personagem
    const characterId = generateUniqueId();

    // Atribui o ID ao personagem
    character.id = characterId;

    // Atribui Health e Mana de acordo com a classe
    const classStats = baseStats[character.class];
    character.health = classStats.health;
    character.mana = classStats.mana;

    // Atribui Max Health e Max Mana de acordo com a classe
    character.maxHealth = classStats.health;
    character.maxMana = classStats.mana;

    // Adiciona o personagem à lista de personagens
    characters.push({ username, ...character });

    // Cria os arquivos de inventário e equipamentos para o novo personagem
    await createInventory(characterId);
    await createEquippedItems(characterId);

    // Atualiza o arquivo characters.json
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));

    return { success: true, message: "Character created successfully", character };
  } catch (error) {
    console.error("Error creating character:", error.message);
    return { success: false, message: "Error creating character" };
  }
}

async function updateCharacter(username, characterId, expGained, loot) {
  try {
    const characters = await getCharacters();
    const classesStatsGainLevelUp = await getClassesStatsGainLevelUp();

    // Encontrar o personagem pelo ID
    const characterIndex = characters.findIndex((char) => char.id === characterId);

    // Verificar se o personagem existe
    if (characterIndex === -1) {
      return { success: false, message: 'Character not found' };
    }

    // Atualizar o personagem (exemplo: aumentar o nível)
    characters[characterIndex].level += 1;

    // Adicionar a experiência ganha
    characters[characterIndex].exp += expGained;

    // Atualizar Max Health e Max Mana de acordo com o ganho de atributos ao subir de nível
    const classStatsGain = classesStatsGainLevelUp.find((stats) => stats.class === characters[characterIndex].class);
    characters[characterIndex].maxHealth = characters[characterIndex].maxHealth + classStatsGain.health;
    characters[characterIndex].maxMana = characters[characterIndex].maxMana + classStatsGain.mana;

    // Atualizar o arquivo characters.json
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));

    // Adicionar loot ao inventário
    const result = await addToInventory(characterId, loot);

    return { success: true, message: 'Character updated successfully', lootResult: result };
  } catch (error) {
    console.error('Error updating character:', error.message);
    return { success: false, message: 'Error updating character' };
  }
}

async function addToInventory(characterId, loot) {
  try {
    const inventoryFilePath = path.resolve(`${inventoryDirPath}/${characterId}.json`);
    const inventory = await getInventory(characterId);

    // Verificar espaço no inventário
    const config = await getConfig();
    if (!config) {
      return { success: false, message: 'Error loading configuration' };
    }

    const remainingSpace = config.MAX_INVENTORY_SIZE - inventory.length;
    if (loot.length > remainingSpace) {
      return { success: false, message: 'Inventory full. Some items were discarded.' };
    }

    // Adicionar itens ao inventário
    for (const item of loot) {
      // Se for um item de ouro, adiciona ou incrementa a quantidade no inventário
      if (item.type === 'gold') {
        const existingGold = inventory.find((invItem) => invItem.type === 'gold');
        if (existingGold) {
          existingGold.amount += item.amount;
        } else {
          inventory.push(item);
        }
      } else {
        inventory.push(item);
      }
    }

    // Atualizar o arquivo de inventário
    await fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2));

    return { success: true, message: 'Items added to inventory successfully' };
  } catch (error) {
    console.error('Error adding to inventory:', error.message);
    return { success: false, message: 'Error adding to inventory' };
  }
}

async function getCharacters() {
  const data = await fs.readFile(charactersFilePath, "utf-8");
  return JSON.parse(data);
}

async function getBaseStats() {
  const data = await fs.readFile(baseStatsFilePath, "utf-8");
  return JSON.parse(data);
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

async function getClassesStatsGainLevelUp() {
  const data = await fs.readFile(classesStatsGainLevelUpFilePath, "utf-8");
  return JSON.parse(data);
}

// Funções relacionadas ao inventário

async function createInventory(characterId) {
  const inventoryFilePath = path.resolve(inventoriesDirPath, `${characterId}.json`);
  await fs.writeFile(inventoryFilePath, "[]"); // Inicializa o inventário como um array vazio
}

async function getInventory(characterId) {
  const inventoryFilePath = path.resolve(inventoriesDirPath, `${characterId}.json`);
  const data = await fs.readFile(inventoryFilePath, "utf-8");
  return JSON.parse(data);
}

async function updateInventory(characterId, inventory) {
  const inventoryFilePath = path.resolve(inventoriesDirPath, `${characterId}.json`);
  await fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2));
}

// Funções relacionadas aos itens equipados

async function createEquippedItems(characterId) {
  const equippedItemsFilePath = path.resolve(equippedItemsDirPath, `${characterId}.json`);
  await fs.writeFile(equippedItemsFilePath, "[]"); // Inicializa os itens equipados como um array vazio
}

async function getEquippedItems(characterId) {
  const equippedItemsFilePath = path.resolve(equippedItemsDirPath, `${characterId}.json`);
  const data = await fs.readFile(equippedItemsFilePath, "utf-8");
  return JSON.parse(data);
}

async function updateEquippedItems(characterId, equippedItems) {
  const equippedItemsFilePath = path.resolve(equippedItemsDirPath, `${characterId}.json`);
  await fs.writeFile(equippedItemsFilePath, JSON.stringify(equippedItems, null, 2));
}

async function getCharacterById(characterId) {
  try {
    const characters = await getCharacters();
    const character = characters.find((char) => char.id === characterId);

    if (!character) {
      throw new Error('Character not found');
    }

    return character;
  } catch (error) {
    console.error('Error getting character by ID:', error.message);
    throw error;
  }
}

async function getConfig() {
  try {
    const data = await fs.readFile(configFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading config:', error.message);
    return null;
  }
}

export { createCharacter, updateCharacter, updateInventory, updateEquippedItems, getEquippedItems,
createInventory, getInventory, createEquippedItems, getCharacterById, getConfig };
