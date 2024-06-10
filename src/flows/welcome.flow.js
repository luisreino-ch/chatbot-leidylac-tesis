import { EVENTS, addKeyword } from "@builderbot/bot";
import { run, runDetermine } from "../services/openai";

const welcomeFlow = addKeyword(EVENTS.WELCOME)

  .addAction(async (ctx, {state}) => {

    try {
      const history = (state.getMyState()?.history ?? [])
      const ai = runDetermine(history)

      // si el modelo de OpenAI no determina un flujo, no hacemos nada
      if(ai.includes('unknown')){
        return
      }



    } catch (error) {
      console.log(`[ERROR]:`, error)
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