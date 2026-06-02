// screens/AccountScreen.js
import { useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

export default function AccountScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState(null);
  // "mode" decides what the form does: register (upgrade) or log in.
  const [mode, setMode] = useState("register");

  async function refreshUser() {
    const { data } = await supabase.auth.getUser();
    setAccount(data?.user ?? null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const isRegistered = account?.email ? true : false;

  // Register = upgrade the current anonymous account to an email account.
  async function createAccount() {
    const cleanEmail = email.trim();
    if (cleanEmail === "" || password.length < 6) {
      Alert.alert("Sjekk feltene", "Gyldig e-post og passord på minst 6 tegn.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.updateUser({
      email: cleanEmail,
      password: password,
    });
    setBusy(false);
    if (error) {
      console.error("Create account failed:", error.message);
      Alert.alert("Noe gikk galt", error.message);
    } else {
      setAccount(data.user);
      setPassword("");
      Alert.alert("Konto opprettet", "Nå kan du logge inn med e-posten din senere.");
    }
  }

  // Log in = switch to an existing registered account.
  async function logIn() {
    const cleanEmail = email.trim();
    if (cleanEmail === "" || password === "") {
      Alert.alert("Sjekk feltene", "Skriv e-post og passord.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });
    setBusy(false);
    if (error) {
      console.error("Login failed:", error.message);
      Alert.alert("Kunne ikke logge inn", "Sjekk e-post og passord.");
    } else {
      setAccount(data.user);
      setPassword("");
      Alert.alert("Logget inn", "Velkommen tilbake. Alt ditt er her igjen.");
    }
  }

  // Log out = sign out, then start a fresh anonymous session so the app
  // still works for someone who just wants to look around.
  async function logOut() {
    setBusy(true);
    await supabase.auth.signOut();
    await supabase.auth.signInAnonymously();
    await refreshUser();
    setEmail("");
    setPassword("");
    setBusy(false);
    Alert.alert("Logget ut", "Du er nå anonym igjen.");
  }

  // --- View for someone who is already registered & logged in ---
  if (isRegistered) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Du er logget inn.</Text>
        <Text style={styles.muted}>{account.email}</Text>
        <Text style={[styles.muted, { marginTop: spacing.lg }]}>
          Samtalene og notatene dine følger med deg, også om du bytter telefon.
        </Text>

        <Pressable
          onPress={logOut}
          disabled={busy}
          style={({ pressed }) => [
            styles.buttonOutline,
            (pressed || busy) && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonOutlineText}>
            {busy ? "Logger ut…" : "Logg ut"}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  // --- View for anonymous user: choose register OR log in ---
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.tabs}>
        <Pressable onPress={() => setMode("register")} style={styles.tab}>
          <Text style={mode === "register" ? styles.tabActive : styles.tabIdle}>
            Opprett konto
          </Text>
        </Pressable>
        <Pressable onPress={() => setMode("login")} style={styles.tab}>
          <Text style={mode === "login" ? styles.tabActive : styles.tabIdle}>
            Logg inn
          </Text>
        </Pressable>
      </View>

      <Text style={styles.intro}>
        {mode === "register"
          ? "Ta vare på det du har skrevet."
          : "Hent tilbake kontoen din."}
      </Text>
      <Text style={styles.muted}>
        {mode === "register"
          ? "Lag en konto, så følger samtalene dine med deg – også om du bytter telefon. Det er fortsatt bare ditt."
          : "Skriv inn e-posten du registrerte deg med, så er alt ditt her igjen."}
      </Text>

      <Text style={[styles.label, { marginTop: spacing.xl }]}>E-post</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="din@epost.no"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Passord</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder={mode === "register" ? "Minst 6 tegn" : "Passordet ditt"}
        placeholderTextColor={colors.textMuted}
        secureTextEntry
      />

      <Pressable
        onPress={mode === "register" ? createAccount : logIn}
        disabled={busy}
        style={({ pressed }) => [
          styles.button,
          (pressed || busy) && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          {busy
            ? "Et øyeblikk…"
            : mode === "register"
            ? "Opprett konto"
            : "Logg inn"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  tabs: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.lg,
  },
  tab: { paddingVertical: spacing.sm },
  tabActive: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  tabIdle: { color: colors.textMuted, fontSize: 16 },
  intro: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: spacing.sm,
  },
  muted: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  label: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: "700" },
  buttonOutline: {
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonOutlineText: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  buttonPressed: { opacity: 0.8 },
});