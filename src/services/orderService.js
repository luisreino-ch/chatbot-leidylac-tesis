import 'dotenv/config'


const API_URL = `${process.env.ME_API_URL}/pedidos`;



// Consulta para obtener el cliente por celular
const sendOrderData = async (state) => {
  const response = await fetch(`${process.env.ME_API_URL}/clientes?filters[celular][$eq]=${state.get('celular')}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.TOKEN_API// Añade tu token de autenticación si es necesario
    }
  });

  if (!response.ok) {
    throw new Error(`Error en la consulta: ${response.statusText}`);
  }

  const clienteData = await response.json();
  const cliente = clienteData.data[0];


  const idCliente = cliente.id;
  const nombreCliente = cliente.attributes.nombre;
  const ciudadCliente = cliente.attributes.ciudad;
  const celularCliente = cliente.attributes.celular;
  const detallesPedido = state.get('detailsOrder');
  //const detallesPedido = pedido.map(item => `Producto: ${item.producto}, Unidades: ${item.cantidad}`).join('; ');
  
  const pedidoData = {
    data: {
      nombre: nombreCliente,
      celular: celularCliente,
      ciudad: ciudadCliente,
      detalles: detallesPedido,
      fecha: new Date().toISOString(), // Fecha actual en formato ISO
      cliente: idCliente
    }
  };

  
  try {
    const pedidoResponse = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API // token de autenticación 
      },
      body: JSON.stringify(pedidoData)
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