// screens/ShareScreen.js
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "../theme";
import { supabase } from "../supabaseClient";

// Posts with this many reports or more are hidden automatically until you check.
const HIDE_THRESHOLD = 2;

export default function ShareScreen() {
  const [posts, setPosts] = useState([]);
  const [reportedIds, setReportedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [posting, setPosting] = useState(false);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  async function loadPosts() {
    // Load posts (with report count) and the current user's own reports
    // in parallel so the UI knows which posts to grey out.
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const [postsRes, reportsRes] = await Promise.all([
      supabase
        .from("posts_with_report_counts")
        .select("id, content, created_at, report_count")
        .lt("report_count", HIDE_THRESHOLD)
        .order("created_at", { ascending: false }),
      userId
        ? supabase
            .from("reports")
            .select("post_id")
            .eq("reporter_id", userId)
        : Promise.resolve({ data: [] }),
    ]);

    if (postsRes.error) {
      console.error("Load posts failed:", postsRes.error.message);
    } else if (postsRes.data) {
      setPosts(postsRes.data);
    }
    if (reportsRes.data) {
      setReportedIds(new Set(reportsRes.data.map((r) => r.post_id)));
    }
    setLoading(false);
  }

  async function submitPost() {
    const text = input.trim();
    if (text === "" || posting) return;

    setPosting(true);
    const { data, error } = await supabase.functions.invoke("share", {
      body: { content: text },
    });
    setPosting(false);

    if (error) {
      console.error("Post failed:", error.message);
      Alert.alert("Noe gikk galt", "Klarte ikke å dele akkurat nå.");
    } else {
      setInput("");
      if (data?.removed) {
        Alert.alert(
          "Litt ble fjernet",
          "Vi tok bort det som lignet kontaktinfo (telefon, lenker, brukernavn). Det er for å holde stedet trygt for alle."
        );
      }
      loadPosts();
    }
  }

  // --- Reporting ---
  function confirmReport(postId) {
    if (reportedIds.has(postId)) return; // already reported

    if (Platform.OS === "web") {
      const ok = window.confirm(
        "Rapportér innlegget?\n\nVi ser på det og fjerner det hvis det bryter vilkårene."
      );
      if (!ok) return;
      doReport(postId);
      return;
    }

    Alert.alert(
      "Rapportér innlegget?",
      "Vi ser på det og fjerner det hvis det bryter vilkårene.",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Rapportér",
          style: "destructive",
          onPress: () => doReport(postId),
        },
      ]
    );
  }

  async function doReport(postId) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from("reports").insert({
      post_id: postId,
      reporter_id: userId,
    });

    if (error) {
      console.error("Report failed:", error.message);
      if (Platform.OS === "web") {
        window.alert("Klarte ikke å rapportere akkurat nå. Prøv igjen om litt.");
      } else {
        Alert.alert(
          "Noe gikk galt",
          "Klarte ikke å rapportere akkurat nå. Prøv igjen om litt."
        );
      }
      return;
    }

    // Update local state so the button greys out, then refresh from server.
    setReportedIds((prev) => new Set(prev).add(postId));
    loadPosts();
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
    });
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="small" color={colors.textMuted} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <FlatList
        contentContainerStyle={styles.list}
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.heading}>
            Ord fra andre som også bærer på noe.
          </Text>
        }
        renderItem={({ item }) => {
          const alreadyReported = reportedIds.has(item.id);
          return (
            <View style={styles.post}>
              <Text style={styles.postText}>{item.content}</Text>
              <View style={styles.postFooter}>
                <Text style={styles.postDate}>{formatDate(item.created_at)}</Text>
                <Pressable
                  onPress={() => confirmReport(item.id)}
                  disabled={alreadyReported}
                  hitSlop={8}
                >
                  <Text
                    style={alreadyReported ? styles.reportedText : styles.reportText}
                  >
                    {alreadyReported ? "Rapportert" : "Rapportér"}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Ingen har delt noe ennå. Du kan være den første.
          </Text>
        }
      />

      <View
        style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Del noe, anonymt…"
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <Pressable
          onPress={submitPost}
          disabled={posting}
          style={({ pressed }) => [
            styles.send,
            (pressed || posting) && styles.sendPressed,
          ]}
        >
          <Text style={styles.sendText}>Del</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: spacing.lg, flexGrow: 1 },
  heading: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginTop: spacing.xl,
    lineHeight: 22,
  },
  post: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  postText: { color: colors.textPrimary, fontSize: 16, lineHeight: 23 },
  postFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  postDate: { color: colors.textMuted, fontSize: 13 },
  reportText: { color: colors.textMuted, fontSize: 13 },
  reportedText: { color: colors.textMuted, fontSize: 13, opacity: 0.5 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: 16,
    maxHeight: 120,
  },
  send: {
    marginLeft: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sendPressed: { opacity: 0.8 },
  sendText: { color: colors.background, fontWeight: "700", fontSize: 15 },
});