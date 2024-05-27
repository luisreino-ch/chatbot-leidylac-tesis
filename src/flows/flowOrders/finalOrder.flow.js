import { addKeyword, EVENTS } from "@builderbot/bot";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { sendOrderData } from "../../services/api/orderService.js";


const listOrderFlow = addKeyword(EVENTS.ACTION) 
  .addAnswer('Resumen del pedido:', null, async(ctx, { state, flowDynamic, gotoFlow }) => {

    let order = state.get('order') || [];

    let summary = "";
    order.forEach((item, index) => {
        summary += `${index + 1}. Producto: *${item.product}* - Unidades: *${item.quantity}*\n`;
    });

    await state.update({ detailsOrder: summary, phone: ctx.from });

    // Redireccionar al flujo finalOrderFlow
    await flowDynamic(`${summary}`)
    return gotoFlow(finalOrderFlow)
    
  })


const finalOrderFlow = addKeyword(EVENTS.ACTION) 

  .addAnswer(['Deseas confirmar tu pedido?','\nPor favor escribe *si* ✅ o *no* ❌.'], {capture:true}, async(ctx, { state, fallBack, endFlow }) => {
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ order: [], tries: 0 });
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificar respuesta válida y manejo de intentos
    if (!["si", "no"].includes(ctx.body.toLowerCase())) {
      // Manejo de intentos fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ order: [], tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor escribe una opción válida, solo puedes seleccionar *si* o *no*.');
    }

    if (ctx.body.toLowerCase() === 'si') {
      await state.update({ order: [], tries: 0 });
      console.log('Pedido confirmado')
    }
    else if (ctx.body.toLowerCase() === 'no') {
      // Limpiar el array de pedidos
      await state.update({ order: [], tries: 0 });
      return endFlow('❌ Pedido cancelado con éxito.')
    }

  })

  .addAnswer('Tu pedido se está procesando ⏱️...', null, async (_, {state, endFlow }) => {
    
    // Lógica para guardar el pedido en la base de datos
    await sendOrderData(state);

    return endFlow('✅ ¡Pedido realizado con éxito! Nos comunicaremos muy pronto para finalizar tu compra.')
  })


export { listOrderFlow, finalOrderFlow }
