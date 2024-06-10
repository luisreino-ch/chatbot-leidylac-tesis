import { EVENTS, addKeyword } from "@builderbot/bot";



const welcomeFlow = addKeyword(EVENTS.WELCOME)
  .addAnswer('hola')


export { welcomeFlow };