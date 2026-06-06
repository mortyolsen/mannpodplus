import { useState, useEffect } from "react";
import {
  Alert, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View, TouchableOpacity
} from "react-native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
};

export default function AccountScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [account, setAccount] = useState(null);
  const [mode, setMode] = useState("register");
  const [username, setUsername] = useState("");
  const [savedUsername, setSavedUsername] = useState(null);
  const [savingUsername, setSavingUsername] = useState(false);

  async function refreshUser() {
    const { data } = await supabase.auth.getUser();
    setAccount(data?.user ?? null);
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single();
      const name = profile?.username || null;
      setSavedUsername(name);
      setUsername(name || "");
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const isRegistered = account?.email ? true : false;

  async function saveUsername() {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      Alert.alert('For kort', 'Brukernavnet må ha minst 2 tegn.');
      return;
    }
    setSavingUsername(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: account.id, username: trimmed }, { onConflict: 'id' });

    if (error?.code === '23505') {
      Alert.alert('Opptatt', 'Dette brukernavnet er allerede i bruk. Prøv et annet.');
    } else if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen.');
    } else {
      setSavedUsername(trimmed);
      Alert.alert('Lagret', `Brukernavnet ditt er nå «${trimmed}».`);
    }
    setSavingUsername(false);
  }

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
      let friendly = error.message;
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit") || msg.includes("too many")) {
        friendly = "Vi har sendt for mange e-poster på kort tid. Prøv igjen om en times tid.";
      } else if (msg.includes("already") || msg.includes("registered")) {
        friendly = "Denne e-posten er allerede i bruk. Prøv å logge inn i stedet.";
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
        "Vi har sendt en bekreftelseslenke til " + cleanEmail +
        ".\n\nKlikk på lenken i e-posten for å fullføre opprettelsen. Sjekk gjerne søppelpost hvis du ikke ser den i innboksen.";
      if (Platform.OS === "web") {
        window.alert("Sjekk e-posten din\n\n" + successMsg);
      } else {
        Alert.alert("Sjekk e-posten din", successMsg);
      }
    }
  }

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
      let friendly = "Sjekk e-post og passord.";
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
        friendly = "E-posten din er ikke bekreftet ennå. Sjekk innboksen og klikk på bekreftelseslenken.";
      } else if (msg.includes("invalid login")) {
        friendly = "E-post eller passord stemmer ikke.";
      } else if (msg.includes("rate limit") || msg.includes("too many")) {
        friendly = "For mange innloggingsforsøk. Vent noen minutter og prøv igjen.";
      }
      if (Platform.OS === "web") {
        window.alert("Kunne ikke logge inn\n\n" + friendly);
      } else {
        Alert.alert("Kunne ikke logge inn", friendly);
      }
    } else {
      setAccount(data.user);
      setPassword("");
      await refreshUser();
      if (Platform.OS === "web") {
        window.alert("Logget inn\n\nVelkommen tilbake. Alt ditt er her igjen.");
      } else {
        Alert.alert("Logget inn", "Velkommen tilbake. Alt ditt er her igjen.");
      }
    }
  }

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

  function confirmDelete() {
    if (Platform.OS === "web") {
      const first = window.confirm(
        "Er du helt sikker på at du vil slette kontoen din?\n\nAlt blir borte – samtaler, innsjekkinger, innlegg. Det kan ikke angres."
      );
      if (!first) return;
      const second = window.confirm("Helt sikker?\n\nDette kan ikke angres.");
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
          text: "Fortsett", style: "destructive",
          onPress: () => Alert.alert(
            "Helt sikker?", "Dette kan ikke angres.",
            [
              { text: "Avbryt", style: "cancel" },
              { text: "Slett kontoen", style: "destructive", onPress: doDeleteAccount },
            ]
          ),
        },
      ]
    );
  }

  async function doDeleteAccount() {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("delete-user", { body: {} });
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
      if (Platform.OS === "web") {
        window.alert("Klarte ikke å slette kontoen. Prøv igjen om litt.");
      } else {
        Alert.alert("Klarte ikke å slette kontoen", "Prøv igjen om litt, eller kontakt oss.");
      }
    }
  }

  function LegalLinks() {
    return (
      <View style={styles.legalSection}>
        <Pressable style={styles.legalRow} onPress={() => navigation.navigate("Privacy")}>
          <Text style={styles.legalLink}>Personvern</Text>
        </Pressable>
        <Pressable style={styles.legalRow} onPress={() => navigation.navigate("Terms")}>
          <Text style={styles.legalLink}>Vilkår for bruk</Text>
        </Pressable>
      </View>
    );
  }

  if (isRegistered) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Du er logget inn.</Text>
        <Text style={styles.muted}>{account.email}</Text>

        {/* Brukernavn-seksjon */}
        <View style={styles.usernameSection}>
          <Text style={styles.sectionTitle}>Brukernavn i fellesskapet</Text>
          <Text style={styles.muted}>
            {savedUsername
              ? `Vises som «${savedUsername}» når du poster med navn.`
              : 'Sett et brukernavn for å poste med navn i fellesskapet. Ellers postes du anonymt.'}
          </Text>
          <View style={styles.usernameRow}>
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Ditt brukernavn"
              placeholderTextColor={C.light}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            <TouchableOpacity
              style={[
                styles.usernameBtn,
                (!username.trim() || savingUsername) && styles.usernameBtnDisabled
              ]}
              onPress={saveUsername}
              disabled={!username.trim() || savingUsername}
            >
              <Text style={styles.usernameBtnText}>
                {savingUsername ? '...' : 'Lagre'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.charCount}>{username.length}/30</Text>
        </View>

        <Text style={[styles.muted, { marginTop: spacing.lg }]}>
          Samtalene og notatene dine følger med deg, også om du bytter telefon.
        </Text>

        <Pressable
          onPress={logOut}
          disabled={busy}
          style={({ pressed }) => [styles.buttonOutline, (pressed || busy) && styles.buttonPressed]}
        >
          <Text style={styles.buttonOutlineText}>
            {busy ? "Et øyeblikk…" : "Logg ut"}
          </Text>
        </Pressable>

        <LegalLinks />

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Slette kontoen</Text>
          <Text style={styles.muted}>
            Dette fjerner kontoen din og alt som er knyttet til den. Det kan ikke angres.
          </Text>
          <Pressable
            onPress={confirmDelete}
            disabled={busy}
            style={({ pressed }) => [styles.buttonDanger, (pressed || busy) && styles.buttonPressed]}
          >
            <Text style={styles.buttonDangerText}>Slett kontoen min</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

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
        {mode === "register" ? "Ta vare på det du har skrevet." : "Hent tilbake kontoen din."}
      </Text>
      <Text style={styles.muted}>
        {mode === "register"
          ? "Lag en konto, så følger samtalene dine med deg – også om du bytter telefon."
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
        style={({ pressed }) => [styles.button, (pressed || busy) && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>
          {busy ? "Et øyeblikk…" : mode === "register" ? "Opprett konto" : "Logg inn"}
        </Text>
      </Pressable>

      <LegalLinks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  tabs: { flexDirection: "row", marginBottom: spacing.lg, gap: spacing.lg },
  tab: { paddingVertical: spacing.sm },
  tabActive: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  tabIdle: { color: colors.textMuted, fontSize: 16 },
  intro: { color: colors.textPrimary, fontSize: 18, lineHeight: 26, marginBottom: spacing.sm },
  muted: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  label: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: colors.card, borderColor: colors.cardBorder,
    borderWidth: 1, borderRadius: 14, padding: spacing.md,
    marginTop: spacing.sm, color: colors.textPrimary, fontSize: 16,
  },
  button: {
    backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.xl,
  },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: "700" },
  buttonOutline: {
    borderColor: colors.cardBorder, borderWidth: 1, borderRadius: 14,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.xl,
  },
  buttonOutlineText: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  buttonPressed: { opacity: 0.8 },
  usernameSection: {
    marginTop: spacing.xl,
    backgroundColor: C.warm,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: '700',
    color: C.dark, marginBottom: 6,
  },
  usernameRow: {
    flexDirection: 'row', gap: 10,
    marginTop: 12, alignItems: 'center',
  },
  usernameInput: {
    flex: 1, backgroundColor: C.white,
    borderRadius: 12, padding: 12,
    fontSize: 15, color: C.dark,
  },
  usernameBtn: {
    backgroundColor: C.dark, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 18,
  },
  usernameBtnDisabled: { backgroundColor: C.border },
  usernameBtnText: { color: C.primary, fontSize: 14, fontWeight: '700' },
  charCount: { fontSize: 11, color: C.light, textAlign: 'right', marginTop: 4 },
  legalSection: {
    marginTop: spacing.xl, flexDirection: "row",
    justifyContent: "center", gap: spacing.xl,
  },
  legalRow: { paddingVertical: spacing.sm },
  legalLink: { color: colors.textMuted, fontSize: 14, textDecorationLine: "underline" },
  dangerZone: {
    marginTop: spacing.xl * 2, paddingTop: spacing.xl,
    borderTopColor: colors.cardBorder, borderTopWidth: 1,
  },
  dangerTitle: { color: "#d96b6b", fontSize: 16, fontWeight: "700", marginBottom: spacing.sm },
  buttonDanger: {
    borderColor: "#d96b6b", borderWidth: 1, borderRadius: 14,
    paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.lg,
  },
  buttonDangerText: { color: "#d96b6b", fontSize: 16, fontWeight: "600" },
});