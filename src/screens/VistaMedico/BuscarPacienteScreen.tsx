import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { usePacientes } from "../../contexts/PacientesContext";
import CustomInput from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import CustomTitle from "../../components/CustomTitle";
import { Paciente } from "../../dataStructures/ArbolPacientes";

export default function BuscarPacienteScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { buscarPaciente, registrarPaciente } = usePacientes();

    const [expedienteBusqueda, setExpedienteBusqueda] = useState("");
    const [resultado, setResultado] = useState<Paciente | null>(null);
    const [buscoAlMenosUnaVez, setBuscoAlMenosUnaVez] = useState(false);

    const [expedienteNuevo, setExpedienteNuevo] = useState("");
    const [nombreNuevo, setNombreNuevo] = useState("");
    const [telefonoNuevo, setTelefonoNuevo] = useState("");
    const [correoNuevo, setCorreoNuevo] = useState("");

    const handleBuscar = () => {
        const numero = parseInt(expedienteBusqueda, 10);
        if (isNaN(numero)) {
            alert("Ingrese un numero de expediente valido");
            return;
        }
        const paciente = buscarPaciente(numero);
        setResultado(paciente);
        setBuscoAlMenosUnaVez(true);
    };

    const handleRegistrar = () => {
        const numero = parseInt(expedienteNuevo, 10);
        if (isNaN(numero) || !nombreNuevo.trim()) {
            alert("Complete al menos el expediente y el nombre");
            return;
        }
        if (buscarPaciente(numero)) {
            alert("Ya existe un paciente con ese numero de expediente");
            return;
        }
        registrarPaciente(numero, nombreNuevo, telefonoNuevo, correoNuevo);
        alert("Paciente registrado correctamente");
        setExpedienteNuevo("");
        setNombreNuevo("");
        setTelefonoNuevo("");
        setCorreoNuevo("");
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 20 }}>
            <CustomTitle title="Buscar Paciente" subtitle="Ingrese el numero de expediente" />

            <CustomInput
                type="number"
                placeholder="Numero de expediente"
                value={expedienteBusqueda}
                onchange={setExpedienteBusqueda}
            />
            <CustomButton text="Buscar" onPress={handleBuscar} variant="primary" />

            {buscoAlMenosUnaVez && (
                resultado ? (
                    <View style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
                        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 16 }}>{resultado.nombre}</Text>
                        <Text style={{ color: colors.textSecondary }}>Expediente: {resultado.expediente}</Text>
                        <Text style={{ color: colors.textSecondary }}>Telefono: {resultado.telefono}</Text>
                        <Text style={{ color: colors.textSecondary }}>Correo: {resultado.correo}</Text>

                        <CustomButton
                            text="Ver historial completo"
                            onPress={() => navigation.navigate("HistorialPaciente", { expediente: resultado.expediente })}
                            variant="secondary"
                        />
                    </View>
                ) : (
                    <Text style={{ color: colors.error, marginTop: 16 }}>No se encontro ningun paciente con ese expediente.</Text>
                )
            )}

            <View style={{ marginTop: 40 }}>
                <CustomTitle title="Registrar paciente nuevo" />

                <CustomInput type="number" placeholder="Numero de expediente" value={expedienteNuevo} onchange={setExpedienteNuevo} />
                <CustomInput type="text" placeholder="Nombre completo" value={nombreNuevo} onchange={setNombreNuevo} />
                <CustomInput type="phone" placeholder="Telefono" value={telefonoNuevo} onchange={setTelefonoNuevo} />
                <CustomInput type="email" placeholder="Correo electronico" value={correoNuevo} onchange={setCorreoNuevo} />

                <CustomButton text="Registrar paciente" onPress={handleRegistrar} variant="primary" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { padding: 16, borderRadius: 12 },
});