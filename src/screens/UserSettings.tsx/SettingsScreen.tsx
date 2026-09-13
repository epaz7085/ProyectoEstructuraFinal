import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { CustomButton } from "../../components/CustomButton";
import { i18n, useLanguage } from "../../contexts/LanguageContext";

export default function SettingsScreen() {
  const { colors, toggleTheme, theme, isDark } = useTheme();
const { changeLanguage, language } = useLanguage();
  return (
    
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.section, { backgroundColor: colors.inputBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Apariencia</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>
          Tema actual: {isDark ? "Oscuro" : "Claro"}
        </Text>
        <Switch
          onValueChange={toggleTheme}
          thumbColor={colors.onSecondary}
          value={isDark} 
        />
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Idioma</Text>
        <Text style={[styles.sectionText, { color: colors.text }]}>Idioma actual: {language}</Text>
                    <Switch
                        onValueChange={() => changeLanguage(language === 'en' ? 'es' : 'en')}
                        thumbColor={colors.onSecondary}
                        value={language === 'es'}
        />
        
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 8,
  },
});