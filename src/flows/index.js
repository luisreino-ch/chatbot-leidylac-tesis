import {createFlow} from '@builderbot/bot'
import { customerFormFlow } from './customerForm.flow';



const flowsAgents = [
  
  
];

const flows = [
  customerFormFlow
  
];

const flow = createFlow([...flowsAgents, ...flows])


export {flow}