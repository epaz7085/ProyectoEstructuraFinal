import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../utils/translation";
type Language = "en" | "es";

type LanguageContextType = {    
    language: Language;
    fallbackLanguage: Language;
    changeLanguage: (lang: Language) => void;
};

const i18n = new I18n(translations);
i18n.defaultLocale = "en";
i18n.enableFallback = true;

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};


export const LanguageProvider = ({ children }: {children: React.ReactNode}) => {
    const [language, setLanguage] = useState<Language>(i18n.defaultLocale as Language);

    useEffect(() => {
        const loadLanguage = async () => {
            const storedLanguage = await AsyncStorage.getItem("language");
            if (storedLanguage) {
                setLanguage(storedLanguage as Language);
                i18n.locale = storedLanguage;
            }else {
                i18n.locale = i18n.defaultLocale;
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (lang: Language) => {
        await AsyncStorage.setItem("language", lang);
        setLanguage(lang);
        i18n.locale = lang;
    }

    return (
        <LanguageContext.Provider value={{ language, fallbackLanguage: "en", changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    )};

    export { i18n };