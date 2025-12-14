CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    harga INTEGER NOT NULL
);


CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    kode VARCHAR(50) NOT NULL UNIQUE,
    lokasi VARCHAR(255)
);


CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    warehouse_id INTEGER NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_stock_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_product_warehouse
        UNIQUE (product_id, warehouse_id),

    CONSTRAINT check_qty_non_negative
        CHECK (qty >= 0)
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    qty INTEGER NOT NULL,

    from_warehouse_id INTEGER,
    to_warehouse_id INTEGER,

    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movement_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT fk_movement_from_warehouse
        FOREIGN KEY (from_warehouse_id)
        REFERENCES warehouses(id),

    CONSTRAINT fk_movement_to_warehouse
        FOREIGN KEY (to_warehouse_id)
        REFERENCES warehouses(id),

    CONSTRAINT check_movement_type
        CHECK (type IN ('IN', 'OUT', 'TRANSFER', 'OPNAME'))
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
