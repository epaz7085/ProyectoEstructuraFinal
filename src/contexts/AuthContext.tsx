import { createContext, useState, ReactNode, useContext } from "react";
import { supabase } from "../services/supabase";

/**npm i npm i i18n@0.15.3 i18n-js@^4.5.1
 * npm install
 * npm i @react-native-async-storage/async-storage@2.2.0
 */

// Tipado de usuario para el contexto de autenticación
type User = {
    id: string; 
    name: string;
    phone: string;
    email: string;
    password: string;
} | null;

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, phone: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: {children: ReactNode}) => {
        const [user, setUser] = useState<User | null>(null);

        const login = async (email: string, password: string): Promise<boolean> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log("data.user:", data.user);          // ← agrega estas dos líneas
        console.log("user_metadata:", data.user?.user_metadata);
        if (error || !data.user) return false;

        setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || "",
            phone: data.user.user_metadata?.phone || "",
            email: data.user.email || "",
            password: "",
        });
        return true;
    };
    const logout = () => {
        setUser(null);
    }

    const register = async (name: string, phone: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, phone } }
        });
        if (!error && data.user) {
            setUser({id: data.user.id, name, phone, email, password: "" });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
} 
