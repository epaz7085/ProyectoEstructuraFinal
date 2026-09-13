/*
 * Lista enlazada (simple) para el historial de signos vitales de un
 * paciente. Cada nodo guarda un registro (fecha, presion, glucosa, peso)
 * y un puntero al siguiente registro, en orden cronologico.
 */

export type SignoVital = {
    fecha: string;
    presion: string;
    glucosa: string;
    peso: string;
};

class NodoSignoVital {
    dato: SignoVital;
    siguiente: NodoSignoVital | null = null;

    constructor(dato: SignoVital) {
        this.dato = dato;
    }
}

export class ListaSignosVitales {
    private cabeza: NodoSignoVital | null = null;

    // Agrega un nuevo registro de signos vitales al final del historial
    insertarAlFinal(signo: SignoVital): void {
        const nuevo = new NodoSignoVital(signo);
        if (this.cabeza === null) {
            this.cabeza = nuevo;
            return;
        }
        let actual = this.cabeza;
        while (actual.siguiente !== null) {
            actual = actual.siguiente;
        }
        actual.siguiente = nuevo;
    }

    estaVacia(): boolean {
        return this.cabeza === null;
    }

    contarRegistros(): number {
        let contador = 0;
        let actual = this.cabeza;
        while (actual !== null) {
            contador++;
            actual = actual.siguiente;
        }
        return contador;
    }

    // Devuelve el registro mas reciente (el ultimo insertado)
    obtenerUltimo(): SignoVital | null {
        if (this.cabeza === null) {
            return null;
        }
        let actual = this.cabeza;
        while (actual.siguiente !== null) {
            actual = actual.siguiente;
        }
        return actual.dato;
    }

    // Devuelve todo el historial, en orden cronologico
    obtenerTodos(): SignoVital[] {
        const resultado: SignoVital[] = [];
        let actual = this.cabeza;
        while (actual !== null) {
            resultado.push(actual.dato);
            actual = actual.siguiente;
        }
        return resultado;
    }
}