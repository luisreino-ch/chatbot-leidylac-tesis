import { EVENTS, addKeyword } from "@builderbot/bot";


const productEmployeeFlow = addKeyword(EVENTS.ACTION)
.addAction(async (_, {state, flowDynamic}) =>{
    const currentState = state.getMyState()
    await flowDynamic(currentState.answer) /** here come the answer by OpenAi pluggin */
})

export { productEmployeeFlow }

