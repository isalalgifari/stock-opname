import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

/* ================= PRODUCTS ================= */
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  harga: integer('harga').notNull(),
});

/* ================= WAREHOUSES ================= */
export const warehouses = pgTable('warehouses', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  kode: varchar('kode', { length: 50 }).notNull().unique(),
  lokasi: varchar('lokasi', { length: 255 }),
});

/* ================= STOCK ================= */
export const stocks = pgTable('stocks', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  warehouseId: integer('warehouse_id')
    .notNull()
    .references(() => warehouses.id),
  qty: integer('qty').notNull().default(0),
});

/* ================= STOCK MOVEMENTS ================= */
export const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // IN | OUT | TRANSFER | OPNAME
  qty: integer('qty').notNull(),
  fromWarehouseId: integer('from_warehouse_id'),
  toWarehouseId: integer('to_warehouse_id'),
  note: varchar('note', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

/* ================= USERS ================= */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nama: varchar('nama', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
