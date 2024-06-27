import {addKeyword} from "@builderbot/bot";
import { checkClientService } from "../services/api/checkClientService.js";
import { orderInitialFlow } from "./flowsOrders/order.flow.js";
import { customerFormFlow } from "./customerForm.flow.js";
import { checkBlacklist } from "../services/api/checkBlacklist.js";

const checkClient = addKeyword('pedido', { sensitive: true })
  .addAction( async(ctx, { gotoFlow, endFlow}) => {

    const blacklistUser = await checkBlacklist(ctx);

    if (blacklistUser) {
        return endFlow()
    }
    
    const status = await checkClientService(ctx);

    if (status) {
      return gotoFlow(orderInitialFlow);
    } else {
      return gotoFlow(customerFormFlow);
    }
    
  });

export {checkClient}