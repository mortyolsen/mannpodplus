// screens/ChatScreen.js
import { useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
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

export default function ChatScreen({ route, navigation }) {
  // Which conversation are we in? Comes from ConversationsScreen.
  const conversationId = route?.params?.conversationId ?? null;
  const isNew = route?.params?.isNew ?? false;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const listRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function init() {
      const { data: auth } = await supabase.auth.getUser();
      const registered = auth?.user?.email ? true : false;
      setIsRegistered(registered);

      // Load saved history only for this conversation, only for registered users.
      if (registered && conversationId && !isNew) {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("role, content")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        if (error) {
          console.error("Load history failed:", error.message);
        } else if (data) {
          setMessages(data);
        }
      }
      // For new conversations or anonymous users: start with an empty chat.
      setLoading(false);
    }
    init();
  }, [conversationId, isNew]);

  async function sendMessage() {
    const text = input.trim();
    if (text === "" || thinking) return;

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setThinking(true);

    // Save user message only for registered users with a conversation.
    if (isRegistered && conversationId) {
      const { error: saveErr } = await supabase.from("chat_messages").insert({
        role: "user",
        content: text,
        user_id: userId,
        conversation_id: conversationId,
      });
      if (saveErr) console.error("Save user msg failed:", saveErr.message);
    }

    try {
      const recent = newMessages.slice(-10);
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { messages: recent, conversationId: conversationId },
      });
      if (error) throw error;

      let replyText = data.reply;
      if (replyText === "LIMIT_REACHED") {
        replyText =
          "Du har brukt opp dagens samtaler. Vi snakkes igjen i morgen – ta vare på deg selv til da. 🌙";
      }

      const botMsg = { role: "assistant", content: replyText };
      setMessages([...newMessages, botMsg]);

      // Save bot reply for registered users (not the limit notice).
      if (isRegistered && conversationId && data.reply !== "LIMIT_REACHED") {
        const { error: botErr } = await supabase.from("chat_messages").insert({
          role: "assistant",
          content: replyText,
          user_id: userId,
          conversation_id: conversationId,
        });
        if (botErr) console.error("Save bot msg failed:", botErr.message);
      }

      // If the server generated a new title for this conversation, update the header.
      if (data.newTitle && conversationId) {
        navigation.setOptions({ title: data.newTitle });
      }
    } catch (e) {
      console.error("Chat error:", JSON.stringify(e));
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Beklager, noe gikk galt. Prøv igjen." },
      ]);
    } finally {
      setThinking(false);
    }
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
        ref={listRef}
        contentContainerStyle={styles.list}
        data={messages}
        keyExtractor={(_, index) => String(index)}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.bubbleText}>{item.content}</Text>
          </View>
        )}
        ListHeaderComponent={
          !isRegistered ? (
            <Text style={styles.notice}>
              Du er anonym nå, så denne samtalen huskes ikke når du går ut. Vil
              du at Hvermansen skal huske, kan du lage en konto under «Min konto».
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Skriv noe når du er klar. Jeg er her.</Text>
        }
      />

      {thinking ? <Text style={styles.thinking}>…</Text> : null}

      <View
        style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Skriv her…"
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          disabled={thinking}
          style={({ pressed }) => [
            styles.send,
            (pressed || thinking) && styles.sendPressed,
          ]}
        >
          <Text style={styles.sendText}>Send</Text>
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
  notice: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
    fontStyle: "italic",
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginTop: spacing.xl,
    lineHeight: 22,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  userBubble: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    paddingHorizontal: 0,
  },
  bubbleText: { color: colors.textPrimary, fontSize: 16, lineHeight: 23 },
  thinking: {
    color: colors.textMuted,
    fontSize: 22,
    paddingLeft: spacing.lg,
    marginBottom: spacing.sm,
  },
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