import { addKeyword } from "@builderbot/bot";

const byeFlow = addKeyword(['bye', 'adios', 'chao','hasta luego', 'hasta pronto', 'hasta la próxima', 'hasta la vista', 'nos vemos', 'hasta mañana'])
  .addAnswer('¡Hasta luego! 😊', null, async (ctx, { endFlow }) => {
    return endFlow()
  })

export { byeFlow };