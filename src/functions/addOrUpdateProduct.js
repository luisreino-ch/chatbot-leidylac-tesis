// Función para agregar o actualizar un producto en el pedido
function addOrUpdateProduct(order, product, quantity, price) {
  // Buscar si el producto ya está en el pedido
  let existingProduct = order.find(item => item.product === product);
  
  if (existingProduct) {
    // Si el producto ya está en el pedido, actualizar la cantidad y el precio
    existingProduct.quantity += quantity;
    existingProduct.price = price; // Actualizar el precio en caso de que haya cambiado
  } else {
    // Si el producto no está en el pedido, agregar un nuevo objeto
    order.push({ product: product, quantity: quantity, price: price });
  }

  console.log(order);

  return order;
}


export { addOrUpdateProduct };