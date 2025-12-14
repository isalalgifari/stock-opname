import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

/**
 * GET /users
 */
export const getUsers = async (_, res) => {
  const data = await db
    .select({
      id: users.id,
      username: users.username,
      nama: users.nama,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);

  res.json(data);
};

/**
 * POST /users
 */
export const createUser = async (req, res) => {
  try{

    const { username, password, nama, role } = req.body;

    if (!username || !password || !nama || !role) {
      return res.status(400).json({ message: 'Data user tidak lengkap' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      password: hashedPassword,
      nama,
      role,
    });

    res.status(201).json({ message: 'User berhasil ditambahkan' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

/**
 * PUT /users/:id
 */
export const updateUser = async (req, res) => {
  try{
    const { id } = req.params;
    const { username, password, nama, role } = req.body;
  
    const updateData = { username, nama, role };
  
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
  
    await db.update(users).set(updateData).where(eq(users.id, id));
  
    res.json({ message: 'User berhasil diupdate' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

/**
 * DELETE /users/:id
 */
export const deleteUser = async (req, res) => {
  try{
    const { id } = req.params;
    await db.delete(users).where(eq(users.id, id));
    res.json({ message: 'User berhasil dihapus' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};
