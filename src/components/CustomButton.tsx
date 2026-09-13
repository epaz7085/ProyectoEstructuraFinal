import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../utils/types/ThemeColors";

type CustomButtonProps = {
    text: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "tertiary";
}

export const CustomButton = ({ text, onPress, variant = "primary" }: CustomButtonProps) => {
    const {colors} = useTheme();
    const styles = getStyles(variant, colors);
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}


export const CustomButtonCrear = ({ text, onPress, variant = "secondary" }: CustomButtonProps) => {
    const {colors} = useTheme();
    const styles = getStyles(variant, colors);
    return ( 
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}



const getStyles = (variant: "primary" | "secondary" | "tertiary", colors: ThemeColors) => StyleSheet.create({
    button: {
        borderRadius: 15,
        backgroundColor: variant === "primary" ?colors.primary : variant === "secondary" ? "transparent" : "lightgray",
        padding: 12,
        width: 280,
        alignItems: "center",
        marginTop: 15,
        borderColor: variant === "secondary" ? colors.secondary : colors.primary,
        borderWidth: variant === "secondary" ? 2 : 0.5,
    },
    buttonText: {
    color: variant === "tertiary" ? "black" : variant === "secondary" ? colors.secondary : "white",
    fontWeight: "700",
    
},
});