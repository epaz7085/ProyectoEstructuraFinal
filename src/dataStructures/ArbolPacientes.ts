/*
 * Arbol Binario de Busqueda (ABB) de pacientes, indexado por numero de
 * expediente. Cada paciente guarda ademas su propia lista de signos
 * vitales y su propia cola de medicamentos pendientes.
 */

import { ListaSignosVitales } from "./ListaSignosVitales";
import { Cola } from "./Cola";

export type Medicamento = {
    nombre: string;
    dosis: string;
    horario: string;
    dias: string;
};

export type Paciente = {
    expediente: number;
    nombre: string;
    telefono: string;
    correo: string;
    signosVitales: ListaSignosVitales;
    medicamentosPendientes: Cola<Medicamento>;
};

class NodoArbol {
    paciente: Paciente;
    izquierdo: NodoArbol | null = null;
    derecho: NodoArbol | null = null;

    constructor(paciente: Paciente) {
        this.paciente = paciente;
    }
}

// Crea un paciente nuevo con su historial y su cola de medicamentos
// vacios, listos para usarse.
export function crearPaciente(
    expediente: number,
    nombre: string,
    telefono: string,
    correo: string
): Paciente {
    return {
        expediente,
        nombre,
        telefono,
        correo,
        signosVitales: new ListaSignosVitales(),
        medicamentosPendientes: new Cola<Medicamento>(),
    };
}

export class ArbolPacientes {
    private raiz: NodoArbol | null = null;

    // Inserta siguiendo la logica de un ABB: expedientes menores a la
    // izquierda, mayores a la derecha.
    insertar(paciente: Paciente): void {
        this.raiz = this.insertarRec(this.raiz, paciente);
    }

    private insertarRec(nodo: NodoArbol | null, paciente: Paciente): NodoArbol {
        if (nodo === null) {
            return new NodoArbol(paciente);
        }
        if (paciente.expediente < nodo.paciente.expediente) {
            nodo.izquierdo = this.insertarRec(nodo.izquierdo, paciente);
        } else if (paciente.expediente > nodo.paciente.expediente) {
            nodo.derecho = this.insertarRec(nodo.derecho, paciente);
        }
        // Si el expediente ya existe, no se inserta duplicado
        return nodo;
    }

    // Busqueda aprovechando la propiedad de ABB: descarta la mitad del
    // arbol en cada paso, en vez de revisar todos los pacientes.
    buscar(expediente: number): Paciente | null {
        return this.buscarRec(this.raiz, expediente);
    }

    private buscarRec(nodo: NodoArbol | null, expediente: number): Paciente | null {
        if (nodo === null) {
            return null;
        }
        if (expediente === nodo.paciente.expediente) {
            return nodo.paciente;
        }
        if (expediente < nodo.paciente.expediente) {
            return this.buscarRec(nodo.izquierdo, expediente);
        }
        return this.buscarRec(nodo.derecho, expediente);
    }

    // Recorrido INORDEN: devuelve todos los pacientes ordenados por
    // numero de expediente (menor a mayor).
    obtenerTodosInorden(): Paciente[] {
        const resultado: Paciente[] = [];
        this.inordenRec(this.raiz, resultado);
        return resultado;
    }

    private inordenRec(nodo: NodoArbol | null, resultado: Paciente[]): void {
        if (nodo === null) {
            return;
        }
        this.inordenRec(nodo.izquierdo, resultado);
        resultado.push(nodo.paciente);
        this.inordenRec(nodo.derecho, resultado);
    }
}