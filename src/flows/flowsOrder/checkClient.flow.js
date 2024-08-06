import {addKeyword} from "@builderbot/bot";
import { checkClientService } from "../../services/api/checkClientService.js";
import { customerFormFlow } from "./customerForm.flow.js";
import { orderInitialFlow } from "./order.flow.js";
import { checkBlacklist } from "../../services/api/checkBlacklistService.js";



const checkClient = addKeyword(['pedido','PEDIDO'],{ sensitive: true })
  .addAction( async(ctx, { gotoFlow, endFlow}) => {

    // chequeo si el usuario está en la blacklist
    const blacklistUser = await checkBlacklist(ctx);

    // si el usuario está en la blacklist, termino el flujo
    if (blacklistUser) {
        return endFlow()
    }
    
    // chequeo si el usuario ya esta registrado
    const status = await checkClientService(ctx);

    // Si el usuario esta registrado se dirige al flujo de pedido caso contrario se redirige al formulario para registrar al usuario
    if (status) {
      return gotoFlow(orderInitialFlow);
    } else {
      return gotoFlow(customerFormFlow);
    }
    
  });

export {checkClient}