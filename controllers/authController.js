import { loginUser, registerUser } from '../models/authModel.js';

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const result = await registerUser(username, password);

    if (result.success) {
      res.status(201).json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const result = await loginUser(username, password);

    if (result.success) {      
      res.status(200).json({ success: true, message: result.message, user: result.user });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export { login, register };
