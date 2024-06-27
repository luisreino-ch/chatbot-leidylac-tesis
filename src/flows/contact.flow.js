import { addKeyword } from "@builderbot/bot";
import { checkBlacklist } from "../services/api/checkBlacklist.js";

const contactFlow = addKeyword('contacto')

  .addAction( async(ctx, { endFlow }) => {
    
    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }

  })

  .addAnswer(['Contacto de un administradora de la empresa: '], null, async (ctx, { endFlow, provider}) => {


    const vcard = 
            'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:Katherine Chuchuca\n' // full name
            + 'ORG:LeidyLac;\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=911234567890:+91 12345 67890\n' // WhatsApp ID + phone number
            + 'END:VCARD'

    
    const id  = ctx.key.remoteJid
    const sock = await provider.getInstance()

    await sock.sendMessage(
      id,
      { 
        contacts: { 
            displayName: 'katy', 
            contacts: [{ vcard }] 
        }
      }
    )


    return endFlow()

  })

export { contactFlow };