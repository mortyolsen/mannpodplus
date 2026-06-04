// screens/AccountScreen.js
import { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

export default function AccountScreen({ navigation }) {
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

      // Translate common Supabase errors into friendly Norwegian.
      let friendly = error.message;
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("too many")) {
        friendly =
          "Vi har sendt for mange e-poster på kort tid. Prøv igjen om en times tid.";
      } else if (msg.includes("already") || msg.includes("registered")) {
        friendly =
          "Denne e-posten er allerede i bruk. Prøv å logge inn i stedet.";
      } else if (msg.includes("password")) {
        friendly = "Passordet må være minst 6 tegn.";
      }

      if (Platform.OS === "web") {
        window.alert("Noe gikk galt\n\n" + friendly);
      } else {
        Alert.alert("Noe gikk galt", friendly);
      }
    } else {
      setPassword("");
      const successMsg =
        "Vi har sendt en bekreftelseslenke til " +
        cleanEmail +
        ".\n\nKlikk på lenken i e-posten for å fullføre opprettelsen. Sjekk gjerne søppelpost hvis du ikke ser den i innboksen.\n\nEtter at e-posten er bekreftet, kan du logge inn her.";

      if (Platform.OS === "web") {
        window.alert("Sjekk e-posten din\n\n" + successMsg);
      } else {
        Alert.alert("Sjekk e-posten din", successMsg);
      }
      // Don't set account here — wait until they actually confirm and log in.
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

      let friendly = "Sjekk e-post og passord.";
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
        friendly =
          "E-posten din er ikke bekreftet ennå. Sjekk innboksen og klikk på bekreftelseslenken vi sendte deg.";
      } else if (msg.includes("invalid login")) {
        friendly =
          "E-post eller passord stemmer ikke. Hvis du nettopp opprettet konto, må du først bekrefte e-posten din.";
      } else if (msg.includes("rate limit") || msg.includes("too many")) {
        friendly =
          "For mange innloggingsforsøk. Vent noen minutter og prøv igjen.";
      }

      if (Platform.OS === "web") {
        window.alert("Kunne ikke logge inn\n\n" + friendly);
      } else {
        Alert.alert("Kunne ikke logge inn", friendly);
      }
    } else {
      setAccount(data.user);
      setPassword("");
      if (Platform.OS === "web") {
        window.alert("Logget inn\n\nVelkommen tilbake. Alt ditt er her igjen.");
      } else {
        Alert.alert("Logget inn", "Velkommen tilbake. Alt ditt er her igjen.");
      }
    }
  }

  // Log out = sign out, then start a fresh anonymous session.
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

  // --- Delete account ---
  // Two confirmations because this is permanent. Works on web and native.
  function confirmDelete() {
    if (Platform.OS === "web") {
      const first = window.confirm(
        "Er du helt sikker på at du vil slette kontoen din?\n\nAlt blir borte – samtaler, innsjekkinger, innlegg. Det kan ikke angres."
      );
      if (!first) return;
      const second = window.confirm(
        "Helt sikker?\n\nDette kan ikke angres."
      );
      if (!second) return;
      doDeleteAccount();
      return;
    }

    Alert.alert(
      "Slette kontoen?",
      "Alt blir borte – samtaler, innsjekkinger, innlegg. Det kan ikke angres.",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Fortsett",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Helt sikker?",
              "Dette kan ikke angres.",
              [
                { text: "Avbryt", style: "cancel" },
                {
                  text: "Slett kontoen",
                  style: "destructive",
                  onPress: doDeleteAccount,
                },
              ]
            ),
        },
      ]
    );
  }

  async function doDeleteAccount() {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("delete-user", {
        body: {},
      });
      if (error) throw error;

      await supabase.auth.signOut();
      await supabase.auth.signInAnonymously();
      await refreshUser();
      setEmail("");
      setPassword("");
      setBusy(false);

      if (Platform.OS === "web") {
        window.alert("Kontoen er slettet. Ta vare på deg selv. 🌙");
      } else {
        Alert.alert("Kontoen er slettet", "Ta vare på deg selv. 🌙");
      }
    } catch (e) {
      setBusy(false);
      console.error("Delete account failed:", e);
      if (Platform.OS === "web") {
        window.alert("Klarte ikke å slette kontoen. Prøv igjen om litt.");
      } else {
        Alert.alert(
          "Klarte ikke å slette kontoen",
          "Prøv igjen om litt, eller kontakt oss."
        );
      }
    }
  }

  // Small block with links to Privacy and Terms — used in both views.
  function LegalLinks() {
    return (
      <View style={styles.legalSection}>
        <Pressable
          style={styles.legalRow}
          onPress={() => navigation.navigate("Privacy")}
        >
          <Text style={styles.legalLink}>Personvern</Text>
        </Pressable>
        <Pressable
          style={styles.legalRow}
          onPress={() => navigation.navigate("Terms")}
        >
          <Text style={styles.legalLink}>Vilkår for bruk</Text>
        </Pressable>
      </View>
    );
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
            {busy ? "Et øyeblikk…" : "Logg ut"}
          </Text>
        </Pressable>

        <LegalLinks />

        {/* Danger zone — far below normal actions, clearly separated */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Slette kontoen</Text>
          <Text style={styles.muted}>
            Dette fjerner kontoen din og alt som er knyttet til den – samtaler,
            innsjekkinger, innlegg. Det kan ikke angres.
          </Text>

          <Pressable
            onPress={confirmDelete}
            disabled={busy}
            style={({ pressed }) => [
              styles.buttonDanger,
              (pressed || busy) && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonDangerText}>Slett kontoen min</Text>
          </Pressable>
        </View>
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

      <LegalLinks />
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
  // Subtle links to Privacy and Terms
  legalSection: {
    marginTop: spacing.xl,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
  },
  legalRow: {
    paddingVertical: spacing.sm,
  },
  legalLink: {
    color: colors.textMuted,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  // Danger zone for destructive actions
  dangerZone: {
    marginTop: spacing.xl * 2,
    paddingTop: spacing.xl,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
  },
  dangerTitle: {
    color: "#d96b6b",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  buttonDanger: {
    borderColor: "#d96b6b",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonDangerText: { color: "#d96b6b", fontSize: 16, fontWeight: "600" },
  buttonPressed: { opacity: 0.8 },
});