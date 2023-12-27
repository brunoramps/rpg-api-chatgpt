import fs from 'fs/promises';
import path from 'path';

const inventoriesDirPath = path.resolve('./data/inventories');

async function createInventory(characterId, inventory) {
  try {
    const inventoryFilePath = path.resolve(inventoriesDirPath, `${characterId}.json`);

    // Verifica se já existe um inventário para o personagem
    const inventoryExists = await fs.access(inventoryFilePath).then(() => true).catch(() => false);

    if (inventoryExists) {
      return { success: false, message: 'Inventory already exists for this character' };
    }

    // Cria o arquivo de inventário para o personagem
    await fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2));

    return { success: true, message: 'Inventory created successfully' };
  } catch (error) {
    console.error('Error creating inventory:', error.message);
    return { success: false, message: 'Error creating inventory' };
  }
}

async function getInventory(characterId) {
  try {
    const inventoryFilePath = path.resolve(inventoriesDirPath, `${characterId}.json`);

    // Verifica se o inventário existe para o personagem
    await fs.access(inventoryFilePath);

    // Recupera o conteúdo do arquivo de inventário
    const data = await fs.readFile(inventoryFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting inventory:', error.message);
    return null; // Retorna null se o inventário não existir
  }
}

export { createInventory, getInventory };
