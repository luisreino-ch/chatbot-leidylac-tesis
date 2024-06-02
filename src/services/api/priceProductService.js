import 'dotenv/config'


const API_URL = `${process.env.ME_API_URL}`;

// Consulta para obtener el cliente por celular
const sendPrice = async (selectedProductName) => {
  const response = await fetch(`${API_URL}/productos?filters[nombre][$eq]=${selectedProductName}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.TOKEN_API
    }
  });

  if (!response.ok) {
    throw new Error(`Error en la consulta: ${response.statusText}`);
  }

  const productData = await response.json();
  const product = productData.data[0];

  if (!product) {
    console.log('No se encontró el producto. Por favor, verifica tu información.');
  }

  const priceProduct = product.attributes.precio;

  return priceProduct;

}

export { sendPrice };