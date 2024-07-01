import 'dotenv/config';

const API_URL = `${process.env.ME_API_URL}/prompts`;

// Función para obtener y unir los contextos
const CombineContexts = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.TOKEN_API
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la consulta: ${response.statusText}`);
    }

    const data = await response.json();

    // Verifica que la estructura de la respuesta sea la esperada
    if (!Array.isArray(data.data)) {
      throw new Error('La respuesta no contiene un array de datos');
    }

    // Unir todos los campos de contexto en un solo texto
    const combinedContexts = data.data.map(prompt  => prompt.attributes.contexto).join('\n');

    return combinedContexts;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return ''; 
  }
}

export { CombineContexts };