import { addKeyword, EVENTS } from "@builderbot/bot";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { sendOrderData } from "../../services/api/orderService.js";
import { delay } from "../../functions/delay.js";
import { editOrderFlow } from "./editOrder.flow.js";

const listOrderFlow = addKeyword(EVENTS.ACTION) 
.addAnswer('🛒 *Resumen del Pedido* 🛒', null, async(ctx, { state, flowDynamic, gotoFlow }) => {

  let order = state.get('order') || [];
  

  let summary = "";
  let total = 0;
  /* order.forEach((item, index) => {
      summary += `${index + 1}. Producto: *${item.product}* - Unidades: *${item.quantity}* - Precio: *${item.price}*\n`;
  });
  */
  order.forEach((item, index) => {
    let subtotal = item.quantity * item.price;  
    summary += `${index + 1}. Producto: *${item.product}*\n    Unidades: *${item.quantity}*\n    Precio: *$${item.price}*\n  Subtotal: *$${subtotal.toFixed(2)}*\n`;
    total += subtotal;
  });

  summary += `\n*Total del Pedido: $${total.toFixed(2)}*`;

  await state.update({ detailsOrder: summary, phone: ctx.from });

  // Redireccionar al flujo finalOrderFlow
  await flowDynamic(`${summary}`)
  return gotoFlow(finalOrderFlow)
  
})


const finalOrderFlow = addKeyword(EVENTS.ACTION) 

  .addAnswer(['Deseas confirmar tu pedido?','\nPor favor escribe el número de alguna de las opciones:', '\n1️⃣ Confirmar pedido', '2️⃣ Editar Pedido','3️⃣ Cancelar pedido'], {capture:true}, async(ctx, { state, fallBack, gotoFlow, endFlow }) => {
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ order: [], history: [], tries: 0 });
      return endFlow('Pedido cancelado con éxito.')
    }

    // Verificar respuesta válida y manejo de intentos
    if (!["1", "2", "3"].includes(ctx.body)) {
      // Manejo de intentos fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ order: [], history: [],  tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor escribe una opción válida, solo puedes seleccionar *si* o *no*.');
    }

    await state.update({ order: [], history: [], tries: 0 });

    if (ctx.body.toLowerCase() === '1') {
      console.log('Pedido confirmado')

    }else if (ctx.body.toLowerCase() === '2') {
      return gotoFlow(editOrderFlow);
    }
    else if (ctx.body.toLowerCase() === 'no') {
      return endFlow('❌ Pedido cancelado con éxito.')
    }

  })

  .addAnswer('Tu pedido se está procesando ⏱️...', null, async (_, {state, endFlow }) => {
    
    // Lógica para guardar el pedido en la base de datos
    await sendOrderData(state);
    await delay(1000);
    return endFlow('✅ ¡Pedido realizado con éxito! Nos comunicaremos muy pronto para finalizar tu compra.')
  })


export { listOrderFlow, finalOrderFlow }
