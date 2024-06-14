import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './customerForm.flow.js';
import { orderFlow } from './flowOrders/order.flow.js';
import { cheeseFlow } from './flowOrders/cheese.flow.js';
import { yogurtFlow, yogurtPackFlow } from './flowOrders/yogurt.flow.js';
import { manjarFlow } from './flowOrders/manjarFlow.js';
import { finalOrderFlow, listOrderFlow } from './flowOrders/finalOrder.flow.js';
import { editOrderFlow, modifyQuantityFlow, removeProductFlow } from './flowOrders/editOrder.flow.js';
import { checkClient } from './checkClient.flow.js';
import { welcomeFlow } from './welcome.flow.js';
import { productEmployeeFlow } from './flowAgents/productEmployee.flow.js';


const flowsAgents = [
  checkClient,
  productEmployeeFlow
  
];

const flows = [
  welcomeFlow,
  customerFormFlow,
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