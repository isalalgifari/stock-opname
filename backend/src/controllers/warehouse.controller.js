import { db } from '../db/index.js';
import { warehouses } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getWarehouses = async (req, res) => {
  res.json(await db.select().from(warehouses));
};

export const createWarehouse = async (req, res) => {
  try{
    const { nama, kode, lokasi } = req.body;
    await db.insert(warehouses).values({ nama, kode, lokasi });
    res.status(201).json({ message: 'Gudang ditambahkan' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

export const updateWarehouse = async (req, res) => {
  try{
    const { id } = req.params;
    await db
      .update(warehouses)
      .set(req.body)
      .where(eq(warehouses.id, Number(id)));
    res.json({ message: 'Gudang diupdate' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

export const deleteWarehouse = async (req, res) => {
  try{
    const { id } = req.params;
    await db
      .delete(warehouses)
      .where(eq(warehouses.id, Number(id)));
    res.json({ message: 'Gudang dihapus' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};
