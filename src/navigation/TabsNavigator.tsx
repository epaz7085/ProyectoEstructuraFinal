import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/UserSettings.tsx/ProfileScreen';
import SettingsScreen from '../screens/UserSettings.tsx/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import MedicamentosScreen from '../screens/MedicamentosScreen';
import MedicoStackNavigator from './MedicoStackNavigator';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';

type TabsParamList = {
    Profile: undefined;
    Settings: undefined;
    HomeScreen: undefined;
    Medicamentos: undefined;
    Medico: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator() {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#1b4332',
                tabBarStyle: {
                    backgroundColor: colors.tabBarBackground,
                    borderColor: colors.tabBarBackground
                },
                headerStyle: {backgroundColor: colors.headerBackground},
                headerTintColor: colors.headerText

            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                       <MaterialIcons name="home" color={color} size={size} />
                    )
                 }}
                />

            <Tab.Screen
                name="Medicamentos"
                component={MedicamentosScreen}
                options={{
                    title: 'Medicamentos',
                    tabBarIcon: ({ color, size }) => (
                       <MaterialIcons name="medical-services" color={color} size={size} />
                    )
                }}
                />

            <Tab.Screen
                name="Medico"
                component={MedicoStackNavigator}
                options={{
                    title: 'Médico',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                       <MaterialIcons name="local-hospital" color={color} size={size} />
                    )
                }}
                />

            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                       <MaterialIcons name="person" color={color} size={size} />
                    )
                 }}
                />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    title: 'Configuración',
                    tabBarIcon: ({ color, size }) => (
                       <MaterialIcons name="settings" color={color} size={size} />
                    )
                 }}
                />

        </Tab.Navigator>
    );
}