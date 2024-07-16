import { addKeyword, EVENTS } from "@builderbot/bot";
import { listOrderFlow } from "./finalOrder.flow.js";
import { orderFlow } from "./order.flow.js";
import { AttemptHandler } from "../../functions/AttemptHandler.js";

const editOrderFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(['📝 *Edición del Pedido* 📝', '¿Qué deseas hacer?', '\n1️⃣ Agregar productos', '2️⃣ Modificar cantidades', '3️⃣ Eliminar un producto', '0️⃣ Cancelar edición'], { capture: true }, async (ctx, { state, fallBack, gotoFlow }) => {
    const attemptHandler = new AttemptHandler(state);

    let order = state.get('order') || [];

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return gotoFlow(listOrderFlow);
    }

    if (!['1','2','3','0'].includes(ctx.body)) {
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ tries: 0 });
        return gotoFlow(listOrderFlow);
      }
      return fallBack('Por favor, selecciona una de las opciones válidas.');
    }

    await state.update({ tries: 0 });

    switch (ctx.body) {
      case '1':
        return gotoFlow(orderFlow);
      case '2':
        if (order.length === 0) {
          return fallBack('No tienes productos en tu pedido. Por favor agrega productos primero.');
        }
        return gotoFlow(modifyQuantityFlow);
      case '3':
        if (order.length === 0) {
          return fallBack('No tienes productos en tu pedido. Por favor agrega productos primero.');
        }
        return gotoFlow(removeProductFlow);
      case '0':
        return gotoFlow(listOrderFlow);
    }



  });

// Flujo para modificar cantidades
const modifyQuantityFlow = addKeyword(EVENTS.ACTION)
  .addAnswer('Escribe el número del producto que deseas modificar:', { capture: true }, async (ctx, { state, flowDynamic, fallBack, gotoFlow}) => {
    const attemptHandler = new AttemptHandler(state);

    let order = state.get('order') || [];

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return gotoFlow(listOrderFlow);
    }

    if (!order[parseInt(ctx.body) - 1]) {
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await flowDynamic('Has alcanzado el número máximo de intentos')
        await state.update({ tries: 0 });
        return gotoFlow(listOrderFlow);
      }
      return fallBack('Número de producto no válido. Por favor inténtalo de nuevo.');
    }

    await state.update({ modifyIndex: parseInt(ctx.body) - 1, tries: 0,});
  })
  .addAnswer('Escribe la nueva cantidad de unidades para este producto:', { capture: true }, async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return gotoFlow(listOrderFlow);
    }

    const numUnits = /^(100|[1-9][0-9]?$)$/;
    if (!numUnits.test(ctx.body)) {
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await flowDynamic('Has alcanzado el número máximo de intentos')
        await state.update({ tries: 0 });
        return gotoFlow(listOrderFlow);
      }
      return fallBack('Cantidad no válida. Por favor escribe una cantidad entre 1 y 100.');
    }

    let order = state.get('order');
    order[state.get('modifyIndex')].quantity = parseInt(ctx.body);

    await state.update({ order: order, tries: 0, modifyIndex: null });
    return gotoFlow(listOrderFlow); // Volver a mostrar el resumen del pedido
  });

// Flujo para eliminar productos
const removeProductFlow = addKeyword(EVENTS.ACTION)
  .addAnswer('Escribe el número del producto que deseas eliminar:', { capture: true }, async (ctx, { state, flowDynamic, fallBack, gotoFlow }) => {
    const attemptHandler = new AttemptHandler(state);
    let order = state.get('order') || [];

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return gotoFlow(listOrderFlow);
    }

    if (!order[parseInt(ctx.body) - 1]) {
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await flowDynamic('Has alcanzado el número máximo de intentos')
        await state.update({ tries: 0 });
        return gotoFlow(listOrderFlow);
      }
      return fallBack('Número de producto no válido. Por favor inténtalo de nuevo.');
    }

    order.splice(parseInt(ctx.body) - 1, 1);
    await state.update({ order: order, tries: 0 });
    return gotoFlow(listOrderFlow); // Volver a mostrar el resumen del pedido
  });

export { editOrderFlow, modifyQuantityFlow, removeProductFlow };