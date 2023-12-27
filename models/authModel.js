import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.resolve('./data/users.json');
const charactersFilePath = path.resolve('./data/characters.json');

async function registerUser(username, password) {
  try {
    const users = await getUsers();
    const userExists = users.find((user) => user.username === username);

    if (userExists) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = { username, password, characters: [] };
    users.push(newUser);

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    console.error('Error registering user:', error.message);
    return { success: false, message: 'Error registering user' };
  }
}

async function loginUser(username, password) {
  try {
    const users = await getUsers();
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }

    return { success: true, message: 'Login successful', user };
  } catch (error) {
    console.error('Error logging in user:', error.message);
    return { success: false, message: 'Error logging in user' };
  }
}

async function getUsers() {
  const data = await fs.readFile(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

export { registerUser, loginUser };
