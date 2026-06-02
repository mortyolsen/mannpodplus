// screens/LoadingScreen.js
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../theme";

// A calm, near-empty screen shown for the brief moment while we sign in.
export default function LoadingScreen() {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="small" color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});