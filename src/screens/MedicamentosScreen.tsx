import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";

type Medicamento = {
    id: string;
    nombre: string;
    dosis: string;
    horario: string;
    dias: string;
};



export default function MedicamentosScreen() {
    const [tomadasHoy, setTomadasHoy] = useState<string[]>([]);
    const [signosVitales, setSignosVitales] = useState<{presion: string, glucosa: string, peso: string} | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [nombre, setNombre] = useState("");
    const [dosis, setDosis] = useState("");
    const [horario, setHorario] = useState("");
    const [dias, setDias] = useState("");

    const { colors } = useTheme();
    const { user } = useAuth();
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

    const agregarMedicamento = async () => {
    if (!nombre.trim() || !dosis.trim() || !horario.trim() || !dias.trim()){
        alert("Complete todos los campos");
        return;
    }
    const { error } = await supabase
        .from("Medicamentos")
        .insert({
            user_id: user?.id,  
            nombre,
            dosis,
            horario,
            dias,
        });
    if (!error) {
        setModalVisible(false);
        setNombre(""); setDosis(""); setHorario(""); setDias("");
        cargarMedicamentos();
    }
};

    const cargarTomasHoy = async () => {
        const hoy = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from("tomas")
            .select("medicamento_id")
            .eq("user_id", user?.id)
            .gte("fecha", `${hoy}T00:00:00`)
            .lte("fecha", `${hoy}T23:59:59`);
        if (data) setTomadasHoy(data.map(t => t.medicamento_id));
    };

    const eliminarMedicamento = async (id: string) => {
        console.log("eliminando id:", id);
    const { error } = await supabase
        .from("Medicamentos")
        .delete()
        .eq("id", id);
    if (!error) cargarMedicamentos();
    };

    const confirmarToma = async (medicamentoId: string) => {
        const { error } = await supabase
            .from("tomas")
            .insert({
                user_id: user?.id,
                medicamento_id: medicamentoId,
                tomado: true,
            });
        
        if (!error) {
            alert("Toma registrada correctamente");
            cargarTomasHoy();
        }
    };  

    const cargarSignos = async () => {
        const { data } = await supabase
            .from("signos_vitales")
            .select("*")
            .eq("user_id", user?.id)
            .order("fecha", { ascending: false })
            .limit(1)
            .single();
        if (data) setSignosVitales(data);
    };

    const cargarMedicamentos = async () => {
        const { data, error } = await supabase
            .from("Medicamentos")
            .select("*")
            .eq("user_id", user?.id); 
        if (!error && data) {
            setMedicamentos(data);
        }
    };

    useEffect(() => {
        cargarMedicamentos();
        cargarTomasHoy();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.addButton, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="add" color="white" size={28} />
                
            </TouchableOpacity>


            <Modal visible={modalVisible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Agregar medicamento</Text>
                    
                    <TextInput placeholder="Nombre" value={nombre}
                               onChangeText={setNombre} style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
                               placeholderTextColor={colors.textSecondary} />

                    <TextInput placeholder="Dosis (ej. 500mg)" value={dosis} onChangeText={setDosis} style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
                               placeholderTextColor={colors.textSecondary} 
                    />

                    <TextInput placeholder="Horario (ej. 8:00 AM)" value={horario} onChangeText={setHorario} style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
                               placeholderTextColor={colors.textSecondary}
                    />

                    <TextInput placeholder="Días (ej. Diario)" value={dias} onChangeText={setDias} style={[styles.input, { color: colors.text, borderColor: colors.border }]} 
                               placeholderTextColor={colors.textSecondary} 
                    />
                    
                    <TouchableOpacity onPress={agregarMedicamento} style={[styles.saveButton, { backgroundColor: colors.primary }]}>
                        <Text style={{ color: 'white', fontWeight: '500' }}>Guardar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 10 }}>Cancelar</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </Modal>






            <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
                {medicamentos.map((med) => (
                    <View key={med.id} style={[styles.card, { backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View>
                            <Text style={[styles.nombre, { color: colors.text }]}>{med.nombre}</Text>
                            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{med.dosis} · {med.horario} · {med.dias}</Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity 
                                onPress={() => confirmarToma(med.id)}
                                disabled={tomadasHoy.includes(med.id)}
                            >
                                <MaterialIcons 
                                    name="check-circle" 
                                    color={tomadasHoy.includes(med.id) ? colors.textSecondary : colors.secondary} 
                                    size={22} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => eliminarMedicamento(med.id)}>
                                <MaterialIcons name="delete" color={colors.error} size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    nombre: {
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 4,
    },
    addButton: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 15,
    },
    saveButton: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 4,
    },
});