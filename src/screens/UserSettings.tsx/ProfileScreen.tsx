import { View, Text, StyleSheet, ScrollView } from "react-native";
import { CustomButton } from "../../components/CustomButton";
import { navigationRef } from "../../navigation/NavigationService";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import CustomIconCircle from "../../components/CustomIconCircle";

export default function ProfileScreen({navigation}: any) {
    const {user, logout} = useAuth(); 
    const { colors } = useTheme();

    const handleLogout = () => {
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        
            <View style={[styles.cardTop, { backgroundColor: colors.primary }]}> 
                <View style={styles.initialsCircle}>
                    <Text style={[styles.initialsText, { color: colors.primary }]}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginTop: 10 }}>{user?.name}</Text>
                <Text style={{ color: 'white', fontSize: 13, marginTop: 4 }}>{user?.email}</Text>
            </View>

            <View style={{ padding: 20 }}>
                <View style={[styles.card, { backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                    <View style={styles.smallIconCircle}>
                        <CustomIconCircle iconName="user" />
                    </View>
                    <View>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "bold"}}>Nombre</Text>
                        <Text style={[styles.label, { color: colors.text }]}>{user?.name}</Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                    <View style={styles.smallIconCircle}>
                        <CustomIconCircle iconName="phone" />
                    </View>
                    <View>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "bold"}}>Teléfono</Text>
                        <Text style={[styles.label, { color: colors.text }]}>{user?.phone}</Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                    <View style={styles.smallIconCircle}>
                        <CustomIconCircle iconName="envelope" />
                    </View>
                    <View>
                        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "bold" }}>Correo</Text>
                        <Text style={[styles.label, { color: colors.text }]}>{user?.email}</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <CustomButton
                    text="Cerrar Sesión"
                    onPress={handleLogout}
                    variant="secondary"
                />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 0,
    },
    card: {
        padding: -5,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTop: {
        paddingVertical: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    initialsCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontSize: 28,
        fontWeight: '500',
    },
    smallIconCircle: {
        transform: [{ scale: 0.7 }],
    },
});