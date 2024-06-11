import { EVENTS, addKeyword } from "@builderbot/bot";
//import { run, runDetermine } from "../services/openai/index.js";
//import { checkClient } from "./checkClient.flow.js";



const welcomeFlow = addKeyword(EVENTS.WELCOME).addAction(async (ctx, ctxFn) => {
  const {state} = ctxFn
  const pluginAi = ctxFn.extensions.employeesAddon

  /** This function is the one that does the job */
  /** Determine the flow and retrieva an employee object */
  const employeeDeterminated = await pluginAi.determine(ctx.body)

  if(!employeeDeterminated?.employee){
      return ctxFn.flowDynamic("No te entiendo bien, ¿podrías reformular tu pregunta?. Recuerda que solo puedo responder preguntas sobre la fábrica de lácteos LeidyLac.")
  }

  await state.update({answer:employeeDeterminated.answer})

  console.log(`[EMPLOYEE]:`, employeeDeterminated.employee)

  pluginAi.gotoFlow(employeeDeterminated.employee, ctxFn)
  
})

























/* // Punta de entrada 
const welcomeFlow = addKeyword(EVENTS.WELCOME)

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
    
  }) */


export { welcomeFlow };