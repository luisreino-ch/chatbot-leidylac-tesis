import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";

const addressFlow = addKeyword(['dirección','ubicación','direccion','ubicacion','ubicados'])

  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }

  })

  .addAnswer(['Nos encontramos ubicados en la Vía a El Placer Km 11, Santo Domingo', '\nEsta es la ubicación exacta:'], null, async (ctx, { state, endFlow, provider}) => {
    await state.update({ history: []});

    const id  = ctx.key.remoteJid
    const sock = await provider.getInstance()

    // send a location!
    await sock.sendMessage(
      id, 
      { location: { degreesLatitude: -0.18309, degreesLongitude: -79.13098 } }
    )
    

    return endFlow()

  })

export { addressFlow };