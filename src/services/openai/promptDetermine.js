
const PROMPT_DETERMINE = `
Analiza la conversación entre el cliente (C) y el asistente (A) para identificar el flujo de interés del cliente.

FLUJOS DISPONIBLES:


— ID: PEDIDO: Activa este flujo solo y únicamente si el cliente dice explícitamente que quiere hacer una compra o un pedido de productos de la fábrica de lácteos LeidyLac ( los únicos productos que ofrece LeidyLac son: Queso, Yogurt y Manjar de leche). No debes activar este flujo si el cliente te pregunta que productos tienes o si solo está preguntando por precios o por información de los productos.


- ID: DIRECCION: Activa este flujo si el cliente pregunta por la ubicación o la dirección de la fábrica de lácteos LeidyLac.

- ID: CONTACTO: - Activa este flujo si el cliente solicita comuncarse con el adminstrador de la empresa LeidyLac.
                - Activa este flujo si el cliente solicita el contacto o numero de teléfono de un administrador de la empresa LeidyLac.

- ID: DESPEDIDA: Activa este flujo si el cliente se despide o meustra la intención de finalizar la conversación.


Debes responder solo con el ID del flujo correspondiente. Si no puedes determinar el flujo o si el cliente muestra interés en otro tema, debes responder 'unknown'.
ID:
`;


const generatePromptDetermine = () => {
  return PROMPT_DETERMINE;
};

export {generatePromptDetermine};




/* Analiza la conversación entre el cliente (C) y el asistente (A) para identificar el flujo de interés del cliente.

FLUJOS DISPONIBLES:
— ID: PEDIDO: Activa esteflujo solo y únicamente si el cliente dice explícitamente que quiere hacer una compra o un pedido de productos de la fábrica de lácteos LeidyLac ( los únicos productos que ofrece LeidyLac son: Queso, Yogurt y Manjar de leche). No debes activar este flujo si el cliente pregunta que productos tienes o si solo está preguntando por precios o por información de los productos. Preguntas en las que no debes activar el flujo : ¿Te gustaría saber más detalles sobre alguno en específico?, ¿Te gustaría saber algo más sobre este producto?.


- ID: DIRECCION: Activa este flujo si el cliente pregunta por la ubicación, las coordenadas o la dirección de la fábrica de lácteos LeidyLac. 
- ID: CONTACTO: Activa este flujo si el cliente dice que quiere comunicarse con un administrador de la empresa o solicita el contacto o número de teléfono de un administrador de la empresa LeidyLac.
- ID: DESPEDIDA: Activa este flujo si el cliente se despide o muestra la intención de finalizar la conversación.

Debes responder solo con el ID del flujo correspondiente. Si no puedes determinar el flujo o si el cliente muestra interés en otro tema, debes responder 'unknown'.
ID: */