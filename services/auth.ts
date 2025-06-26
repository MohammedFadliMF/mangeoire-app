import { supabase } from "@/utils/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

class AuthService {
  // Connexion avec Google
  async signInWithGoogle() {
    try {
      console.log("Starting Google Sign-In...");
      // const redirectUrl =
      //   "https://hkqvjmetsklsawwyjvap.supabase.co/auth/v1/callback";

      // const redirectUrl = Linking.createURL("/auth/callback");

      const redirectUrl = makeRedirectUri({
        scheme: "exp",
        path: "auth/callback",
      });
      // const redirectUrl = makeRedirectUri();

      console.log("Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("Supabase OAuth error:", error);
        throw error;
      }

      console.log("OAuth data:", data);

      // Ouvrir le navigateur pour l'authentification
      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log("WebBrowser result:", result);
        // console.log("WebBrowser result:", result.type);

        // if (result.type === "success") {
        //   // L'authentification s'est bien passée
        //   // La session sera automatiquement mise à jour via onAuthStateChange
        //   return result;
        // } else if (result.type === "cancel") {
        //   throw new Error("Authentication was cancelled");
        // } else {
        //   throw new Error("Authentication failed");
        // }
        // Après fermeture du navigateur, vérifiez la session
        if (result.type === "dismiss" || result.type === "cancel") {
          // Attendez un peu que Supabase traite l'authentification
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Vérifiez si l'utilisateur est maintenant connecté
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError) {
            console.error("Error getting session:", sessionError);
            throw sessionError;
          }

          if (sessionData.session) {
            console.log("Authentication successful:", sessionData.session);
            return sessionData;
          } else {
            throw new Error("Authentication failed or was cancelled");
          }
        }

        if (result.type === "success") {
          return result;
        }
      } else {
        throw new Error("No OAuth URL received");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }

  // Connexion avec email/password
  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  }

  // Inscription
  async signUp(email: string, password: string, name?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  // Déconnexion
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }


}

export const authService = new AuthService();
