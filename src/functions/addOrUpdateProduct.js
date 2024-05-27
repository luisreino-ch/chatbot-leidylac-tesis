// Función para agregar o actualizar un producto en el pedido
function addOrUpdateProduct(order, product, quantity) {
  // Buscar si el producto ya está en el pedido
  let existingProduct = order.find(item => item.product === product);
  
  if (existingProduct) {
    // Si el producto ya está en el pedido, actualizar la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no está en el pedido, agregar un nuevo objeto
    order.push({ product: product, quantity: quantity });
  }

  console.log(order);

  return order;
}


export { addOrUpdateProduct };