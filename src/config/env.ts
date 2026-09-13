const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Falta la variable de entorno ${key}`);
    return "";
  }
  return value;
};

export const env = {
  supabaseUrl: getEnvVar("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnvVar("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
} as const;