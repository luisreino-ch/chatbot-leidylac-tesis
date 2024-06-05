import { addKeyword, EVENTS } from "@builderbot/bot";
import { orderFlow } from "./order.flow.js";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { addOrUpdateProduct } from "../../functions/addOrUpdateProduct.js";
import { listOrderFlow } from "./finalOrder.flow.js";
import { sendPrice } from "../../services/api/priceProductService.js";

const yogurtFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(['Selecciona el sabor de yogurt que deseas.','\nPor favor escribe el número de alguna de las opciones:','\n1️⃣ Frutilla ','2️⃣ Mora','3️⃣ Piña','4️⃣ Durazno', '5️⃣ Guanábana','6️⃣ Pack, 10 unidades de 150ml (surtido) '],
  {capture:true}, async(ctx, { state, fallBack, endFlow, gotoFlow}) => {

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({order: [], tries: 0});
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificador de respuesta válida y de intentos 
    if (!["1", "2", "3","4","5","6"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({order: [], tries: 0});
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
    } else if (ctx.body === "6") {
      return gotoFlow(yogurtPackFlow)
    }

    const productResponse = {
      '1': 'Yogur de Frutilla',
      '2': 'Yogur de Mora',
      '3': 'Yogur de Piña',
      '4': 'Yogur de Durazno',
      '5': 'Yogur de Guanábana'
    };

    await state.update({ flavor: productResponse[ctx.body], tries: 0})
  })


  .addAnswer(['Por favor escribe el número de alguna de las opciones:','\n1️⃣ 1 Litro','2️⃣ 2 Litros'], 

    {capture: true}, async(ctx, { state, endFlow, fallBack }) => {
    
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);
    
    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({order: [], tries: 0});
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificador de respuesta válida y de intentos 
    if (!["1","2"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({order: [], tries: 0});
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Respuesta no válida, por favor selecciona una de las opciones.');
    }

    const liters = {
      '1': '1 Litro',
      '2': '2 Litros'
    };


    let productResponseLiters = `${state.get('flavor')} ${liters[ctx.body]}`

    const priceProduct = await sendPrice(productResponseLiters);

    await state.update({ product: productResponseLiters, price: priceProduct, tries: 0 })

  })

  .addAnswer('Escribe la cantidad de unidades que deseas: ',{capture:true}, async(ctx, {state,fallBack, endFlow}) => {

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
      return fallBack('Por favor escribe una cantidad válida. Solo se pueden hacer pedidos de 1 a 100 unidades.');
    }
    
    let productResponse = state.get('product')
    let price = state.get('price')
    let units = parseInt(ctx.body)

    addOrUpdateProduct(order, productResponse, units, price);

    await state.update({ order: order , tries: 0})
    
  })


  .addAnswer(['¿Deseas agregar otro producto?','\nPor favor escribe *si* o *no*.'],{capture:true}, async(ctx, {state, gotoFlow, fallBack,endFlow}) => {

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

    // Redireccionar a otros flujos
    if (ctx.body.toLowerCase() === 'si') {
      await state.update({tries: 0})
      return gotoFlow(orderFlow)
    }
    else if (ctx.body.toLowerCase() === 'no') {
      await state.update({tries: 0})
      return gotoFlow(listOrderFlow)
    }

  })  

// Flujo para el pack de yogurt
const yogurtPackFlow = addKeyword(EVENTS.ACTION)
  .addAnswer('Escribe la cantidad de packs que deseas : ',{capture:true}, async(ctx, {state, fallBack, endFlow}) => {
    
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
      return fallBack('Por favor escribe una cantidad válida. Solo se pueden hacer pedidos de 1 a 100 unidades.');
    }

    let productResponse = 'Yogur Pack 10U 150ml'
    const price = await sendPrice(productResponse);
    let units = parseInt(ctx.body)


    addOrUpdateProduct(order, productResponse, units, price);

    await state.update({ order: order, tries: 0})
  })


  .addAnswer(['¿Deseas agregar otro producto?','\nPor favor escribe *si* o *no*.'],{capture:true}, async(ctx, {state, gotoFlow, fallBack,endFlow}) => {
    
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

export { yogurtFlow, yogurtPackFlow }
