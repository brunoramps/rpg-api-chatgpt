import { createInventory, getInventory } from '../models/inventoryModel.js';

async function createInventoryController(req, res) {
  try {
    //const { username } = req.user; // Assumindo que o username do personagem está na requisição    
    const { characterId, items } = req.body;    

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid items format' });
    }

    const inventory = {
      items,
      // Adicione outros atributos conforme necessário
    };

    const result = await createInventory(characterId, inventory);

    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error creating inventory:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function getInventoryController(req, res) {
  try {
    //const { username } = req.user; // Assumindo que o username do personagem está na requisição    
    const { characterId } = req.body

    const inventory = await getInventory(characterId);

    if (inventory) {
      res.status(200).json({ success: true, inventory });
    } else {
      res.status(404).json({ success: false, message: 'Inventory not found' });
    }
  } catch (error) {
    console.error('Error getting inventory:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export { createInventoryController, getInventoryController };
