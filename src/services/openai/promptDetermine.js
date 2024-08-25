
const PROMPT_DETERMINE = `
Analiza la conversación entre el cliente (C) y el asistente (A) para identificar el flujo de interés del cliente.

FLUJOS DISPONIBLES:
— ID: PEDIDO: Activa este flujo exclusivamente si el cliente expresa de manera clara y directa que desea realizar una compra o hacer un pedido de productos específicos de la fábrica de lácteos LeidyLac. Los únicos productos que ofrece LeidyLac son: Queso, Yogurt y Manjar de leche. No actives este flujo si el cliente simplemente pregunta por los productos, solicita información adicional, o muestra interés en conocer más detalles. Ejemplos de frases que NO deben activar este flujo: "¿Hay queso?", "Cuéntame más sobre el Queso Criollo", "¿Qué productos tienes?", "¿Cuánto cuesta el yogurt?", "¿Te gustaría saber más detalles sobre alguno en especial?","¿Te gustaría saber algo más sobre este producto?". AVISO IMPORTANTE : NO ACTIVES ESTE FLUJO SI EL CLIENTE MENCIONA ESTAS PALABRAS: criollo, semiduro, chicloso, requesón y pasteurizado.

- ID: DIRECCION: Activa este flujo si el cliente pregunta por la ubicación, las coordenadas o la dirección de la fábrica de lácteos LeidyLac. 

- ID: CONTACTO: Activa este flujo si el cliente dice que quiere comunicarse con un administrador de la empresa o solicita el contacto o número de teléfono de un administrador de la empresa LeidyLac.

- ID: DESPEDIDA: Activa este flujo si el cliente se despide o muestra la intención de finalizar la conversación.

Debes responder solo con el ID del flujo correspondiente. Si no puedes determinar el flujo o si el cliente muestra interés en otro tema, debes responder 'unknown'.
ID:
`;


const generatePromptDetermine = () => {
  return PROMPT_DETERMINE;
};

export {generatePromptDetermine};

