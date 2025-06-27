import SafeScreen from "@/components/SafeScreen";
import { supabase } from "@/utils/supabase";
import { Redirect, Slot } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import {Text,} from "react-native";
// Créer un contexte Auth
export const AuthContext = createContext(null);

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Récupérer la session au chargement
  //   const getSession = async () => {
  //     try {
  //       const { data, error } = await supabase.auth.getSession();
  //       if (error) {
  //         console.error("Error getting session:", error);
  //       } else {
  //         console.log(
  //           "Initial session:",
  //           data.session?.user?.email || "No session"
  //         );
  //         setSession(data.session);
  //         setUser(data.session?.user ?? null);
  //       }
  //     } catch (error) {
  //       console.error("Error getting session:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getSession();

  //   // Écouter les changements de session (connexion, déconnexion)
  //   const {data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log(
  //       "Auth state changed:",
  //       event,
  //       session?.user?.email || "No user"
  //     );
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setLoading(false);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("getSession:", session);
      setSession(session);
      setUser(session?.user ?? null); // <-- Ajoute cette ligne
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("onAuthStateChange:", session);
      setSession(session);
      setUser(session?.user ?? null); // <-- Ajoute cette ligne
      setLoading(false);
    });
    // Nettoyer la souscription à la destruction du composant
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const authValues = {
    session,
    user,
    setUser,
    setSession,
    loading,
  };

  // if (loading) {
  //   return (
  //     <SafeScreen>
  //       <React.Fragment>
  //         <Text style={{ textAlign: "center", marginTop: 40 }}>
  //           Chargement...
  //         </Text>
  //       </React.Fragment>
  //     </SafeScreen>
  //   );
  // }
  // if (!user) return <Redirect href="/(auth)/sign-in" />;
  // Redirige vers les tabs après connexion
  return (
    <AuthContext.Provider value={authValues}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthContext.Provider>
  );
}
