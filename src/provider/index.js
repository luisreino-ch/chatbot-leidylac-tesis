import { createProvider } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'

const provider = createProvider(BaileysProvider)

// Método para marcar los mensajes como leídos
provider.on('message', async (ctx) => {
  provider.vendor.readMessages([ctx.key])
});

export { provider }