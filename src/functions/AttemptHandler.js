//CONTROL DE INTENTOS
class AttemptHandler {
  constructor(state, maxTries = 5) {
    this.state = state;
    this.maxTries = maxTries;
  }

  // método manejar los intentos
  async handleTries() {
    try {
      // Se usa await porque getMyState() es una función asincrónica que retorna una promesa.
      const myState = await this.state.getMyState(); 

      // Se trae los número de intentos del estado, si no hay intentos previos, lo inicializa en 0.
      let tries = myState?.tries || 0;

      // Si el número de intentos es menor al máximo permitido, se actualiza el estado con el nuevo número de intentos.
      if (tries < this.maxTries) {
        await this.state.update({ tries: tries + 1 });
      } else {
        // Si el número de intentos es igual al máximo permitido, se retorna true.
        console.log("Máximo de intentos alcanzado, usuario en donde lo hayas redirigido.");
        return true;
      }
      
      // Si el número de intentos es menor al máximo permitido, se retorna false.
      return false;
    } catch (error) {
      console.error("Error manejando los intentos:", error);
      return false;
    }
  }
}


export {AttemptHandler};
