import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './customerForm.flow.js';
import { orderInitialFlow, orderFlow} from './flowsOrders/order.flow.js';
import { cheeseFlow } from './flowsOrders/cheese.flow.js';
import { yogurtFlow, yogurtPackFlow } from './flowsOrders/yogurt.flow.js';
import { manjarFlow } from './flowsOrders/manjarFlow.js';
import { finalOrderFlow, listOrderFlow } from './flowsOrders/finalOrder.flow.js';
import { editOrderFlow, modifyQuantityFlow, removeProductFlow } from './flowsOrders/editOrder.flow.js';
import { checkClient } from './checkClient.flow.js';
import { welcomeFlow } from './welcome.flow.js';
import { byeFlow } from './bye.flow.js';
import { voiceNoteFlow } from './voiceNote.flow.js';
import { addressFlow } from './address.flow.js';


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
  byeFlow,
  voiceNoteFlow,
  addressFlow
];

const flow = createFlow([...flowsAgents, ...flows])


export {flow}