import 'dotenv/config';


const API_URL = `${process.env.ME_API_URL}/clientes`;

// Lógica de guardar el registro en la base de datos
const sendCustomerData = async (state) => {
  const customerData = {
    data: {
      nombre: state.get('fullName'),
      celular: state.get('phone'),
      ciudad: state.get('city'),
      negocio: state.get('business'),
      fecha:  new Date().toISOString(), // Fecha actual en formato ISO
      cedula: state.get('identityCard')
    }
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API 
      },
      body: JSON.stringify(customerData)
    });


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear el pedido: ${response.statusText}, ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    console.log('Pedido creado:', data);
  
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
};

export {sendCustomerData};
