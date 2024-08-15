import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './flowsOrder/customerForm.flow.js';
import { orderInitialFlow, orderFlow} from './flowsOrder/order.flow.js';
import { cheeseFlow } from './flowsOrder/cheese.flow.js';
import { yogurtFlow, yogurtPackFlow } from './flowsOrder/yogurt.flow.js';
import { manjarFlow } from './flowsOrder/manjarFlow.js';
import { finalOrderFlow, listOrderFlow } from './flowsOrder/finalOrder.flow.js';
import { editOrderFlow, modifyQuantityFlow, removeProductFlow } from './flowsOrder/editOrder.flow.js';
import { checkClient } from './flowsOrder/checkClient.flow.js';
import { welcomeFlow } from './flowMain/welcome.flow.js';
import { byeFlow } from './flowsSecondary/bye.flow.js';
import { voiceNoteFlow } from './flowsSecondary/voiceNote.flow.js';
import { addressFlow } from './flowsSecondary/address.flow.js';
import { contactFlow } from './flowsSecondary/contact.flow.js';


const flows = [
  welcomeFlow,
  checkClient,
  customerFormFlow
];

const flowsSecondary = [
  byeFlow,
  voiceNoteFlow,
  addressFlow,
  contactFlow  
];

const flowsOrder = [
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
  removeProductFlow
];


const flow = createFlow([...flows, ...flowsSecondary,...flowsOrder, ])


export {flow}