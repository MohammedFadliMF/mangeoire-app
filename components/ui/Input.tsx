import React from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { CColors } from "../../constants/CColors";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={[styles.container]}>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={CColors.light.icon}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: CColors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: CColors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: CColors.light.background,
  },
  inputError: {
    borderColor: CColors.light.error,
  },
  error: {
    color: CColors.light.error,
    fontSize: 14,
    marginTop: 4,
  },
});
