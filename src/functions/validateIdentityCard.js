function validarCedula(cedula) {
    
    // Verificar que la cédula tenga 10 dígitos
    if (cedula.length !== 10) {
    return false;
    }

    // Extraer los dos primeros dígitos (región)
    const region = parseInt(cedula.substring(0, 2), 10);

    // Verificar que la región sea válida (1-24)
    if (region < 1 || region > 24) {
        return false;
    }

    // Extraer el último dígito (dígito verificador)
    const digitoVerificador = parseInt(cedula.substring(9, 10), 10);

    // Sumar los dígitos pares
    let sumaPares = 0;
    for (let i = 1; i < 9; i += 2) {
        sumaPares += parseInt(cedula.charAt(i), 10);
    }

    // Sumar los dígitos impares multiplicados por 2
    let sumaImpares = 0;
    for (let i = 0; i < 9; i += 2) {
        let num = parseInt(cedula.charAt(i), 10) * 2;
        if (num > 9) {
        num -= 9;
        }
        sumaImpares += num;
    }

    // Sumar los resultados de pares e impares
    const sumaTotal = sumaPares + sumaImpares;

    // Obtener el primer dígito de la suma total
    const primerDigitoSuma = parseInt(sumaTotal.toString().charAt(0), 10);

    // Obtener la decena inmediata superior
    const decenaSuperior = (primerDigitoSuma + 1) * 10;

    // Obtener el dígito validador
    const digitoValidadorCalculado = decenaSuperior - sumaTotal;

    // Verificar si el dígito verificador es igual al dígito validador calculado
    return digitoVerificador === (digitoValidadorCalculado === 10 ? 0 : digitoValidadorCalculado);
}

export { validarCedula };

