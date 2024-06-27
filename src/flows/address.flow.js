import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../services/api/checkBlacklist.js";

const addressFlow = addKeyword('ubicacion')

  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }

  })

  .addAnswer(['Nos encontramos ubicados en la Vía a El Placer Km 11, Santo Domingo', '\nEsta es la dirección exacta:'], null, async (ctx, { endFlow, provider}) => {

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