/*
 * Merge Sort implementado desde cero — NO usa array.sort() de
 * JavaScript, ya que eso no demostraria la logica del algoritmo.
 * Es generico: recibe un comparador para poder ordenar pacientes por
 * nombre, por expediente, o cualquier otro criterio.
 */

export function mergeSort<T>(arr: T[], comparador: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) {
        return arr;
    }

    const medio = Math.floor(arr.length / 2);
    const izquierda = mergeSort(arr.slice(0, medio), comparador);
    const derecha = mergeSort(arr.slice(medio), comparador);

    return combinar(izquierda, derecha, comparador);
}

function combinar<T>(izquierda: T[], derecha: T[], comparador: (a: T, b: T) => number): T[] {
    const resultado: T[] = [];
    let i = 0;
    let j = 0;

    while (i < izquierda.length && j < derecha.length) {
        if (comparador(izquierda[i], derecha[j]) <= 0) {
            resultado.push(izquierda[i]);
            i++;
        } else {
            resultado.push(derecha[j]);
            j++;
        }
    }

    while (i < izquierda.length) {
        resultado.push(izquierda[i]);
        i++;
    }
    while (j < derecha.length) {
        resultado.push(derecha[j]);
        j++;
    }

    return resultado;
}