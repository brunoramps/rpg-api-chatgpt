// characterController.js

import {
  createCharacter,
  updateCharacter,
  updateInventory,
  updateEquippedItems,
  getEquippedItems,
  createInventory,
  getInventory,
  createEquippedItems
} from '../models/characterModel.js';

async function createCharacterController(req, res) {
  try {
    const username = "brunao"; // Assumindo que o username do usuário está na requisição
    const { name, gender, class: characterClass } = req.body;

    if (!name || !characterClass) {
      return res.status(400).json({ success: false, message: 'Name and class are required' });
    }

    const character = {
      name,
      gender,
      class: characterClass,
      level: 1,
      exp: 0
    };

    const result = await createCharacter(username, character);

    // Cria o inventário e os itens equipados quando o personagem é criado
    if (result.success) {      
      await createInventory(result.character.id);
      await createEquippedItems(result.character.id);
    }

    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error creating character:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function levelUp(req, res) {
  try {
    const username = "brunao"; // Assumindo que o username do usuário está na requisição
    const { characterId } = req.params;

    const result = await updateCharacter(username, characterId);

    if (result.success) {
      res.status(200).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error leveling up character:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// Adicionando as funções de equipar e desequipar itens
async function equipItem(req, res) {
  try {
    const username = "brunao"; // Assumindo que o username do usuário está na requisição
    const { characterId } = req.params;
    const { itemId } = req.body;

    // Lógica para equipar o item
    const equippedItems = await getEquippedItems(characterId);
    const inventory = await getInventory(characterId);

    // Verifica se o item está no inventário
    const inventoryIndex = inventory.findIndex((item) => item.id === itemId);

    if (inventoryIndex === -1) {
      return res.status(400).json({ success: false, message: 'Item not found in inventory' });
    }

    // Adiciona o item equipado aos itens equipados
    equippedItems.push(inventory[inventoryIndex]);

    // Remove o item do inventário
    inventory.splice(inventoryIndex, 1);

    // Atualiza os itens equipados e o inventário
    await updateEquippedItems(characterId, equippedItems);
    await updateInventory(characterId, inventory);

    res.status(200).json({ success: true, message: 'Item equipped successfully' });
  } catch (error) {
    console.error('Error equipping item:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function unequipItem(req, res) {
  try {
    const username = "brunao"; // Assumindo que o username do usuário está na requisição
    const { characterId } = req.params;
    const { itemId } = req.body;

    // Lógica para desequipar o item
    const equippedItems = await getEquippedItems(characterId);
    const inventory = await getInventory(characterId);

    // Verifica se o item está nos itens equipados
    const equippedIndex = equippedItems.findIndex((item) => item.id === itemId);

    if (equippedIndex === -1) {
      return res.status(400).json({ success: false, message: 'Item not found in equipped items' });
    }

    // Adiciona o item desequipado ao inventário
    inventory.push(equippedItems[equippedIndex]);

    // Remove o item dos itens equipados
    equippedItems.splice(equippedIndex, 1);

    // Atualiza os itens equipados e o inventário
    await updateEquippedItems(characterId, equippedItems);
    await updateInventory(characterId, inventory);

    res.status(200).json({ success: true, message: 'Item unequipped successfully' });
  } catch (error) {
    console.error('Error unequipping item:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export { createCharacterController, levelUp, equipItem, unequipItem };
