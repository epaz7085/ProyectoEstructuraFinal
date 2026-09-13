import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { CustomButton, CustomButtonCrear } from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useAuth } from '../contexts/AuthContext';
import CustomIconCircle from '../components/CustomIconCircle';
import CustomTitle from '../components/CustomTitle';
import { useTheme } from '../contexts/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName]                       = useState("");
    const [phone, setPhone]                     = useState("");
    const [email, setEmail]                     = useState("");
    const [password, setPassword]               = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { register } = useAuth();
    const { colors } = useTheme();
    const isFormValid = (): boolean => {
        if (!name.trim()) return false;
        if (!phone.trim() || !/^\d{8,}$/.test(phone)) return false;
        if (!email.includes("@")) return false;
        if (password.length < 6) return false;
        if (password !== confirmPassword) return false;
        return true;
    };

    const handleRegister = async () => {
        if (!name.trim() || !phone.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert("Campos incompletos", "Por favor completa todos los campos.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }
        if (!isFormValid()) {
            Alert.alert("Error", "Por favor corrige los errores antes de continuar.");
            return;
        }
        await register(name, phone, email, password);
        navigation.navigate("UserTabs");
    };

    return (
        <ImageBackground
            source={require('../../assets/register.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>

                    <CustomIconCircle iconName="heartbeat" />
                    <CustomTitle title="Crear Cuenta" subtitle="Sistema de Gestión Médica" />
             
                    <CustomInput
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                        onchange={setName}
                    />
                    <CustomInput
                        type="phone"
                        placeholder="Teléfono (ej. 99999999)"
                        value={phone}
                        onchange={setPhone}
                    />
                    <CustomInput
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onchange={setEmail}
                    />
                    <CustomInput
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onchange={setPassword}
                    />
                    <CustomInput
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onchange={setConfirmPassword}
                    />

                    {confirmPassword.length > 0 && password !== confirmPassword && (
                        <Text style={styles.passwordMismatch}>Las contraseñas no coinciden</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            text="Registrarse"
                            onPress={handleRegister}
                            variant="primary"
                        />
                        <CustomButtonCrear
                            text="¿Ya tienes cuenta? Inicia sesión"
                            onPress={() => navigation.navigate("Login")}
                            variant="secondary"
                        />
                    </View>
                </View>
            </ScrollView>
            <StatusBar style="light" />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingVertical: 40,
    },
    card: {
        backgroundColor: '#2b2b2b',
        padding: 24,
        width: '100%',
        borderRadius: 15,
    },
    iconCircle: {
        backgroundColor: 'white',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
        color: '#b2b2b2',
    },
    passwordMismatch: {
        color: 'red',
        fontSize: 12,
        marginTop: -4,
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
});