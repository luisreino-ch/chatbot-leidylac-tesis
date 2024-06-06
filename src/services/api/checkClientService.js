import 'dotenv/config';

const API_URL = `${process.env.ME_API_URL}/clientes`;

// Función para verificar si el cliente existe por celular
const checkClientService = async (ctx) => {
  try {
    const response = await fetch(`${API_URL}?filters[celular][$eq]=${ctx.from}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API 
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la consulta: ${response.statusText}`);
    }

    const clientData = await response.json();
    const clientExists = clientData.data.length > 0;

    return clientExists;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return false; 
  }
}

export { checkClientService };
