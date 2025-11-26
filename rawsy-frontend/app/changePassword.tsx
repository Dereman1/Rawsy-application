import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Appbar, useTheme as usePaperTheme } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!token) return Alert.alert("Error", "You are not logged in.");
    if (!oldPassword || !newPassword || !confirmPassword) return Alert.alert("Error", "All fields are required");
    if (newPassword !== confirmPassword) return Alert.alert("Error", "New password and confirm password do not match");

    try {
      setLoading(true);
      const res = await fetch("http://10.19.18.42:4000/api/auth/me/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data: { message?: string; error?: string } = await res.json();

      if (!res.ok) {
        return Alert.alert("Error", data.error || "Something went wrong");
      }

      Alert.alert("Success", data.message || "Password changed successfully");

      // Reset fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={!showOld}
          right={<TextInput.Icon icon={showOld ? "eye-off" : "eye"} onPress={() => setShowOld(!showOld)} />}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: paperTheme.colors.onSurface, primary: paperTheme.colors.primary } }}
        />

        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          right={<TextInput.Icon icon={showNew ? "eye-off" : "eye"} onPress={() => setShowNew(!showNew)} />}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: paperTheme.colors.onSurface, primary: paperTheme.colors.primary } }}
        />

        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          right={<TextInput.Icon icon={showConfirm ? "eye-off" : "eye"} onPress={() => setShowConfirm(!showConfirm)} />}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { text: paperTheme.colors.onSurface, primary: paperTheme.colors.primary } }}
        />

        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Change Password
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  input: { marginBottom: 16 },
  button: { marginTop: 16, paddingVertical: 8 },
});
