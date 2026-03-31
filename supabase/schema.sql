-- Kategoriler
CREATE TABLE categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ürünler
CREATE TABLE products (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  sku               text NOT NULL UNIQUE,
  category_id       uuid REFERENCES categories(id) ON DELETE SET NULL,
  unit              text NOT NULL,
  min_stock_level   numeric(10,2) NOT NULL DEFAULT 0,
  price             numeric(12,2) NOT NULL DEFAULT 0,
  current_stock     numeric(10,2) NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Stok Hareketleri
CREATE TABLE stock_movements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('in', 'out')),
  quantity   numeric(10,2) NOT NULL CHECK (quantity > 0),
  note       text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: her harekette current_stock güncelle
CREATE OR REPLACE FUNCTION update_current_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'in' THEN
    UPDATE products
    SET current_stock = current_stock + NEW.quantity,
        updated_at    = now()
    WHERE id = NEW.product_id;
  ELSE
    UPDATE products
    SET current_stock = current_stock - NEW.quantity,
        updated_at    = now()
    WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stock_movement
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION update_current_stock();

-- View: düşük stok ürünleri
CREATE VIEW low_stock_products AS
SELECT
  p.id,
  p.name,
  p.sku,
  p.unit,
  p.current_stock,
  p.min_stock_level,
  p.price,
  p.category_id,
  p.created_at,
  p.updated_at,
  c.name AS category_name,
  (p.min_stock_level - p.current_stock) AS shortage
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
WHERE p.current_stock < p.min_stock_level;

-- İndeksler
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_movements_product  ON stock_movements(product_id);
CREATE INDEX idx_movements_created  ON stock_movements(created_at DESC);

-- Örnek kategoriler
INSERT INTO categories (name) VALUES
  ('Elektronik'),
  ('Gıda'),
  ('Kırtasiye'),
  ('Temizlik');
