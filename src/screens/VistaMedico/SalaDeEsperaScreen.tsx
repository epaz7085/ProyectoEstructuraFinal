import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePacientes } from "../../contexts/PacientesContext";
import CustomInput from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import CustomTitle from "../../components/CustomTitle";

export default function SalaDeEsperaScreen() {
    const { colors } = useTheme();
    const { encolarSalaDeEspera, atenderSiguientePaciente, verSalaDeEspera, buscarPaciente } = usePacientes();

    const [expedienteNuevo, setExpedienteNuevo] = useState("");
    const [enEspera, setEnEspera] = useState<number[]>([]);

    const recargar = () => {
        setEnEspera(verSalaDeEspera());
    };

    useFocusEffect(
        useCallback(() => {
            recargar();
        }, [])
    );

    const handleAgregar = () => {
        const numero = parseInt(expedienteNuevo, 10);
        if (isNaN(numero)) {
            alert("Ingrese un numero de expediente valido");
            return;
        }
        if (!buscarPaciente(numero)) {
            alert("No existe un paciente con ese expediente. Registrelo primero.");
            return;
        }
        encolarSalaDeEspera(numero);
        setExpedienteNuevo("");
        recargar();
    };

    const handleAtender = () => {
        const expediente = atenderSiguientePaciente();
        if (expediente === null) {
            alert("No hay pacientes en espera");
        } else {
            const paciente = buscarPaciente(expediente);
            alert(`Atendiendo a: ${paciente?.nombre ?? "Expediente " + expediente}`);
        }
        recargar();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 20 }}>
            <CustomTitle title="Sala de Espera" subtitle={`${enEspera.length} paciente(s) esperando`} />

            <CustomInput type="number" placeholder="Numero de expediente" value={expedienteNuevo} onchange={setExpedienteNuevo} />
            <CustomButton text="Agregar a la sala de espera" onPress={handleAgregar} variant="primary" />
            <CustomButton text="Atender siguiente paciente" onPress={handleAtender} variant="secondary" />

            <Text style={[styles.seccion, { color: colors.text, marginTop: 20 }]}>Orden de atencion (el primero es el siguiente en pasar)</Text>
            {enEspera.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>No hay pacientes en espera.</Text>
            ) : (
                enEspera.map((expediente, i) => {
                    const paciente = buscarPaciente(expediente);
                    return (
                        <View key={i} style={[styles.card, { backgroundColor: colors.card }]}>
                            <Text style={{ color: colors.text }}>{i + 1}. {paciente?.nombre ?? "Paciente desconocido"} (expediente {expediente})</Text>
                        </View>
                    );
                })
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    seccion: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    card: { padding: 12, borderRadius: 10, marginBottom: 8 },
});