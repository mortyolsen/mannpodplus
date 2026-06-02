// screens/AboutScreen.js
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { colors, spacing } from "../theme";

export default function AboutScreen() {
  function call(number) {
    Linking.openURL(`tel:${number}`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        MANNPOD+ er et rolig sted å puste, og en å snakke med når det trengs.
        Men det er viktig at du vet hva appen er – og hva den ikke er.
      </Text>

      <Text style={styles.heading}>Dette er ikke helsehjelp</Text>
      <Text style={styles.body}>
        Hvermansen er en samtalepartner, ikke en lege, terapeut eller psykolog.
        Appen erstatter ikke profesjonell hjelp eller behandling. Den er et sted
        å tenke høyt og kjenne at du ikke er alene – ikke et sted for diagnoser
        eller behandling.
      </Text>

      <Text style={styles.heading}>Hvis det haster</Text>
      <Text style={styles.body}>
        Er du i akutt fare eller tenker på å skade deg selv, ikke vær alene med
        det. Ta kontakt med en gang:
      </Text>

      <Pressable style={styles.helpRow} onPress={() => call("113")}>
        <Text style={styles.helpNumber}>113</Text>
        <Text style={styles.helpLabel}>Medisinsk nødhjelp – ved akutt fare</Text>
      </Pressable>

      <Pressable style={styles.helpRow} onPress={() => call("116123")}>
        <Text style={styles.helpNumber}>116 123</Text>
        <Text style={styles.helpLabel}>
          Mental Helse – noen å snakke med, hele døgnet
        </Text>
      </Pressable>

      <Pressable style={styles.helpRow} onPress={() => call("116111")}>
        <Text style={styles.helpNumber}>116 111</Text>
        <Text style={styles.helpLabel}>
          Alarmtelefonen for barn og unge
        </Text>
      </Pressable>

      <Text style={[styles.body, { marginTop: spacing.xl }]}>
        Du fortjener ekte hjelp når du trenger det. Det er styrke å be om den.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  intro: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  helpRow: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  helpNumber: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  helpLabel: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});