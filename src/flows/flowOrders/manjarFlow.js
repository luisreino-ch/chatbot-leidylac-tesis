import { addKeyword, EVENTS } from "@builderbot/bot";
import { orderFlow } from "./order.flow.js";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { addOrUpdateProduct } from "../../functions/addOrUpdateProduct.js";

const manjarFlow = addKeyword(EVENTS.ACTION)

  .addAnswer(['Por favor escribe el número de alguna de las opciones:','\n1️⃣ 110g','2️⃣ 200g'],
    {capture:true}, async(ctx, { state, fallBack, endFlow}) => {

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({order: [], tries: 0});
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificador de respuesta válida y de intentos 
    if (!["1", "2"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({order: [], tries: 0});
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
    }

    let manjarGrams = ''

    switch(ctx.body) {
    case "1":
      manjarGrams = 'Manjar de leche, 110g';
      break;
    case "2":
      manjarGrams = 'Manjar de leche, 200g';
      break;
    }

    await state.update({ product: manjarGrams, tries: 0})

  })

  .addAnswer('Escribe la cantidad de unidades que deseas:', 
    {capture: true}, async(ctx, {state, fallBack, endFlow}) => {
    
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    let order = state.get('order') || [];

    await state.update({ quantity: ctx.body })

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({order: [], tries: 0});
      return endFlow('Pedido cancelado con éxito.')
    }

    const numUnits = /^(100|[1-9][0-9]?$)$/;

    // Verificador de respuesta válida y de intentos 
    if (!numUnits.test(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({order: [], tries: 0});
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor escribe una cantidad válida. Solo se pueden hacer pedidos de 1 a 100 unidades');
    }

    let productResponse = state.get('product')
    let units = parseInt(ctx.body)

    addOrUpdateProduct(order, productResponse, units)

    await state.update({ order: order, tries: 0 })
  })

  .addAnswer(['Deseas agregar otro producto?','\nPor favor escribe *si* o *no*.'],{capture:true}, async(ctx, {state, gotoFlow, fallBack,endFlow}) => {
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({order: [], tries: 0});
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificador de respuesta válida y de intentos 
    if (!["si","no"].includes(ctx.body.toLowerCase())) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({order: [], tries: 0});
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor escribe una opción válida, solo puedes seleccionar *si* o *no*.');
    }

    if (ctx.body.toLowerCase() === 'si') {
      await state.update({tries: 0})
      return gotoFlow(orderFlow)
    }
    else if (ctx.body.toLowerCase() === 'no') {
      await state.update({tries: 0})
      console.log('flow list Order')
    }
  }) 

export { manjarFlow }
