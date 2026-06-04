// screens/OnboardingScreen.js
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "../theme";

const STEPS = [
  {
    title: "Hva MANNPOD Chat er",
    body:
      "Et rolig samtalested. Du kan snakke med Hvermansen, en kunstig samtalepartner, sjekke inn med deg selv hver dag, og lese hva andre deler anonymt.\n\nMange bruker det som en pust i hverdagen – et sted å tenke høyt og kjenne at man ikke er helt alene.",
  },
  {
    title: "Hva det ikke er",
    body:
      "MANNPOD Chat er ikke helsehjelp. Hvermansen er ikke lege, terapeut eller psykolog – han er en språkmodell med en varm tone.\n\nAppen er heller ikke ment for akutte kriser. Hvis du er i fare for deg selv eller andre, ring 113. Trenger du noen å snakke med nå, ring 116 123 (Mental Helse, hele døgnet).",
  },
  {
    title: "Slik bruker du den",
    body:
      "Du er anonym fra start. Vil du beholde samtalene dine på tvers av telefon og PC, kan du opprette en konto under «Min konto».\n\nDet er ingen riktig måte å bruke appen på. Skriv når du har noe på hjertet. La det ligge når du ikke trenger det.",
  },
];

export default function OnboardingScreen({ onDone }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  function next() {
    if (isLast) {
      onDone();
    } else {
      setStepIndex(stepIndex + 1);
    }
  }

  function back() {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === stepIndex ? styles.dotActive : styles.dotIdle,
              ]}
            />
          ))}
        </View>

        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
      </ScrollView>

      <View style={styles.footer}>
        {stepIndex > 0 ? (
          <Pressable
            onPress={back}
            style={({ pressed }) => [
              styles.buttonOutline,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonOutlineText}>Tilbake</Text>
          </Pressable>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <Pressable
          onPress={next}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLast ? "Jeg forstår – la oss begynne" : "Videre"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
    justifyContent: "center",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xl,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: { backgroundColor: colors.accent },
  dotIdle: { backgroundColor: colors.cardBorder },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  body: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  button: {
    flex: 2,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: "700" },
  buttonOutline: {
    flex: 1,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  buttonOutlineText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonPressed: { opacity: 0.8 },
});