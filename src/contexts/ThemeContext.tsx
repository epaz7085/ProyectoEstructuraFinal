import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeColors } from "../utils/types/ThemeColors";

type ThemeMode = "light" | "dark";

const lightColors: ThemeColors = {
  background: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#555555",
  primary: "#1b4332",
  secondary: "#52b788",
  inputBackground: "#f2f7f4",
  buttonPrimaryBg: "#1b4332",
  buttonPrimaryText: "#ffffff",
  buttonSecondaryBg: "transparent",
  buttonSecondaryText: "#52b788",
  buttonTertiaryBg: "#e8e8e8",
  buttonTertiaryText: "#1a1a1a",
  onSecondary: "#ffffff",
  tabBarBackground: "#ffffff",
  headerBackground: "#1b4332",
  headerText: "#ffffff",
  error: "#d32f2f",
  border: "#cccccc",
  card: "#f2f7f4",
};

const darkColors: ThemeColors = {
  background: "#121212",
  text: "#e0e0e0",
  textSecondary: "#a0a0a0",
  primary: "#52b788",
  secondary: "#74c69d",
  inputBackground: "#2a2a2a",
  buttonPrimaryBg: "#1b4332",
  buttonPrimaryText: "#ffffff",
  buttonSecondaryBg: "transparent",
  buttonSecondaryText: "#74c69d",
  buttonTertiaryBg: "#2a2a2a",
  buttonTertiaryText: "#e0e0e0",
  onSecondary: "#ffffff",
  tabBarBackground: "#1e1e1e",
  headerBackground: "#1e1e1e",
  headerText: "#e0e0e0",
  error: "#f78c8a",
  border: "#444444",
  card: "#2b2b2b",
};

type ThemeContextType = {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const colors = theme === "dark" ? darkColors : lightColors;
  const isDark = theme === "dark";

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};