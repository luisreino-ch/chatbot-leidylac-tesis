import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './customerForm.flow.js';
import { orderFlow } from './flowOrders/order.flow.js';
import { cheeseFlow } from './flowOrders/cheese.flow.js';
import { yogurtFlow, yogurtPackFlow } from './flowOrders/yogurt.flow.js';
import { manjarFlow } from './flowOrders/manjarFlow.js';
import { finalOrderFlow, listOrderFlow } from './flowOrders/finalOrder.flow.js';



const flowsAgents = [
  orderFlow
  
  
];

const flows = [
  customerFormFlow,
  cheeseFlow,
  yogurtFlow,
  yogurtPackFlow,
  manjarFlow,
  listOrderFlow,
  finalOrderFlow
  
];

const flow = createFlow([...flowsAgents, ...flows])


export {flow}