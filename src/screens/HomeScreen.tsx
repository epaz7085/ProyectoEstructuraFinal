import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

import { useAuth } from "../contexts/AuthContext";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../services/supabase";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setUserProfile } from "../store/userProfileSlice";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { generarReportePDF } from "../services/reportPDF";

type Medicamento = {
    id: string;
    nombre: string;
    dosis: string;
    horario: string;
    dias: string;
};

export default function HomeScreen() {

    const [presion, setPresion] = useState("");
    const [glucosa, setGlucosa] = useState("");
    const [peso, setPeso] = useState("");
    const [signosVitales, setSignosVitales] = useState<{presion: string, glucosa: string, peso: string} | null>(null);
    const [modalSignos, setModalSignos] = useState(false);
    const { user } = useAuth();
    const dispatch = useDispatch();
    const userProfile = useSelector((state: RootState) => state.userProfile);

useEffect(() => {
    if (user?.email) {
        dispatch(setUserProfile({ email: user.email, displayName: user.email }));
    }
}, [user]);
    
    const { colors } = useTheme();

    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

    const cargar = async () => {
    const { data } = await supabase
        .from("Medicamentos")
        .select("*")
        .eq("user_id", user?.id);
        if (data) setMedicamentos(data);
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

    const guardarSignos = async () => {
    if (!presion.trim() || !glucosa.trim() || !peso.trim()) {
        alert("Complete todos los campos");
        return;
    }

        const hoy = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from("signos_vitales")
            .select("id")
            .eq("user_id", user?.id)
            .gte("fecha", `${hoy}T00:00:00`)
            .lte("fecha", `${hoy}T23:59:59`)
            .maybeSingle();

        if (data) {
            const { error: updateError } = await supabase
                .from("signos_vitales")
                .update({ presion, glucosa, peso })
                .eq("id", data.id);
            console.log("id a actualizar:", data.id);
            console.log("error update:", updateError);
        } else {
            console.log("no encontró registro, insertando");
            const { error: insertError } = await supabase
                .from("signos_vitales")
                .insert({ user_id: user?.id, presion, glucosa, peso });
            console.log("error insert:", insertError);
        }

        
        setSignosVitales({ presion, glucosa, peso });
        setModalSignos(false);
        setPresion(""); setGlucosa(""); setPeso("");
    };

    useFocusEffect(
        useCallback(() => {
            cargar();
            cargarSignos();
        }, [user?.id])
    );


    
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>{i18n.t('welcome')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{user?.email}</Text> 


            <Text style={[styles.sectionTitle, { color: colors.text }]}>Medicamentos de hoy</Text>

            {medicamentos.length === 0 ? (
                <Text style={{ color: colors.textSecondary }}>No tienes medicamentos registrados</Text>
            ) : (
                medicamentos.map((med) => (
                    <View key={med.id} style={[styles.card, { backgroundColor: colors.card }]}>
                        <Text style={{ color: colors.text, fontWeight: '500' }}>{med.nombre}</Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{med.dosis} · {med.horario}</Text>
                    </View>
                ))
            )}

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Signos vitales</Text>

            {signosVitales ? (
                <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                    <View style={[styles.card, { backgroundColor: colors.card, flex: 1, alignItems: 'center' }]}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Presión</Text>
                        <Text style={{ color: colors.text, fontWeight: '500' }}>{signosVitales.presion}</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: colors.card, flex: 1, alignItems: 'center' }]}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Glucosa</Text>
                        <Text style={{ color: colors.text, fontWeight: '500' }}>{signosVitales.glucosa}</Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: colors.card, flex: 1, alignItems: 'center' }]}>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Peso</Text>
                        <Text style={{ color: colors.text, fontWeight: '500' }}>{signosVitales.peso}</Text>
                    </View>
                </View>
            ) : (
                <Text style={{ color: colors.textSecondary }}>No tienes signos vitales registrados</Text>
            )}


            <TouchableOpacity 
                onPress={() => setModalSignos(true)}
                style={[styles.card, { backgroundColor: colors.primary, alignItems: 'center' }]}
            >
                <Text style={{ color: 'white', fontWeight: '500' }}>+ Registrar signos</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => generarReportePDF(user?.email ?? "", medicamentos, signosVitales)}
                style={[styles.card, { backgroundColor: colors.secondary, alignItems: "center" }]}
            >
  <Text style={{ color: "white", fontWeight: "500" }}>Exportar reporte PDF</Text>
</TouchableOpacity>

            <Modal visible={modalSignos} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Registrar signos vitales</Text>
                        <TextInput placeholder="Presión (ej. 120/80)" value={presion} onChangeText={setPresion} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholderTextColor={colors.textSecondary} />
                        <TextInput placeholder="Glucosa (ej. 90 mg/dL)" value={glucosa} onChangeText={setGlucosa} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholderTextColor={colors.textSecondary} />
                        <TextInput placeholder="Peso (ej. 70 kg)" value={peso} onChangeText={setPeso} style={[styles.input, { color: colors.text, borderColor: colors.border }]} placeholderTextColor={colors.textSecondary} />
                        <TouchableOpacity onPress={guardarSignos} style={[styles.saveButton, { backgroundColor: colors.primary }]}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalSignos(false)}>
                            <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 10 }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: 'flex-start',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    },
    card: {
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        width: '100%',
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