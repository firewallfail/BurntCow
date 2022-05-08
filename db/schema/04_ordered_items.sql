DROP TABLE IF EXISTS ordered_items CASCADE;
CREATE TABLE ordered_items (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INT
);
