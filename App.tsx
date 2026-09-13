import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { navigationRef } from './src/navigation/NavigationService';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { PacientesProvider } from './src/contexts/PacientesContext';
import { Provider } from 'react-redux';
import { store } from './src/store';

export default function App() {
    return (
    <Provider store={store}>
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <PacientesProvider>
                        <NavigationContainer ref={navigationRef}>
                            <StackNavigator />
                        </NavigationContainer>
                    </PacientesProvider>
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
     </Provider>
    );
}