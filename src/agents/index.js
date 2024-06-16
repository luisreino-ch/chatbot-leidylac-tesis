import "dotenv/config"
import { EmployeesClass } from "@builderbot-plugins/openai-agents";
import { checkClient } from "../flows/checkClient.flow.js";
import { productEmployeeFlow } from "../flows/flowAgents/productEmployee.flow.js";
import { generatePromptProductEmployee } from "../prompts/productEmployee.prompt.js";


/* const emplyeeInstace = new EmployeesClass({
  model: "gpt-3.5-turbo-16k",
  temperature: 0,
  max_tokens: 256,
  apiKey: process.env.OPENAI_API_KEY
})

emplyeeInstace.employees([
  {
      name: "EMPLEADO_PEDIDOS", // NAME OF YOUR AGENT
      description: // DESCRIPTION OF YOUR AGENT AND WHAT IT WILL DO
          "Es el empleado de pedidos amable encargado de atender si tienes intención de realizar un pedido de los productos de la fábrica de lácteos LeidyLac.",
      flow: checkClient, // YOUR FLOW IMPLEMENTATION
  },
  {
    name: "EMPLEADO_PRODUCTOS", 
    description: 
        "Es el empleado experto amable encargado de responder a tus preguntas sobre los productos de la fábrica de lácteos LeidyLac.",
    flow: productEmployeeFlow, 
  }, 
  {
    name: "EMPLEADO_EMPRESA", 
    description: 
        "Es el empleado experto amable encargado de responder a tus preguntas sobre la empresa de lácteos LeidyLac.",
    flow: checkClient, 
  },  
])


export {emplyeeInstace} */

const createEmployees = (userName) => [
  {
    name: "EMPLEADO_PEDIDOS",
    description: `Es el empleado de pedidos amable encargado de atender si tienes intención de realizar un pedido de los productos de la fábrica de lácteos LeidyLac.`,
    flow: checkClient,
  },
  {
    name: "EMPLEADO_PRODUCTOS",
    description: generatePromptProductEmployee(userName),
    flow: productEmployeeFlow,
  },
  {
    name: "EMPLEADO_EMPRESA",
    description: `Es el empleado experto amable encargado de responder a tus preguntas sobre la empresa de lácteos LeidyLac.`,
    flow: checkClient,
  },
];

const initializeEmployees = (userName) => {
  const employeeInstance = new EmployeesClass({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 256,
    apiKey: process.env.OPENAI_API_KEY,
  });

  employeeInstance.employees(createEmployees(userName));

  return employeeInstance;
};

export { initializeEmployees };