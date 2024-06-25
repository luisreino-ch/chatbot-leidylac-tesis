import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './customerForm.flow.js';
import { orderInitialFlow, orderFlow} from './flowOrders/order.flow.js';
import { cheeseFlow } from './flowOrders/cheese.flow.js';
import { yogurtFlow, yogurtPackFlow } from './flowOrders/yogurt.flow.js';
import { manjarFlow } from './flowOrders/manjarFlow.js';
import { finalOrderFlow, listOrderFlow } from './flowOrders/finalOrder.flow.js';
import { editOrderFlow, modifyQuantityFlow, removeProductFlow } from './flowOrders/editOrder.flow.js';
import { checkClient } from './checkClient.flow.js';
import { welcomeFlow } from './welcome.flow.js';


const flowsAgents = [
  checkClient
  
];

const flows = [
  welcomeFlow,
  customerFormFlow,
  orderInitialFlow,
  orderFlow,
  cheeseFlow,
  yogurtFlow,
  yogurtPackFlow,
  manjarFlow,
  listOrderFlow,
  finalOrderFlow,
  editOrderFlow,
  modifyQuantityFlow,
  removeProductFlow,
  
];

const flow = createFlow([...flowsAgents, ...flows])


export {flow}