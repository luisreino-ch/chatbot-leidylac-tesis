import { addKeyword } from "@builderbot/bot";


import AttemptHandler from "../../functions/AttemptHandler.js";

const orderFlow = addKeyword('pedido', { sensitive: true })
  .addAnswer(['Voy a tomar tu pedido', '\nSi en algún momento deseas cancelar el pedido, simplemente escribe la palabra *cancelar* y detendremos el proceso.'])
  .addAnswer([
    'Selecciona un producto',
    '\nPor favor escribe el número de alguna de las opciones:',
    '\n1️⃣ Queso',
    '2️⃣ Yogurt',
    '3️⃣ Manjar de leche'
  ], 
  { capture: true }, async (ctx, { state, fallBack, endFlow }) => {

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);
    
    // Verificador de cancelación
    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ order: [], tries: 0 });
      return endFlow('Pedido, cancelado con éxito.');
    }
    // Verificador de respuesta válida y de intentos 
    if (!["1", "2", "3"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ order: [], tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
    }
    
    await state.update({ tries: 0 });

    switch (ctx.body) {
      case "1":
        return console.log('Queso');
      case "2":
        return console.log('Yogurt');
      case "3":
        return console.log('Manjar de leche');
    }
  });


export { orderFlow };
