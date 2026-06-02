// components/Card.js
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "../theme";

// onPress is optional. If a card gets an onPress, tapping it does something.
// If it doesn't, the card is just visual (like before).
export default function Card({ title, text, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      // a gentle dim while the finger is held down — calm, not flashy
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 19,
    fontWeight: "600",
  },
  cardText: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});