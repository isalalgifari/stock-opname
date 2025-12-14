import { db } from '../db/index.js';
import { stocks, stockMovements } from '../db/schema.js';
import { eq, and  } from 'drizzle-orm';

export const inbound = async (req, res) => {
  const { productId, warehouseId, qty, note } = req.body;

  if (!productId || !warehouseId || qty <= 0) {
    return res.status(400).json({ message: 'Invalid inbound data' });
  }

  await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(stocks)
      .where(
        and(
          eq(stocks.productId, Number(productId)),
          eq(stocks.warehouseId, Number(warehouseId))
        )
      );

    if (existing.length === 0) {
      await tx.insert(stocks).values({
        productId,
        warehouseId,
        qty,
      });
    } else {
      await tx
        .update(stocks)
        .set({ qty: existing[0].qty + qty })
        .where(eq(stocks.id, existing[0].id));
    }

    await tx.insert(stockMovements).values({
      productId,
      type: 'IN',
      qty,
      toWarehouseId: warehouseId,
      note,
    });
  });

  res.json({ message: 'Inbound berhasil' });
};


export const outbound = async (req, res) => {
  try{
    const { productId, warehouseId, qty, note } = req.body;

  if (!productId || !warehouseId || qty <= 0) {
    return res.status(400).json({ message: 'Invalid outbound data' });
  }

  await db.transaction(async (tx) => {
    const stock = await tx
      .select()
      .from(stocks)
      .where(
        eq(stocks.productId, productId),
        eq(stocks.warehouseId, warehouseId)
      );

    if (stock.length === 0 || stock[0].qty < qty) {
      throw new Error('Stok tidak cukup');
    }

    await tx
      .update(stocks)
      .set({ qty: stock[0].qty - qty })
      .where(eq(stocks.id, stock[0].id));

    await tx.insert(stockMovements).values({
      productId,
      type: 'OUT',
      qty,
      fromWarehouseId: warehouseId,
      note,
    });
  });

  res.json({ message: 'Outbound berhasil' });
  }catch (error) {
    return res.status(400).json({
      message: error.message || 'Outbound gagal',
    });
  }
  
};


export const transfer = async (req, res) => {
  try {
    let {
      productId,
      fromWarehouseId,
      toWarehouseId,
      qty,
      note,
    } = req.body;

    productId = Number(productId);
    fromWarehouseId = Number(fromWarehouseId);
    toWarehouseId = Number(toWarehouseId);
    const qtyNum = Number(qty);

    if (
      !productId ||
      !fromWarehouseId ||
      !toWarehouseId ||
      qtyNum <= 0
    ) {
      return res.status(400).json({ message: 'Invalid transfer data' });
    }

    await db.transaction(async (tx) => {
      const fromStock = await tx
        .select()
        .from(stocks)
        .where(
          and(
            eq(stocks.productId, productId),
            eq(stocks.warehouseId, fromWarehouseId)
          )
        );

      if (fromStock.length === 0 || fromStock[0].qty < qtyNum) {
        throw new Error('Stok asal tidak cukup');
      }

      await tx
        .update(stocks)
        .set({ qty: fromStock[0].qty - qtyNum })
        .where(eq(stocks.id, fromStock[0].id));

      const toStock = await tx
        .select()
        .from(stocks)
        .where(
          and(
            eq(stocks.productId, productId),
            eq(stocks.warehouseId, toWarehouseId)
          )
        );

      if (toStock.length === 0) {
        await tx.insert(stocks).values({
          productId,
          warehouseId: toWarehouseId,
          qty: qtyNum,
        });
      } else {
        await tx
          .update(stocks)
          .set({ qty: toStock[0].qty + qtyNum })
          .where(eq(stocks.id, toStock[0].id));
      }

      await tx.insert(stockMovements).values({
        productId,
        type: 'TRANSFER',
        qty: qtyNum,
        fromWarehouseId,
        toWarehouseId,
        note,
      });
    });

    res.json({ message: 'Transfer berhasil' });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Transfer gagal',
    });
  }
};


export const opname = async (req, res) => {
  try {
    let { productId, warehouseId, actualQty, note } = req.body;

    productId = Number(productId);
    warehouseId = Number(warehouseId);
    const actualQtyNum = Number(actualQty);

    if (
      !productId ||
      !warehouseId ||
      actualQtyNum < 0 ||
      Number.isNaN(actualQtyNum)
    ) {
      return res.status(400).json({ message: 'Invalid opname data' });
    }

    await db.transaction(async (tx) => {
      const stock = await tx
        .select()
        .from(stocks)
        .where(
          and(
            eq(stocks.productId, productId),
            eq(stocks.warehouseId, warehouseId)
          )
        );

      const systemQty = stock.length ? stock[0].qty : 0;
      const diff = actualQtyNum - systemQty;

      if (stock.length === 0) {
        await tx.insert(stocks).values({
          productId,
          warehouseId,
          qty: actualQtyNum,
        });
      } else {
        await tx
          .update(stocks)
          .set({ qty: actualQtyNum })
          .where(eq(stocks.id, stock[0].id));
      }

      await tx.insert(stockMovements).values({
        productId,
        type: 'OPNAME',
        qty: diff, 
        toWarehouseId: warehouseId,
        note,
      });
    });

    res.json({ message: 'Stock opname berhasil' });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Opname gagal',
    });
  }
};

