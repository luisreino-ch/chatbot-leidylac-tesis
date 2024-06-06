import {addKeyword} from "@builderbot/bot";
import { checkClientService } from "../services/api/checkClientService.js";
import { orderFlow } from "./flowOrders/order.flow.js";
import { customerFormFlow } from "./customerForm.flow.js";

const checkClient = addKeyword('pedido', { sensitive: true })
  .addAction( async(ctx, { gotoFlow }) => {
    
    const status = await checkClientService(ctx);

    if (status) {
      return gotoFlow(orderFlow);
    } else {
      return gotoFlow(customerFormFlow);
    }
    
  });

export {checkClient}