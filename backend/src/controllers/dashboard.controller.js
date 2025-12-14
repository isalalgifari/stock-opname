import { db } from '../db/index.js'; 
import { stocks, products, warehouses, stockMovements } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// 1️⃣ Stock per warehouse + total global
export const getStockSummary = async (req, res) => {
  try {
    const stockData = await db
      .select({
        warehouseId: stocks.warehouseId,
        warehouseName: warehouses.nama,
        productId: stocks.productId,
        productName: products.nama,
        qty: stocks.qty,
        price: products.harga
      })
      .from(stocks)
      .leftJoin(products, eq(stocks.productId, products.id))
      .leftJoin(warehouses, eq(stocks.warehouseId, warehouses.id));

    // Total global per product
    const globalTotals = {};
    stockData.forEach(item => {
      globalTotals[item.productId] = (globalTotals[item.productId] || 0) + item.qty;
    });

    res.json({ stockData, globalTotals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Valuation total
export const getValuation = async (req, res) => {
  try {
    // Ambil semua stock + harga
    const stockData = await db
      .select({
        qty: stocks.qty,
        price: products.harga
      })
      .from(stocks)
      .leftJoin(products, eq(stocks.productId, products.id));

    // Hitung total di JS
    const totalRupiah = stockData.reduce((acc, item) => acc + item.qty * item.price, 0);

    res.json({ totalRupiah });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Stock movements history
export const getMovements = async (req, res) => {
  try {
    // Ambil semua movements
    const movements = await db
      .select({
        id: stockMovements.id,
        type: stockMovements.type,
        qty: stockMovements.qty,
        productId: stockMovements.productId,
        fromWarehouseId: stockMovements.fromWarehouseId,
        toWarehouseId: stockMovements.toWarehouseId,
        note: stockMovements.note,
        timestamp: stockMovements.createdAt
      })
      .from(stockMovements);

    // Ambil semua products dan warehouses
    const productsData = await db.select().from(products);
    const warehousesData = await db.select().from(warehouses);

    // Gabungkan nama product + warehouse di JS
    const result = movements.map(m => {
      const product = productsData.find(p => p.id === m.productId);
      const fromWh = warehousesData.find(w => w.id === m.fromWarehouseId);
      const toWh = warehousesData.find(w => w.id === m.toWarehouseId);
      return {
        id: m.id,
        type: m.type,
        qty: m.qty,
        productName: product?.nama || '-',
        fromWarehouse: fromWh?.nama || '-',
        toWarehouse: toWh?.nama || '-',
        note: m.note,
        timestamp: m.timestamp
      };
    });

    res.json({ movements: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
