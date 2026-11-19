import { z } from "zod";

const envSchema = z.object({
    VITE_APP_ENV: z
        .enum(["development", "staging", "production", "test"])
        .default("development"),
    VITE_API_URL: z
        .string()
        .url("VITE_API_URL doit être une URL valide (ex: https://mondomaine.com)"),
    VITE_APP_NAME: z.string().min(1).default("MyApp"),
    VITE_ENABLE_DEBUG: z
        .enum(["true", "false"])
        .default("false")
        .transform((val) => val === "true"),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown>): AppEnv {
    const parsed = envSchema.safeParse(rawEnv);

    if (!parsed.success) {
        const formattedErrors = parsed.error.issues
            .map((issue) => ` - ${issue.path.join(".")}: ${issue.message}`)
            .join("\n");

        throw new Error(`
            Configuration frontend (.env) invalide :\n${formattedErrors}`
        );
    }
    return parsed.data;
} 

// Validation automatique au démarrage de l'application (hors environnement de test unitaire)
export const env: AppEnv = 
    import.meta.env.MODE === "test"
        ? {
            VITE_APP_ENV: "test",
            VITE_API_URL: "http://localhost:3000/api",
            VITE_APP_NAME: "MyAppTest",
            VITE_ENABLE_DEBUG: false,
        }
        : validateEnv(import.meta.env);
