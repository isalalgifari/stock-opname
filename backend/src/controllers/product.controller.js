import { db } from '../db/index.js';
import { products } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getProducts = async (_, res) => {
  const data = await db.select().from(products);
  res.json(data);
};

export const createProduct = async (req, res) => {
  try{
    const { nama, sku, harga } = req.body;
    await db.insert(products).values({ nama, sku, harga });
    res.status(201).json({ message: 'Produk berhasil ditambahkan' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

export const updateProduct = async (req, res) => {
  try{
    const { id } = req.params;
    const { nama, sku, harga } = req.body;
    await db
      .update(products)
      .set({ nama, sku, harga })
      .where(eq(products.id, id));
    res.json({ message: 'Produk berhasil diupdate' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

export const deleteProduct = async (req, res) => {
  try{
    const { id } = req.params;
    await db.delete(products).where(eq(products.id, id));
    res.json({ message: 'Produk berhasil dihapus' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};
