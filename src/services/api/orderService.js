import 'dotenv/config'


const API_URL = `${process.env.ME_API_URL}/pedidos`;



// Consulta para obtener el cliente por celular
const sendOrderData = async (state) => {
  const response = await fetch(`${process.env.ME_API_URL}/clientes?filters[celular][$eq]=${state.get('phone')}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.TOKEN_API// Añade tu token de autenticación si es necesario
    }
  });

  if (!response.ok) {
    throw new Error(`Error en la consulta: ${response.statusText}`);
  }

  const clientData = await response.json();
  const client = clientData.data[0];


  const idClient = client.id;
  const nameClient = client.attributes.nombre;
  const cityClient = client.attributes.ciudad;
  const phoneClient = client.attributes.celular;
  const detailsOrder = state.get('detailsOrder');
  //const detallesPedido = pedido.map(item => `Producto: ${item.producto}, Unidades: ${item.cantidad}`).join('; ');
  
  const orderData = {
    data: {
      nombre: nameClient,
      celular: phoneClient,
      ciudad: cityClient,
      detalles: detailsOrder,
      fecha: new Date().toISOString(), // Fecha actual en formato ISO
      cliente: idClient
    }
  };

  
  try {
    const pedidoResponse = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API // token de autenticación 
      },
      body: JSON.stringify(orderData)
    });
  
    if(pedidoResponse.ok){
      const data = await pedidoResponse.json();
      console.log('Pedido creado:', data);
    }else{
      const errorData = await pedidoResponse.json();
      console.error('Error al crear el pedido:', pedidoResponse.statusText, errorData);
    }
    
  }catch (error) {
    console.error('Error en la solicitud:', error);
  }

}

export {sendOrderData}