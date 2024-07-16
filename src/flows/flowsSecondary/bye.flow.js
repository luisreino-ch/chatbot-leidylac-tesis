import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";


const byeFlow = addKeyword(['bye', 'adios', 'chao','hasta luego', 'hasta pronto', 'hasta la próxima', 'hasta la vista', 'nos vemos', 'hasta mañana'])
  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }
  })
  .addAnswer('¡Hasta luego! 😊', null, async (ctx, {state, endFlow }) => {
    await state.update({ history: []});
    return endFlow()
  })

export { byeFlow };