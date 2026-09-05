const CART_KEY = "cart-items";

function getItems() {
  const items = localStorage.getItem(CART_KEY);
  if (!items) {
    return [];
  }
  return JSON.parse(items);
}

function saveItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("cart-updated"));
}

export function addItem(product) {
  const items = getItems();
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    items.push({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: Number(product.price),
      quantity: 1,
    });
  }
  saveItems(items);
}

export function removeItem(productId) {
  const items = getItems().filter(
    (item) => String(item.id) !== String(productId),
  );
  saveItems(items);
}

export function updateQuantity(productId, quantity) {
  const items = getItems();
  const item = items.find(
    (product) => String(product.id) === String(productId),
  );
  if (!item) {
    console.log("Item not found", productId);
    return;
  }
  item.quantity = quantity;
  if (quantity <= 0) {
    removeItem(productId);
    return;
  }
  saveItems(items);
}

export function getCartCount() {
  return getItems().reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
  return getItems().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  document.dispatchEvent(new CustomEvent("cart-updated"));
}

export function getItemQuantity(productId) {
  const item = getItems().find(
    (product) => String(product.id) === String(productId),
  );
  return item ? item.quantity : 0;
}

export { getItems };
