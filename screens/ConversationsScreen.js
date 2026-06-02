// screens/ConversationsScreen.js
import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

const MAX_CONVERSATIONS = 3;

export default function ConversationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [conversations, setConversations] = useState([]);

  // Reload the list every time the screen comes into focus.
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  async function loadConversations() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const registered = auth?.user?.email ? true : false;
    setIsRegistered(registered);

    if (!registered) {
      // Anonymous users don't have saved conversations.
      setConversations([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Load conversations failed:", error.message);
    } else if (data) {
      setConversations(data);
    }
    setLoading(false);
  }

  async function startNewConversation() {
    if (conversations.length >= MAX_CONVERSATIONS) {
      Alert.alert(
        "Grense nådd",
        `Du kan ha opptil ${MAX_CONVERSATIONS} samtaler om gangen. Slett en gammel før du starter en ny.`
      );
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title: "Ny samtale" })
      .select("id")
      .single();

    if (error) {
      console.error("Create conversation failed:", error.message);
      Alert.alert("Klarte ikke å starte ny samtale", "Prøv igjen om litt.");
      return;
    }

    navigation.navigate("Chat", { conversationId: data.id, isNew: true });
  }

  function openConversation(item) {
    navigation.navigate("Chat", { conversationId: item.id, isNew: false });
  }

  function confirmDelete(item) {
    if (Platform.OS === "web") {
      // Alert.alert with buttons doesn't work on web — use the browser's confirm.
      const ok = window.confirm(
        `Slette samtalen?\n\n"${item.title}" og alle meldingene i den blir borte.`
      );
      if (ok) deleteConversation(item.id);
      return;
    }

    Alert.alert(
      "Slette samtalen?",
      `"${item.title}" og alle meldingene i den blir borte.`,
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: () => deleteConversation(item.id),
        },
      ]
    );
  }

  async function deleteConversation(id) {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) {
      console.error("Delete conversation failed:", error.message);
      Alert.alert("Klarte ikke å slette", "Prøv igjen om litt.");
      return;
    }
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
    });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  // Anonymous users: friendly message, with a way to start one quick chat anyway.
  if (!isRegistered) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>
          Lag en konto for å lagre samtalene dine og snakke videre en annen
          gang.{"\n\n"}Som anonym kan du fortsatt prate med Hvermansen – det
          huskes bare ikke etterpå.
        </Text>
        <Pressable
          style={styles.newButton}
          onPress={() =>
            navigation.navigate("Chat", { conversationId: null, isNew: true })
          }
        >
          <Text style={styles.newButtonText}>Prat anonymt</Text>
        </Pressable>
      </View>
    );
  }

  const limitReached = conversations.length >= MAX_CONVERSATIONS;

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.list}
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => openConversation(item)}
            onLongPress={() => confirmDelete(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{formatDate(item.updated_at)}</Text>
            </View>
            <Pressable
              hitSlop={12}
              onPress={() => confirmDelete(item)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Slett</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Ingen samtaler ennå. Start din første!
          </Text>
        }
      />

      <Pressable
        style={[styles.newButton, limitReached && styles.newButtonDisabled]}
        onPress={startNewConversation}
      >
        <Text style={styles.newButtonText}>
          {limitReached
            ? `Grense nådd (${MAX_CONVERSATIONS}/${MAX_CONVERSATIONS})`
            : `+ Ny samtale (${conversations.length}/${MAX_CONVERSATIONS})`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  list: { padding: spacing.lg, flexGrow: 1 },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  date: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  deleteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  deleteText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  newButton: {
    backgroundColor: colors.accent,
    margin: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 14,
    alignItems: "center",
  },
  newButtonDisabled: {
    opacity: 0.5,
  },
  newButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});