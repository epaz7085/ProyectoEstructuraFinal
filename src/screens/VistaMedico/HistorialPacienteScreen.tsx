import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { usePacientes } from "../../contexts/PacientesContext";
import CustomInput from "../../components/CustomInput";
import { CustomButton } from "../../components/CustomButton";
import CustomTitle from "../../components/CustomTitle";
import { Paciente } from "../../dataStructures/ArbolPacientes";
import { SignoVital } from "../../dataStructures/ListaSignosVitales";

export default function HistorialPacienteScreen({ route }: any) {
    const { expediente } = route.params;
    const { colors } = useTheme();
    const { buscarPaciente, agregarSignoVital, agregarMedicamento, tomarSiguienteMedicamento } = usePacientes();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [signos, setSignos] = useState<SignoVital[]>([]);
    const [medicamentos, setMedicamentos] = useState<{ nombre: string; dosis: string; horario: string; dias: string }[]>([]);

    const [presion, setPresion] = useState("");
    const [glucosa, setGlucosa] = useState("");
    const [peso, setPeso] = useState("");

    const [nombreMed, setNombreMed] = useState("");
    const [dosisMed, setDosisMed] = useState("");
    const [horarioMed, setHorarioMed] = useState("");
    const [diasMed, setDiasMed] = useState("");

    const recargar = () => {
        const p = buscarPaciente(expediente);
        setPaciente(p);
        if (p) {
            setSignos(p.signosVitales.obtenerTodos());
            setMedicamentos(p.medicamentosPendientes.obtenerTodos());
        }
    };

    useFocusEffect(
        useCallback(() => {
            recargar();
        }, [expediente])
    );

    const handleAgregarSigno = () => {
        if (!presion.trim() || !glucosa.trim() || !peso.trim()) {
            alert("Complete todos los campos de signos vitales");
            return;
        }
        const fecha = new Date().toLocaleDateString("es-HN");
        agregarSignoVital(expediente, { fecha, presion, glucosa, peso });
        setPresion(""); setGlucosa(""); setPeso("");
        recargar();
    };

    const handleAgregarMedicamento = () => {
        if (!nombreMed.trim() || !dosisMed.trim() || !horarioMed.trim() || !diasMed.trim()) {
            alert("Complete todos los campos del medicamento");
            return;
        }
        agregarMedicamento(expediente, { nombre: nombreMed, dosis: dosisMed, horario: horarioMed, dias: diasMed });
        setNombreMed(""); setDosisMed(""); setHorarioMed(""); setDiasMed("");
        recargar();
    };

    const handleTomarMedicamento = () => {
        const tomado = tomarSiguienteMedicamento(expediente);
        if (tomado) {
            alert(`Se registro la toma de: ${tomado.nombre}`);
        } else {
            alert("No hay medicamentos pendientes");
        }
        recargar();
    };

    if (!paciente) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background, padding: 20 }]}>
                <Text style={{ color: colors.error }}>Paciente no encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ padding: 20 }}>
            <CustomTitle title={paciente.nombre} subtitle={`Expediente ${paciente.expediente}`} />

            <Text style={[styles.seccion, { color: colors.text }]}>Historial de Signos Vitales</Text>
            {signos.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>Sin registros aun.</Text>
            ) : (
                signos.map((s, i) => (
                    <View key={i} style={[styles.card, { backgroundColor: colors.card }]}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{s.fecha}</Text>
                        <Text style={{ color: colors.text }}>Presion: {s.presion} · Glucosa: {s.glucosa} · Peso: {s.peso}</Text>
                    </View>
                ))
            )}

            <CustomInput type="text" placeholder="Presion (ej. 120/80)" value={presion} onchange={setPresion} />
            <CustomInput type="text" placeholder="Glucosa (ej. 90 mg/dL)" value={glucosa} onchange={setGlucosa} />
            <CustomInput type="text" placeholder="Peso (ej. 70 kg)" value={peso} onchange={setPeso} />
            <CustomButton text="Registrar signo vital" onPress={handleAgregarSigno} variant="primary" />

            <Text style={[styles.seccion, { color: colors.text, marginTop: 30 }]}>Medicamentos Pendientes</Text>
            {medicamentos.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>Sin medicamentos pendientes.</Text>
            ) : (
                medicamentos.map((m, i) => (
                    <View key={i} style={[styles.card, { backgroundColor: colors.card }]}>
                        <Text style={{ color: colors.text }}>{m.nombre} - {m.dosis}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{m.horario} · {m.dias}</Text>
                    </View>
                ))
            )}

            <CustomInput type="text" placeholder="Nombre del medicamento" value={nombreMed} onchange={setNombreMed} />
            <CustomInput type="text" placeholder="Dosis (ej. 500mg)" value={dosisMed} onchange={setDosisMed} />
            <CustomInput type="text" placeholder="Horario (ej. 8:00 AM)" value={horarioMed} onchange={setHorarioMed} />
            <CustomInput type="text" placeholder="Dias (ej. Diario)" value={diasMed} onchange={setDiasMed} />
            <CustomButton text="Agregar medicamento" onPress={handleAgregarMedicamento} variant="primary" />

            {medicamentos.length > 0 && (
                <CustomButton text="Marcar el primero como tomado" onPress={handleTomarMedicamento} variant="secondary" />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    seccion: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
    card: { padding: 12, borderRadius: 10, marginBottom: 8 },
});