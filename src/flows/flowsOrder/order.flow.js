import {addKeyword, EVENTS} from "@builderbot/bot";
import {AttemptHandler} from "../../functions/AttemptHandler.js";
import { cheeseFlow } from "./cheese.flow.js";
import { yogurtFlow } from "./yogurt.flow.js";
import { manjarFlow } from "./manjarFlow.js";

const orderInitialFlow = addKeyword(EVENTS.ACTION)
.addAnswer(['📝 *Voy a tomar tu pedido* 📝 ', 'Si en algún momento deseas cancelar el pedido, simplemente escribe la palabra *cancelar* y detendremos el proceso.'], 
  null, async (ctx, { gotoFlow }) => {
    return gotoFlow(orderFlow);
  }
)

const orderFlow = addKeyword(EVENTS.ACTION)
  .addAnswer([
    'Selecciona un producto',
    '\nPor favor escribe el número de alguna de las opciones:',
    '\n1️⃣ Queso',
    '2️⃣ Yogurt',
    '3️⃣ Manjar de leche',
    '0️⃣ Cancelar pedido'
  ], 
  { capture: true }, async (ctx, { state, fallBack, gotoFlow, endFlow }) => {

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);
    
    // Verificador de cancelación
    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ order: [], history: [], tries: 0 });
      return endFlow('Pedido, cancelado con éxito.');
    }
    // Verificador de respuesta válida y de intentos 
    if (!["1", "2", "3", "0"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ order: [], history: [], tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor, selecciona una de las opciones válidas.');
    }
    
    await state.update({ history: [], tries: 0 });

    switch (ctx.body) {
      case "1":
        return gotoFlow(cheeseFlow);
      case "2":
        return gotoFlow(yogurtFlow);
      case "3":
        return gotoFlow(manjarFlow);
      case "0":
        await state.update({ order: [], history: [], tries: 0 });
        return endFlow('Pedido, cancelado con éxito.');
    }
  });

export { orderFlow, orderInitialFlow};
