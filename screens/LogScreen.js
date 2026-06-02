// screens/LogScreen.js
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

export default function LogScreen() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect re-runs every time this screen comes into view,
  // so a check-in saved a moment ago shows up immediately.
  useFocusEffect(
    useCallback(() => {
      async function loadEntries() {
        setLoading(true);

        // Ask the database for this user's rows, newest first.
        // RLS guarantees we only ever get OUR OWN rows back.
        const { data, error } = await supabase
          .from("check_ins")
          .select("id, created_at, stress, energy, note")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Load failed:", error.message);
        } else {
          setEntries(data);
        }
        setLoading(false);
      }

      loadEntries();
    }, [])
  );

  // Turn a stored date into a calm, readable Norwegian date + time.
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("nb-NO", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          Ingenting her ennå. Din første innsjekk dukker opp her.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          <Text style={styles.stats}>
            Stress {item.stress}   ·   Energi {item.energy}
          </Text>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  entry: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
  },
  stats: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  note: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});