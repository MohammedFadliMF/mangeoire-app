import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { useSignUp } from "@clerk/clerk-expo";
import { styles } from "@/assets/styles/auth.styles.js";
import { COLORS } from "@/constants/colors.js";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  // const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle submission of sign-up form
  // const onSignUpPress = async () => {
  //   if (!isLoaded) return;

  //   console.log(email, password);

  //   // Start sign-up process using email and password provided
  //   try {
  //     await signUp.create({
  //       email,
  //       password,
  //     });

  //     // Send user an email with verification code
  //     await signUp.prepareemailVerification({ strategy: "email_code" });

  //     // Set 'pendingVerification' to true to display second form
  //     // and capture OTP code
  //     setPendingVerification(true);
  //   } catch (err) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  // Handle submission of verification form
  // const onVerifyPress = async () => {
  //   if (!isLoaded) return;

  //   try {
  //     // Use the code the user provided to attempt verification
  //     const signUpAttempt = await signUp.attemptemailVerification({
  //       code,
  //     });

  //     // If verification was completed, set the session to active
  //     // and redirect the user
  //     if (signUpAttempt.status === "complete") {
  //       await setActive({ session: signUpAttempt.createdSessionId });
  //       router.replace("/");
  //     } else {
  //       // If the status is not complete, check why. User may need to
  //       // complete further steps.
  //       console.error(JSON.stringify(signUpAttempt, null, 2));
  //     }
  //   } catch (err) {
  //     // See https://clerk.com/docs/custom-flows/error-handling
  //     // for more info on error handling
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  async function signUpWithEmail() {
    setLoading(true);
    const emailTrimmed = email.trim();

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: emailTrimmed,
      password: password,
    });
    if (error) {
      Alert.alert(error.message);
      setError(error.message);
    }
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  // if (pendingVerification) {
  //   return (
  //     <View style={styles.verificationContainer}>
  //       <Text style={styles.verificationTitle}>Verify your email</Text>

  //       {true ? (
  //         <View style={styles.errorBox}>
  //           <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
  //           <Text style={styles.errorText}>{"sth went wrong"}</Text>
  //           <TouchableOpacity onPress={() => setError("")}>
  //             <Ionicons name="close" size={20} color={COLORS.textLight} />
  //           </TouchableOpacity>
  //         </View>
  //       ) : null}

  //       <TextInput
  //         style={[styles.verificationInput, error && styles.errorInput]}
  //         value={code}
  //         placeholderTextColor="#9A8478"
  //         placeholder="Enter your verification code"
  //         onChangeText={(code) => setCode(code)}
  //       />
  //       <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
  //         <Text style={styles.buttonText}>Verify</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i2.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

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

        <TouchableOpacity onPress={signUpWithEmail} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
