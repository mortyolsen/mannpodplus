// screens/CheckInScreen.js
import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

export default function CheckInScreen({ navigation }) {
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  // "saving" lets us disable the button while a save is in progress.
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    // Send one new row to the check_ins table.
    // We do NOT send user_id — the database fills it in automatically
    // (remember "default auth.uid()" from when we created the table).
    const { error } = await supabase.from("check_ins").insert({
      stress: stress,
      energy: energy,
      note: note.trim() === "" ? null : note.trim(),
    });

    setSaving(false);

    if (error) {
      console.error("Save failed:", error.message);
      Alert.alert("Noe gikk galt", "Klarte ikke å lagre akkurat nå.");
    } else {
      // Calm confirmation, then go back to the home screen.
      Alert.alert("Lagret", "Takk for at du sjekket inn.");
      navigation.goBack();
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.intro}>Ta et øyeblikk. Hvor er du i dag?</Text>

      <Text style={styles.label}>Stress</Text>
      <Text style={styles.value}>{stress}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={stress}
        onValueChange={setStress}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.cardBorder}
        thumbTintColor={colors.accent}
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Energi</Text>
      <Text style={styles.value}>{energy}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={energy}
        onValueChange={setEnergy}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.cardBorder}
        thumbTintColor={colors.accent}
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>
        Noe du vil skrive ned?
      </Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Helt valgfritt."
        placeholderTextColor={colors.textMuted}
        multiline
      />

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={({ pressed }) => [
          styles.button,
          (pressed || saving) && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>
          {saving ? "Lagrer…" : "Lagre"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  intro: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: colors.accent,
    fontSize: 22,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontSize: 15,
    minHeight: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});