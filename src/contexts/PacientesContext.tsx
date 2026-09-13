import { createContext, useContext, useRef, ReactNode } from "react";
import { ArbolPacientes, crearPaciente, Paciente, Medicamento } from "../dataStructures/ArbolPacientes";
import { Cola } from "../dataStructures/Cola";
import { SignoVital } from "../dataStructures/ListaSignosVitales";
import { mergeSort } from "../dataStructures/ordenamiento";

type PacientesContextType = {
    registrarPaciente: (expediente: number, nombre: string, telefono: string, correo: string) => void;
    buscarPaciente: (expediente: number) => Paciente | null;
    obtenerTodosPacientes: () => Paciente[];
    obtenerReporteOrdenadoPorNombre: () => Paciente[];
    agregarSignoVital: (expediente: number, signo: SignoVital) => boolean;
    agregarMedicamento: (expediente: number, medicamento: Medicamento) => boolean;
    tomarSiguienteMedicamento: (expediente: number) => Medicamento | null;
    encolarSalaDeEspera: (expediente: number) => void;
    atenderSiguientePaciente: () => number | null;
    verSalaDeEspera: () => number[];
};

const PacientesContext = createContext<PacientesContextType | null>(null);

export const usePacientes = () => {
    const context = useContext(PacientesContext);
    if (!context) {
        throw new Error("usePacientes debe usarse dentro de un PacientesProvider");
    }
    return context;
};

export const PacientesProvider = ({ children }: { children: ReactNode }) => {
    // useRef (no useState) para que el arbol y la cola se creen UNA sola
    // vez y sobrevivan entre renders. Modificarlos por dentro (insertar,
    // encolar) no dispara un re-render automatico -- por eso cada
    // pantalla debe volver a pedir los datos (ej. con obtenerTodosPacientes)
    // despues de una accion, igual que ya hacen con Supabase.
    const arbolRef = useRef(new ArbolPacientes());
    const salaDeEsperaRef = useRef(new Cola<number>()); // guarda expedientes en espera

    const registrarPaciente = (expediente: number, nombre: string, telefono: string, correo: string) => {
        const nuevoPaciente = crearPaciente(expediente, nombre, telefono, correo);
        arbolRef.current.insertar(nuevoPaciente);
    };

    const buscarPaciente = (expediente: number): Paciente | null => {
        return arbolRef.current.buscar(expediente);
    };

    const obtenerTodosPacientes = (): Paciente[] => {
        return arbolRef.current.obtenerTodosInorden();
    };

    const obtenerReporteOrdenadoPorNombre = (): Paciente[] => {
        const todos = arbolRef.current.obtenerTodosInorden();
        return mergeSort(todos, (a, b) => a.nombre.localeCompare(b.nombre));
    };

    const agregarSignoVital = (expediente: number, signo: SignoVital): boolean => {
        const paciente = arbolRef.current.buscar(expediente);
        if (!paciente) return false;
        paciente.signosVitales.insertarAlFinal(signo);
        return true;
    };

    const agregarMedicamento = (expediente: number, medicamento: Medicamento): boolean => {
        const paciente = arbolRef.current.buscar(expediente);
        if (!paciente) return false;
        paciente.medicamentosPendientes.encolar(medicamento);
        return true;
    };

    const tomarSiguienteMedicamento = (expediente: number): Medicamento | null => {
        const paciente = arbolRef.current.buscar(expediente);
        if (!paciente) return null;
        return paciente.medicamentosPendientes.desencolar();
    };

    const encolarSalaDeEspera = (expediente: number) => {
        salaDeEsperaRef.current.encolar(expediente);
    };

    const atenderSiguientePaciente = (): number | null => {
        return salaDeEsperaRef.current.desencolar();
    };

    const verSalaDeEspera = (): number[] => {
        return salaDeEsperaRef.current.obtenerTodos();
    };

    return (
        <PacientesContext.Provider
            value={{
                registrarPaciente,
                buscarPaciente,
                obtenerTodosPacientes,
                obtenerReporteOrdenadoPorNombre,
                agregarSignoVital,
                agregarMedicamento,
                tomarSiguienteMedicamento,
                encolarSalaDeEspera,
                atenderSiguientePaciente,
                verSalaDeEspera,
            }}
        >
            {children}
        </PacientesContext.Provider>
    );
};