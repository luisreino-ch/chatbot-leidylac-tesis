import { EVENTS, addKeyword } from "@builderbot/bot";

const voiceNote = addKeyword(EVENTS.VOICE_NOTE)
  .addAnswer('Por favor escribe un mensaje', null, async (ctx, { endFlow }) => {
    return endFlow()
  })

export { voiceNote };