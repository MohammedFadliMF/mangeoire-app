import SafeScreen from "@/components/SafeScreen";
import { supabase } from "@/utils/supabase";
import { Slot } from "expo-router";
import React, { createContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

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
      setSession(session);
      setUser(session?.user ?? null); // <-- Ajoute cette ligne
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null); // <-- Ajoute cette ligne
      setLoading(false);
    });
  }, []);

  const authValues = {
    session,
    user,
    setUser,
    setSession,
    loading,
  };

  return (
    <AuthContext.Provider value={authValues}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </AuthContext.Provider>
  );
}
