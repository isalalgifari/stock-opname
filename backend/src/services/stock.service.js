import { db } from '../db/index.js';
import { stocks, stockMovements } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

/* =====================================================
   HELPER: ambil stok per produk & gudang
===================================================== */
export async function getStock(productId, warehouseId, tx = db) {
  const data = await tx
    .select()
    .from(stocks)
    .where(
      and(
        eq(stocks.productId, productId),
        eq(stocks.warehouseId, warehouseId)
      )
    );

  return data[0];
}

/* =====================================================
   INBOUND
===================================================== */
export async function inboundStock(
  { productId, warehouseId, qty },
  tx = db
) {
  if (qty <= 0) throw new Error('Qty harus lebih dari 0');

  const stock = await getStock(productId, warehouseId, tx);

  if (!stock) {
    await tx.insert(stocks).values({
      productId,
      warehouseId,
      qty,
    });
  } else {
    await tx
      .update(stocks)
      .set({ qty: stock.qty + qty })
      .where(eq(stocks.id, stock.id));
  }

  await tx.insert(stockMovements).values({
    productId,
    type: 'IN',
    qty,
    toWarehouseId: warehouseId,
  });
}

/* =====================================================
   OUTBOUND
===================================================== */
export async function outboundStock(
  { productId, warehouseId, qty },
  tx = db
) {
  if (qty <= 0) throw new Error('Qty harus lebih dari 0');

  const stock = await getStock(productId, warehouseId, tx);

  if (!stock || stock.qty < qty)
    throw new Error('Stok tidak mencukupi');

  await tx
    .update(stocks)
    .set({ qty: stock.qty - qty })
    .where(eq(stocks.id, stock.id));

  await tx.insert(stockMovements).values({
    productId,
    type: 'OUT',
    qty,
    fromWarehouseId: warehouseId,
  });
}

/* =====================================================
   TRANSFER STOCK (ATOMIC)
===================================================== */
export async function transferStock(
  { productId, fromWarehouseId, toWarehouseId, qty },
  tx = db
) {
  if (qty <= 0) throw new Error('Qty harus lebih dari 0');
  if (fromWarehouseId === toWarehouseId)
    throw new Error('Gudang asal & tujuan tidak boleh sama');

  // Kurangi stok gudang asal
  const fromStock = await getStock(
    productId,
    fromWarehouseId,
    tx
  );

  if (!fromStock || fromStock.qty < qty)
    throw new Error('Stok gudang asal tidak cukup');

  await tx
    .update(stocks)
    .set({ qty: fromStock.qty - qty })
    .where(eq(stocks.id, fromStock.id));

  // Tambah stok gudang tujuan
  const toStock = await getStock(productId, toWarehouseId, tx);

  if (!toStock) {
    await tx.insert(stocks).values({
      productId,
      warehouseId: toWarehouseId,
      qty,
    });
  } else {
    await tx
      .update(stocks)
      .set({ qty: toStock.qty + qty })
      .where(eq(stocks.id, toStock.id));
  }

  // Log movement
  await tx.insert(stockMovements).values({
    productId,
    type: 'TRANSFER',
    qty,
    fromWarehouseId,
    toWarehouseId,
  });
}

/* =====================================================
   STOCK OPNAME
===================================================== */
export async function stockOpname(
  { productId, warehouseId, fisikQty },
  tx = db
) {
  if (fisikQty < 0)
    throw new Error('Qty fisik tidak boleh negatif');

  const stock = await getStock(productId, warehouseId, tx);
  const sistemQty = stock ? stock.qty : 0;
  const selisih = fisikQty - sistemQty;

  if (!stock) {
    await tx.insert(stocks).values({
      productId,
      warehouseId,
      qty: fisikQty,
    });
  } else {
    await tx
      .update(stocks)
      .set({ qty: fisikQty })
      .where(eq(stocks.id, stock.id));
  }

  await tx.insert(stockMovements).values({
    productId,
    type: 'OPNAME',
    qty: selisih,
    toWarehouseId: warehouseId,
    note: 'Stock Opname',
  });
}
