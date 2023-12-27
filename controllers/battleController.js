import { getCharacterById, updateCharacter } from "../models/characterModel.js";
import { getMonsters } from "../models/monsterModel.js";

async function startBattle(req, res) {
  // Implementar início de batalha
}

async function simulateBattle(req, res) {
  try {
    const { characterId, monsters } = req.body;
    const character = await getCharacterById(characterId);

    // Simulação da batalha
    const { defeatedMonsters } = await simulateBattleLogic(characterId, monsters);
    console.log("defeatedmonsters", defeatedMonsters)
    // Cálculo de experiência e loot
    const battleRewards = calculateBattleRewards(defeatedMonsters);
    const { expGained, loot } = battleRewards;

    // Atualização do personagem com exp e loot
    const result = await updateCharacter(character.username, characterId, expGained, loot);

    if (result.success) {
      res.status(200).json({ success: true, message: "Battle simulation successful", result });
    } else {
      res.status(400).json({ success: false, message: "Error updating character", result });
    }
  } catch (error) {
    console.error("Error simulating battle:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function simulateBattleLogic(characterId, monsters) {
  const defeatedMonsters = [];
  try {
    const character = await getCharacterById(characterId);

    // Inicializar mensagens de batalha
    const battleMessages = [];

    // Loop enquanto o jogador e pelo menos um monstro estiverem vivos
    while (character.health > 0 && monsters.some((monster) => monster.quantity > 0)) {
      for (let i = 0; i < monsters.length; i++) {
        const { name, quantity } = monsters[i];
      
        // Inicializar monstro e sua vida
        const monsterData = await getMonsters(name);
        const monsterInstance = { name, quantity, health: quantity * monsterData.health };
      
        console.log(`DEBUG: Monster ${name} Instance`, monsterInstance);
      
        // Lógica básica de batalha
        const damageDealt = 5 * quantity;
        const damageReceived = monsterData.fisic * quantity;
      
        console.log(`DEBUG: Damage Dealt to ${name}(s):`, damageDealt);
        console.log(`DEBUG: Damage Received from ${name}(s):`, damageReceived);
      
        // Atualizar a vida do monstro
        monsterInstance.health -= damageDealt;
      
        console.log(`DEBUG: Updated Health of ${name}(s):`, monsterInstance.health);
      
        // Verificar se o monstro foi derrotado
        if (monsterInstance.health <= 0) {
          battleMessages.push({
            success: true,
            message: `You defeated ${quantity} ${name}(s)`,
          });
          defeatedMonsters.push(monsterInstance);
          console.log(`DEBUG: ${name}(s) Defeated`);
        } else {
          // Reduzir a vida do jogador com base no dano recebido
          character.health -= damageReceived;
      
          console.log(`DEBUG: Updated Player Health:`, character.health);
      
          // Verificar se o jogador foi derrotado
          if (character.health <= 0) {
            battleMessages.push({
              success: false,
              message: `You were defeated in battle against ${quantity} ${name}(s)`,
            });
            await updateCharacter(characterId, character);
            console.log(`DEBUG: Player Defeated`);
            return { battleMessages, defeatedMonsters };
          }
      
          // Atualizar o personagem no arquivo characters.json
          await updateCharacter(characterId, {
            health: character.health,
            // Outras informações que precisam ser atualizadas
          });
      
          // Mensagem da batalha para este monstro
          battleMessages.push({
            success: true,
            message: `You dealt ${damageDealt} damage to ${quantity} ${name}(s). You received ${damageReceived} damage.`,
          });
      
          console.log(`DEBUG: Battle Message`, battleMessages[battleMessages.length - 1]);
        }
      }
    }

    return { battleMessages, defeatedMonsters };
  } catch (error) {
    console.error("Error in battle logic:", error.message);
    return [{ success: false, message: "Error in battle logic" }];
  }
}




function calculateBattleRewards(defeatedMonsters) {
  console.log("itemdrop", defeatedMonsters)
  const battleRewards = {
    expGained: 0,
    loot: [],
  };

  defeatedMonsters.forEach((monster) => {
    battleRewards.expGained += monster.exp;

    monster.items.forEach((itemDrop) => {
      const { id, chance } = itemDrop;
      if (Math.random() * 100 < chance) {
        if (id === 1300) {
          // Item é ouro, gerar quantidade aleatória com base nos valores do monstro
          const { goldMin, goldMax } = monster;
          const goldQuantity = Math.floor(Math.random() * (goldMax - goldMin + 1) + goldMin);
          battleRewards.loot.push({ id, quantity: goldQuantity });
        } else {
          // Outros itens
          battleRewards.loot.push({ id, quantity: 1 });
        }
      }
    });
  });

  return battleRewards;
}


export { startBattle, simulateBattle };
