import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../services/api/checkBlacklist.js";

const contactFlow = addKeyword('contacto')

  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }

  })

  .addAnswer(['Aquí tienes el contacto de un administrador de la empresa LeidyLac:'], null, async (ctx, { endFlow, provider}) => {


    const vcard = 
            'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Katherine Chuchuca\n' // full name
            + 'ORG:Katherine Chuchuca;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=593980643995:+593980643995\n' // WhatsApp ID + phone number
            + 'END:VCARD'

    
    const id  = ctx.key.remoteJid
    const sock = await provider.getInstance()

    await sock.sendMessage(
      id,
      { 
        contacts: { 
            displayName: 'Katherine Chuchuca', 
            contacts: [{ vcard }] 
        }
      }
    )


    return endFlow()

  })

export { contactFlow };