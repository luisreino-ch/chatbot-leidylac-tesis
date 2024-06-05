import { addKeyword, EVENTS } from "@builderbot/bot";
import { orderFlow } from "./order.flow.js";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { addOrUpdateProduct } from "../../functions/addOrUpdateProduct.js";
import { listOrderFlow } from "./finalOrder.flow.js";
import { sendPrice } from "../../services/api/priceProductService.js";

const manjarFlow = addKeyword(EVENTS.ACTION)

  .addAnswer(['Por favor escribe el número de alguna de las opciones:','\n1️⃣ 110g','2️⃣ 250g'],
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

    const productResponse = {
      '1': 'Manjar de leche 110g',
      '2': 'Manjar de leche 250g'
    };

    const selectedProductName = productResponse[ctx.body];

    const priceProduct = await sendPrice(selectedProductName); 

    await state.update({ product: selectedProductName, price: priceProduct, tries: 0})

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
    let price = state.get('price');
    let units = parseInt(ctx.body)

    addOrUpdateProduct(order, productResponse, units, price)

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
      return gotoFlow(listOrderFlow)
    }
  }) 

export { manjarFlow }
