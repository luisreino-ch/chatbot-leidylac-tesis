import { EVENTS, addKeyword } from "@builderbot/bot";
//import { run, runDetermine } from "../services/openai/index.js";
import { run, runDetermine } from "../../services/openai/callOpenAI.js";
import { checkClient } from "../flowsOrder/checkClient.flow.js";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";
import { addressFlow } from "../flowsSecondary/address.flow.js";
import { contactFlow } from "../flowsSecondary/contact.flow.js"; 
import { byeFlow } from "../flowsSecondary/bye.flow.js";


// Punta de entrada 
const welcomeFlow = addKeyword(EVENTS.WELCOME)

  .addAction(async (ctx, {state, gotoFlow, endFlow  } ) => {

    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser ) {
        return endFlow()
    }

    if (ctx.body.length > 150) {
      return endFlow('🙁 No puedo procesar mensajes tan largos, por favor intenta con una pregunta más corta.')
    }

    try {
      const historyDetermine = (state.getMyState()?.history ?? [])

      historyDetermine.push({
        role: "user", 
        content: ctx.body
      })

      await state.update({history: historyDetermine})

      const ai = await runDetermine(historyDetermine)

      console.log(`[HISTORY]:`, historyDetermine)
      console.log(`[QUE FLUJO QUIERE]:`, ai.toLowerCase())

      if(ai.toLowerCase().includes('unknown')){
        return
      }

      if(ai.toLowerCase().includes('pedido')){
        await state.update({history: null})
        return gotoFlow(checkClient)
      }

      if(ai.toLowerCase().includes('direccion')){
        await state.update({history: null})
        return gotoFlow(addressFlow)
      }

      if(ai.toLowerCase().includes('contacto')){
        await state.update({history: null})
        return gotoFlow(contactFlow)
      }

      if(ai.toLowerCase().includes('despedida')){
        await state.update({history: null})
        return gotoFlow(byeFlow)
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


