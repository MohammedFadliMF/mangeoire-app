import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { CColors } from "../../constants/CColors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const buttonTextStyle = [styles.text, styles[`${variant}Text`], textStyle];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primary: {
    backgroundColor: CColors.light.tint,
  },
  primaryText: {
    color: "#fff",
  },
  secondary: {
    backgroundColor: CColors.light.card,
    borderWidth: 1,
    borderColor: CColors.light.border,
  },
  secondaryText: {
    color: CColors.light.text,
  },
  danger: {
    backgroundColor: CColors.light.error,
  },
  dangerText: {
    color: "#fff",
  },
  disabled: {
    opacity: 0.5,
  },
});
