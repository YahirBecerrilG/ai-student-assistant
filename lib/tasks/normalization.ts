export function normalizeDate(
    dateText: string | null,
    referenceDate: Date
): Date | null {
    // Si el texto de la fecha es nulo, devolvemos nulo
    if (!dateText) {
        return null;
    }
    // Normalizamos el texto de la fecha para que sea más fácil de comparar
    const text = dateText
        .trim()
        .toLowerCase()
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u");

    const result = new Date(referenceDate); // Creamos una nueva fecha basada en la fecha de referencia

    // Hoy
    if (text === "hoy") {
        return result;
    }

    // Mañana
    if (text === "mañana" || text === "manana") {
        result.setDate(result.getDate() + 1);
        return result;
    }
    // Dias de la semana (lunes, martes, miércoles, jueves, viernes, sábado, domingo)
    const daysOfWeek = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado"
    ];
    // Buscamos el índice del día de la semana en el arreglo de días de la semana
    const targetDay = daysOfWeek.indexOf(text);
    // Si no encontramos el día de la semana, devolvemos nulo
    if (targetDay === -1) {
        return null;
    }
    // Obtenemos el día de la semana de la fecha de referencia
    const currentDay = result.getDay();
    // Calculamos cuántos días debemos agregar para llegar al día de la semana deseado
    const daysToAdd =
        (targetDay - currentDay + 7) % 7;
    // Si el día de la semana deseado es hoy, agregamos 7 días para que sea la próxima semana
    result.setDate(
        result.getDate() + daysToAdd
    );

    return result;
}

export function normalizeEstimatedTime( // Función para normalizar el tiempo estimado de una tarea
    estimatedTime: string | null
): number | null {
    // Si el tiempo estimado es nulo, devolvemos nulo
    if (!estimatedTime) {
        return null;
    }
    // Expresiones regulares para buscar horas y minutos en el texto
    const regexHoras = /(\d+)\s*(h|hr|hrs|hora|horas)/i;
    const regexMinutos = /(\d+)\s*(m|min|mins|minuto|minutos)/i;
    // Buscamos las horas y los minutos en el texto usando las expresiones regulares
    const horasMatch = estimatedTime.match(regexHoras);
    const minutosMatch = estimatedTime.match(regexMinutos);

    // Defimir horas
    const horas = horasMatch
        ? parseInt(horasMatch[1], 10)
        : 0;
    // Definir minutos
    const minutos = minutosMatch
        ? parseInt(minutosMatch[1], 10)
        : 0;
    //Si no se encuentran horas ni minutos, devolvemos nulo
    if (!horasMatch && !minutosMatch) {
        return null;
    }
    // Devolvemos el tiempo estimado en minutos
    return (horas * 60) + minutos;
}