import { addKeyword } from "@builderbot/bot";
import {AttemptHandler} from "../functions/AttemptHandler.js";

import { orderFlow } from "./flowOrders/order.flow.js";
import { sendCustomerData } from "../services/api/clientService.js";


const customerFormFlow = addKeyword('formulario')
  .addAnswer([
    'Antes de realizar un pedido, vamos a registrarte como cliente. Por favor, responde a las siguientes preguntas.',
    '\nSi en algún momento deseas cancelar el registro, simplemente escribe la palabra *cancelar* y detendremos el proceso.'
  ])
  .addAnswer('¿Cuál es tu nombre completo?', { capture: true }, async (ctx, { state, endFlow, fallBack }) => {
    
    const fullNameRegex = /^[A-Za-zÁÉÍÓÚáéíóú]+(\s[A-Za-zÁÉÍÓÚáéíóú]+)+$/;
    
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);
    
    // Verificador de cancelación
    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return endFlow('Registro cancelado con éxito.');
    }
    // Verificador de respuesta válida y de intentos 
    if (!fullNameRegex.test(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor, escribe un nombre válido.');
    }

    // Si el nombre es válido, actualizar el estado con el nombre y reiniciar el contador de intentos
    await state.update({ fullName: ctx.body, phone: ctx.from, tries: 0 });
  })

  .addAnswer('¿De qué ciudad eres?', { capture: true }, async (ctx, { state, endFlow, fallBack }) => {

    const CITIES = ['quito', 'guayaquil', 'cuenca', 'machala', 'santo domingo', 'portoviejo', 'manta', 'ambato', 'durán', 'riobamba', 'quevedo', 'loja', 'esmeraldas', 'ibarra', 'babahoyo', 'la libertad', 'sangolquí', 'daule', 'latacunga', 'milagro', 'tulcán', 'samborondón', 'santa elena', 'el carmen', 'huaquillas', 'ventanas', 'pasaje', 'chone', 'salinas', 'santa rosa'];

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return endFlow('Registro cancelado con éxito.');
    }

    // Verificador de respuesta válida y de intentos 
    if (!CITIES.includes(ctx.body.toLowerCase())) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor, escribe un nombre válido.');
    }

    await state.update({ city: ctx.body, tries: 0 }); 
  })

  .addAnswer([
    '¿Cuál es tu tipo de negocio?',
    '\nPor favor escribe el número de alguna de las opciones:',
    '\n1️⃣ Tienda',
    '2️⃣ Local',
    '3️⃣ Emprendimiento'
  ], { capture: true }, async (ctx, { state, endFlow, fallBack }) => {

    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return endFlow('Registro cancelado con éxito.');
    }

    const businessMap = {
      '1': 'Tienda',
      '2': 'Local',
      '3': 'Emprendimiento'
    };

    // Verificador de respuesta válida y de intentos 
    if (!["1", "2", "3"].includes(ctx.body)) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor, escribe un nombre válido.');
    }

    await state.update({ business: businessMap[ctx.body], tries: 0 }); 
  })

  .addAnswer([
    '¿Deseas confirmar su registro?',
    '\nPor favor escribe *si* ✅ o *no* ❌.'
  ], { capture: true }, async (ctx, { state, fallBack, endFlow }) => {
    // Crear una instancia de AttemptHandler
    const attemptHandler = new AttemptHandler(state);

    if (ctx.body.toLowerCase() === 'cancelar') {
      await state.update({ tries: 0 });
      return endFlow('Registro, cancelado con éxito.');
    }

    // Verificador de respuesta válida y de intentos 
    if (!["si", "no"].includes(ctx.body.toLowerCase())) {
      // Manejo de Intentos Fallidos
      const reachedMaxAttempts = await attemptHandler.handleTries();
      if (reachedMaxAttempts) {
        await state.update({ tries: 0 });
        return endFlow('Has alcanzado el número máximo de intentos. Inténtalo más tarde.');
      }
      return fallBack('Por favor escribe una opción válida, solo puedes seleccionar *si* o *no*.');
    }

    if (ctx.body.toLowerCase() === 'si') {
      await state.update({ tries: 0 });
      console.log('Registro confirmado');
    } else if (ctx.body.toLowerCase() === 'no') {
      // Limpiar el array de pedidos
      await state.update({ tries: 0 });
      return endFlow('❌ Registro, cancelado con éxito.');
    }

  })

  // Código para enviar la información a una base de datos
  .addAnswer('Tu registro se está procesando ⏱️...', null, async (ctx, {state, flowDynamic, gotoFlow }) => {
    
    // Lógica de guardar el registro en la base de datos
    await sendCustomerData(state);
    
    await flowDynamic('✅ ¡Registro exitoso! Tu información ha sido guardada con éxito.');

    // Redirección al flujo pedido
    return gotoFlow(orderFlow);
    
  });

export { customerFormFlow };
