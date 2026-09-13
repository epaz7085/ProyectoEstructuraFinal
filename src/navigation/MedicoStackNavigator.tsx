import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BuscarPacienteScreen from "../screens/VistaMedico/BuscarPacienteScreen";
import HistorialPacienteScreen from "../screens/VistaMedico/HistorialPacienteScreen";
import SalaDeEsperaScreen from "../screens/VistaMedico/SalaDeEsperaScreen";
import ReportePacientesScreen from "../screens/VistaMedico/ReportePacientesScreen";

export type MedicoStackParamList = {
    BuscarPaciente: undefined;
    HistorialPaciente: { expediente: number };
    SalaDeEspera: undefined;
    ReportePacientes: undefined;
};

const Stack = createNativeStackNavigator<MedicoStackParamList>();

export default function MedicoStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen name="BuscarPaciente" component={BuscarPacienteScreen} options={{ title: "Buscar Paciente" }} />
            <Stack.Screen name="HistorialPaciente" component={HistorialPacienteScreen} options={{ title: "Historial del Paciente" }} />
            <Stack.Screen name="SalaDeEspera" component={SalaDeEsperaScreen} options={{ title: "Sala de Espera" }} />
            <Stack.Screen name="ReportePacientes" component={ReportePacientesScreen} options={{ title: "Reporte de Pacientes" }} />
        </Stack.Navigator>
    );
}