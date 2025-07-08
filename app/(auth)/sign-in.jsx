import { styles } from "@/assets/styles/auth.styles.js";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  AppState,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants/colors";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Page() {
  const router = useRouter();

  // const { loading, setLoading, user,setUser } = useContext(AuthContext);
  // const router = useRouter();
  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const handleGoogleLogin = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError("");
  //     await authService.signInWithGoogle();
  //     // La redirection se fera automatiquement via le contexte
  //     console.log("Google sign-in completed");
  //   } catch (err) {
  //     console.error("Google Sign-In Error:", err);
  //     setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const discovery = {
  //   authorizationEndpoint:
  //     "https://hkqvjmetsklsawwyjvap.supabase.co/auth/v1/authorize",
  //   tokenEndpoint: "https://hkqvjmetsklsawwyjvap.supabase.co/auth/v1/token",
  //   revocationEndpoint:
  //     "https://hkqvjmetsklsawwyjvap.supabase.co/auth/v1/revoke",
  // };

  // useEffect(() => {
  //   if (user) {
  //     setUser(user);
  //   }
  // }, [user]);

  // new config

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((event, session) => {
  //     console.log("Event:", event, "Session:", session);
  //   });
  // }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signInWithEmail() {
    setLoading(true);
    const emailTrimmed = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailTrimmed,
      password: password,
    });
    if (data?.user) {
      console.log("Connexion réussie!", data.user);
      router.replace("/(tabs)"); // Redirection après connexion
    }
    if (error) {
      Alert.alert(error.message);
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/l4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Welcome Back</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* <TouchableOpacity
          style={styles.button}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text style={styles.buttonText}>
            {" "}
            {loading ? "Connexion..." : "Continuer avec Google"}
          </Text>
        </TouchableOpacity> */}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={email}
          placeholderTextColor={"#9A8478"}
          placeholder="Enter email"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholderTextColor={"#9A8478"}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity onPress={signInWithEmail} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href={"/sign-up"} asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
