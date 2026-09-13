import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View, Text, StyleSheet, KeyboardType } from "react-native";

type InputType = 'password' | 'email' | 'text' | 'phone' | 'number';

type Props = {
    type: InputType;
    placeholder: string;
    value: string;
    onchange: (text: string) => void;
    inputStyle?: object;
};

export default function CustomInput({ type, placeholder, value, onchange, inputStyle }: Props) {

    const [isSecureText, setIsSecureText] = useState(type === "password");
    const isPasswordType = type === "password";

    const getError = (): string | undefined => {
        if (type === "email" && value.length > 0 && !value.includes("@")) {
            return "El correo no es válido";
        }
        if (type === "password" && value.length > 0 && value.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
        if (type === "phone" && value.length > 0 && !/^\d{8,}$/.test(value)) {
            return "El teléfono debe tener al menos 8 dígitos";
        }
        if (type === "text" && value.length > 0 && /\d/.test(value)) {
            return "El nombre no debe contener números";
        }
        if (type === "number" && value.length > 0 && !/^\d+$/.test(value)) {
            return "Debe ser un número";
        }
        return undefined;
    };

    const error = getError();

    const keyboardType: KeyboardType =
        type === "email" ? "email-address" :
        type === "phone" ? "phone-pad" :
        type === "number" ? "number-pad" :
        "default";

    const icon =
        type === "email"    ? "mail-outline" :
        type === "password" ? "lock-closed-outline" :
        type === "phone"    ? "call-outline" :
        type === "number"   ? "keypad-outline" :
        "person-outline";

    return (
        <View style={styles.wrapper}>
            <View style={[styles.inputContainer, error ? styles.inputErrorBorder : null]}>
                <Ionicons name={icon as any} size={14} color="#b2b2b2" />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#b2b2b2"
                    value={value}
                    onChangeText={onchange}
                    style={[styles.input, inputStyle]}
                    secureTextEntry={isSecureText}
                    keyboardType={keyboardType}
                />
                {isPasswordType && (
                    <TouchableOpacity onPress={() => setIsSecureText(!isSecureText)}>
                        <Ionicons name={isSecureText ? "eye" : "eye-off"} size={14} color="#b2b2b2" />
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -5,
        borderColor: '#555555',
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: 'transparent',
        paddingLeft: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        color: '#b2b2b2',
    },
    inputErrorBorder: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});