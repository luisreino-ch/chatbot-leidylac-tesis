import { EVENTS, addKeyword } from "@builderbot/bot";
//import { initializeEmployees } from "../agents/index.js";
import { run, runDetermine } from "../services/openai/index.js";
import { checkClient } from "./checkClient.flow.js";


/* 
const welcomeFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, ctxFn) => {
  const {state} = ctxFn

  // Obtener el nombre del usuario desde el contexto
  const userName = ctx?.pushName ?? '';

  // Inicializar los empleados con el nombre del usuario
  const pluginAi = initializeEmployees(userName);
  ctxFn.extensions.employeesAddon = pluginAi;

  
  // Determinar el empleado adecuado para manejar la consulta
  const employeeDeterminated = await pluginAi.determine(ctx.body)

  if(!employeeDeterminated?.employee){
      return ctxFn.flowDynamic("No te entiendo bien, ¿podrías reformular tu pregunta?. Recuerda que solo puedo responder preguntas relacionadas con la empresa LeidyLac.")
  }

  await state.update({answer:employeeDeterminated.answer})

  console.log(`[EMPLOYEE]:`, employeeDeterminated.employee)

  pluginAi.gotoFlow(employeeDeterminated.employee, ctxFn)
  
})
 */




// Punta de entrada 
const welcomeFlow = addKeyword(EVENTS.WELCOME)

  .addAction(async (ctx, {state, gotoFlow} ) => {
    try {
      const history = (state.getMyState()?.history ?? []) 
      const ai = await runDetermine(history)

      console.log(`[QUE FLUJO QUIERE]:`, ai.toLowerCase())

      if(ai.toLowerCase().includes('unknown')){
        return
      }

      if(ai.toLowerCase().includes('pedido')){
        await state.update({history: null})
        return gotoFlow(checkClient)
      }


    } catch (error) {
      console.log(`[ERROR]:`, error)
      return
    }
  })

  .addAction(async (ctx, {flowDynamic, state}) =>{
    
    try {
      const newHistory = (state.getMyState()?.history ?? []) 
      const name = ctx?.pushName ?? ''

      console.log(`[HISTORY]:`, newHistory)

      newHistory.push({
        role: "user", 
        content: ctx.body
      })

      const largeResponse = await run(name, newHistory)
      const chunks = largeResponse.split(/(?<!\d)\.\s+/g);
      
      for(const chunk of chunks){
        await flowDynamic(chunk);
      }
      
    
      newHistory.push({
        role: "assistant", 
        content: largeResponse
      })

      await state.update({history: newHistory})
      
    } catch (error) {
      console.log(`[ERROR]:`, error)
    }
    
  })


export { welcomeFlow };