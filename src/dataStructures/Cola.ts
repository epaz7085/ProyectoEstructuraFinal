/*
 * Cola genérica implementada desde cero (lista enlazada por dentro).
 * NO usa array.push()/array.shift() para la lógica central — eso sería
 * apoyarse en la estructura nativa del lenguaje en vez de implementar
 * la cola de verdad.
 */

class NodoCola<T> {
    dato: T;
    siguiente: NodoCola<T> | null = null;

    constructor(dato: T) {
        this.dato = dato;
    }
}

export class Cola<T> {
    private frente: NodoCola<T> | null = null;
    private final: NodoCola<T> | null = null;
    private cantidad: number = 0;

    // Meter un elemento al final de la cola (encolar)
    encolar(dato: T): void {
        const nuevo = new NodoCola(dato);
        if (this.frente === null) {
            this.frente = nuevo;
            this.final = nuevo;
        } else {
            this.final!.siguiente = nuevo;
            this.final = nuevo;
        }
        this.cantidad++;
    }

    // Sacar el elemento del frente de la cola (desencolar)
    desencolar(): T | null {
        if (this.frente === null) {
            return null;
        }
        const dato = this.frente.dato;
        this.frente = this.frente.siguiente;
        if (this.frente === null) {
            this.final = null;
        }
        this.cantidad--;
        return dato;
    }

    verFrente(): T | null {
        return this.frente ? this.frente.dato : null;
    }

    estaVacia(): boolean {
        return this.frente === null;
    }

    contarElementos(): number {
        return this.cantidad;
    }

    // Devuelve todos los elementos en orden (frente -> final), sin
    // modificar la cola. Util para mostrarlos en una pantalla.
    obtenerTodos(): T[] {
        const resultado: T[] = [];
        let actual = this.frente;
        while (actual !== null) {
            resultado.push(actual.dato);
            actual = actual.siguiente;
        }
        return resultado;
    }
}