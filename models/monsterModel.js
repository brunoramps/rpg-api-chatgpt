import fs from 'fs/promises';
import path from 'path';

const monstersDirPath = path.resolve('./monsters');

async function getMonsters(monsterName) {
  try {
    const monsterFilePath = path.resolve(monstersDirPath, `${monsterName}.json`);
    const data = await fs.readFile(monsterFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error getting monster "${monsterName}":`, error.message);
    return null;
  }
}

export { getMonsters };
