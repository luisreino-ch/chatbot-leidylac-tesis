import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";

const contactFlow = addKeyword(['contacto','contactar','administrador'])

  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }

  })

  .addAnswer(['Aquí tienes el contacto de un administrador de la empresa LeidyLac:'], null, async (ctx, {state, endFlow, provider}) => {
    await state.update({ history: []});

    const vcard = 
            'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Administrador 1\n' // full name
            + 'ORG:Administrador 1;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=593111111111:+593111111111\n' // WhatsApp ID + phone number
            + 'END:VCARD'

    
    const id  = ctx.key.remoteJid
    const sock = await provider.getInstance()

    await sock.sendMessage(
      id,
      { 
        contacts: { 
            displayName: 'Administrador 1', 
            contacts: [{ vcard }] 
        }
      }
    )


    return endFlow()

  })

export { contactFlow };