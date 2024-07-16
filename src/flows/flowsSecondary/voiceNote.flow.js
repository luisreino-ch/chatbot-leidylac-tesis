import { EVENTS, addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";

const voiceNoteFlow = addKeyword(EVENTS.VOICE_NOTE)
  .addAction( async(ctx, { endFlow }) => {

    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }
  })
  .addAnswer('Por favor escribe un mensaje', null, async (ctx, { endFlow }) => {
    return endFlow()
  })

export { voiceNoteFlow };