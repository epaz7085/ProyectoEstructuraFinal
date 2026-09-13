import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePacientes } from "../../contexts/PacientesContext";
import CustomTitle from "../../components/CustomTitle";
import { Paciente } from "../../dataStructures/ArbolPacientes";

export default function ReportePacientesScreen() {
    const { colors } = useTheme();
    const { obtenerReporteOrdenadoPorNombre } = usePacientes();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    useFocusEffect(
        useCallback(() => {
            setPacientes(obtenerReporteOrdenadoPorNombre());
        }, [])
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 20 }}>
            <CustomTitle title="Reporte de Pacientes" subtitle="Ordenado alfabeticamente por nombre" />

            {pacientes.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>No hay pacientes registrados todavia.</Text>
            ) : (
                pacientes.map((p) => (
                    <View key={p.expediente} style={[styles.card, { backgroundColor: colors.card }]}>
                        <Text style={{ color: colors.text, fontWeight: "600" }}>{p.nombre}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                            Expediente: {p.expediente} · Signos registrados: {p.signosVitales.contarRegistros()} · Medicamentos pendientes: {p.medicamentosPendientes.contarElementos()}
                        </Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { padding: 14, borderRadius: 12, marginBottom: 10 },
});