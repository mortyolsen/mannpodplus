import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Switch, Alert, KeyboardAvoidingView,
  Platform, ActivityIndicator
} from 'react-native';
import { supabase } from '../supabaseClient';

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
};

export default function ThreadScreen({ route, navigation }) {
  const { thread } = route.params;
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    getUser();
    fetchReplies();
  }, []);

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      setUsername(data?.username || null);
    }
  }

  async function fetchReplies() {
    const { data, error } = await supabase
      .from('replies')
      .select(`
        id, content, is_anonymous, status, created_at, user_id,
        profiles:user_id (username)
      `)
      .eq('thread_id', thread.id)
      .neq('status', 'deleted')
      .order('created_at', { ascending: true });

    if (!error) setReplies(data || []);
    setLoading(false);
  }

  async function postReply() {
    if (!replyText.trim() || !user) return;
    setPosting(true);

    const { error } = await supabase
      .from('replies')
      .insert({
        thread_id: thread.id,
        user_id: user.id,
        content: replyText.trim(),
        is_anonymous: isAnonymous || !username,
      });

    if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen');
    } else {
      setReplyText('');
      fetchReplies();
    }
    setPosting(false);
  }

  async function reportReply(replyId) {
    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        content_type: 'reply',
        content_id: replyId,
      });

    if (error?.code === '23505') {
      Alert.alert('', 'Du har allerede rapportert dette svaret.');
    } else if (!error) {
      Alert.alert('Takk', 'Svaret er rapportert og skjult inntil vi har sett på det.');
      fetchReplies();
    }
  }

  function getDisplayName(item) {
    if (item.is_anonymous) return 'Anonym';
    return item.profiles?.username || 'Anonym';
  }

  function formatTime(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Akkurat nå';
    if (hours < 24) return `${hours}t siden`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'I går';
    return `${days} dager siden`;
  }

  function getAnonSubText() {
    if (!username) return 'Sett brukernavn i Min konto';
    if (isAnonymous) return 'Ingen ser hvem du er';
    return `Svarer som ${username}`;
  }

  const threadAuthor = thread.is_anonymous
    ? 'Anonym'
    : (thread.profiles?.username || 'Anonym');

  const renderReply = ({ item }) => {
    const isPending = item.status === 'pending';
    const displayName = getDisplayName(item);

    return (
      <View style={styles.replyCard}>
        <View style={styles.replyHeader}>
          <View style={styles.authorRow}>
            <View style={[styles.avatar, displayName === 'Anonym' && styles.avatarAnon]}>
              <Text style={[styles.avatarText, displayName === 'Anonym' && styles.avatarTextAnon]}>
                {displayName === 'Anonym' ? '?' : displayName[0].toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.authorName}>{displayName}</Text>
              <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
            </View>
          </View>
          {!isPending && (
            <TouchableOpacity onPress={() => Alert.alert(
              'Rapporter svar',
              'Vil du rapportere dette svaret?',
              [
                { text: 'Avbryt', style: 'cancel' },
                { text: 'Rapporter', style: 'destructive', onPress: () => reportReply(item.id) }
              ]
            )}>
              <Text style={styles.reportText}>Rapporter</Text>
            </TouchableOpacity>
          )}
        </View>

        {isPending ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>Under vurdering</Text>
          </View>
        ) : (
          <Text style={styles.replyContent}>{item.content}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={replies}
        keyExtractor={item => item.id}
        renderItem={renderReply}
        ListHeaderComponent={
          <>
            <View style={styles.threadCard}>
              <View style={styles.authorRow}>
                <View style={[styles.avatar, threadAuthor === 'Anonym' && styles.avatarAnon]}>
                  <Text style={[styles.avatarText, threadAuthor === 'Anonym' && styles.avatarTextAnon]}>
                    {threadAuthor === 'Anonym' ? '?' : threadAuthor[0].toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{threadAuthor}</Text>
                  <Text style={styles.timeText}>{formatTime(thread.created_at)}</Text>
                </View>
              </View>
              <Text style={styles.threadContent}>{thread.content}</Text>
            </View>

            {loading ? (
              <ActivityIndicator color={C.primary} style={{ marginTop: 24 }} />
            ) : (
              <Text style={styles.repliesLabel}>
                {replies.length === 0 ? 'Ingen svar ennå' : `${replies.length} svar`}
              </Text>
            )}
          </>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <View style={styles.inputArea}>
        <View style={styles.anonToggle}>
          <View>
            <Text style={styles.anonLabel}>Anonym</Text>
            <Text style={styles.anonSub}>{getAnonSubText()}</Text>
          </View>
          <Switch
            value={isAnonymous || !username}
            onValueChange={username ? setIsAnonymous : null}
            disabled={!username}
            trackColor={{ true: C.primary }}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Skriv et svar..."
            placeholderTextColor={C.light}
            value={replyText}
            onChangeText={setReplyText}
            maxLength={500}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!replyText.trim() || posting) && styles.sendBtnDisabled]}
            onPress={postReply}
            disabled={!replyText.trim() || posting}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  list: { padding: 16, paddingBottom: 16 },
  threadCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 18,
    marginBottom: 20,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 12 },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.dark, justifyContent: 'center', alignItems: 'center',
  },
  avatarAnon: { backgroundColor: C.warm, borderWidth: 1, borderColor: C.border },
  avatarText: { fontSize: 11, fontWeight: '800', color: C.primary },
  avatarTextAnon: { color: C.light },
  authorName: { fontSize: 13, fontWeight: '700', color: C.dark },
  timeText: { fontSize: 11, color: C.light },
  threadContent: { fontSize: 15, color: '#3D3028', lineHeight: 23 },
  repliesLabel: {
    fontSize: 12, color: C.light, fontWeight: '600',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  replyCard: { backgroundColor: C.warm, borderRadius: 14, padding: 14 },
  replyHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  replyContent: { fontSize: 14, color: C.dark, lineHeight: 21 },
  pendingBox: { backgroundColor: C.border, borderRadius: 8, padding: 10 },
  pendingText: { fontSize: 13, color: C.light, fontStyle: 'italic', textAlign: 'center' },
  reportText: { fontSize: 11, color: C.light },
  inputArea: {
    backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border,
    padding: 12, paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  anonToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  anonLabel: { fontSize: 12, color: C.mid, fontWeight: '600' },
  anonSub: { fontSize: 11, color: C.light, marginTop: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  textInput: {
    flex: 1, backgroundColor: C.warm, borderRadius: 14,
    padding: 12, fontSize: 14, color: C.dark,
    maxHeight: 100, textAlignVertical: 'top',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.dark, justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: C.border },
  sendBtnText: { color: C.primary, fontSize: 18, fontWeight: '700' },
});