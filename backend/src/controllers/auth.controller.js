import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signJwt } from '../utils/jwt.js';

export async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    const token = signJwt(user.id);
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to signup' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signJwt(user.id);
    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to login' });
  }
}


