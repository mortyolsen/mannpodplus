import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Modal, Switch, Alert, RefreshControl, ActivityIndicator
} from 'react-native';
import { supabase } from '../supabaseClient';

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
};

const PREVIEW_LENGTH = 150;

export default function FellesskapScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [expandedThreads, setExpandedThreads] = useState({});

  const [editingThread, setEditingThread] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUser();
    fetchThreads();
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

  async function fetchThreads() {
    const { data, error } = await supabase
      .from('threads')
      .select(`
        id, content, is_anonymous, status, created_at, user_id,
        profiles:user_id (username),
        replies (count)
      `)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });

    if (!error) setThreads(data || []);
    setLoading(false);
    setRefreshing(false);
  }

  async function postThread() {
    if (!newContent.trim()) return;
    setPosting(true);

    const { error } = await supabase
      .from('threads')
      .insert({
        user_id: user.id,
        content: newContent.trim(),
        is_anonymous: isAnonymous || !username,
      });

    if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen');
    } else {
      setNewContent('');
      setIsAnonymous(false);
      setShowNewThread(false);
      fetchThreads();
    }
    setPosting(false);
  }

  async function saveEdit() {
    if (!editContent.trim() || !editingThread) return;
    setSaving(true);

    const { error } = await supabase
      .from('threads')
      .update({ content: editContent.trim() })
      .eq('id', editingThread.id);

    if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen');
    } else {
      setEditingThread(null);
      setEditContent('');
      fetchThreads();
    }
    setSaving(false);
  }

  async function deleteThread(threadId) {
    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', threadId);

    if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen');
    } else {
      fetchThreads();
    }
  }

  async function reportThread(threadId) {
    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_id: user.id,
        content_type: 'thread',
        content_id: threadId,
      });

    if (error?.code === '23505') {
      Alert.alert('', 'Du har allerede rapportert dette innlegget.');
    } else if (!error) {
      Alert.alert('Takk', 'Innlegget er rapportert og skjult inntil vi har sett på det.');
      fetchThreads();
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
    if (!username) return 'Sett brukernavn i Min konto for å poste med navn';
    if (isAnonymous) return 'Ingen ser hvem du er';
    return `Vises som ${username}`;
  }

  function toggleExpanded(id) {
    setExpandedThreads(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const isOwnThread = (item) => user && item.user_id === user.id;

  const renderThread = ({ item }) => {
    const isPending = item.status === 'pending';
    const displayName = getDisplayName(item);
    const replyCount = item.replies?.[0]?.count || 0;
    const isOwn = isOwnThread(item);
    const isLong = item.content.length > PREVIEW_LENGTH;
    const isExpanded = expandedThreads[item.id];

    return (
      <TouchableOpacity
        style={styles.threadCard}
        onPress={() => !isPending && navigation.navigate('Thread', { thread: item })}
        activeOpacity={isPending ? 1 : 0.7}
      >
        <View style={styles.threadHeader}>
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
          <Text style={styles.replyCount}>{replyCount} svar</Text>
        </View>

        {isPending ? (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>Under vurdering</Text>
          </View>
        ) : (
          <>
            <Text style={styles.threadContent}>
              {isLong && !isExpanded
                ? item.content.slice(0, PREVIEW_LENGTH).trimEnd() + '...'
                : item.content}
            </Text>
            {isLong && (
              <TouchableOpacity
                onPress={(e) => { e.stopPropagation?.(); toggleExpanded(item.id); }}
                style={styles.lesmerBtn}
              >
                <Text style={styles.lesmerText}>
                  {isExpanded ? 'Vis mindre' : 'Les mer'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {!isPending && (
          <View style={styles.threadFooter}>
            <TouchableOpacity
              style={styles.replyBtn}
              onPress={() => navigation.navigate('Thread', { thread: item })}
            >
              <Text style={styles.replyBtnText}>Les tråden</Text>
            </TouchableOpacity>

            <View style={styles.footerActions}>
              {isOwn ? (
                <>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => { setEditingThread(item); setEditContent(item.content); }}
                  >
                    <Text style={styles.editBtnText}>Rediger</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Alert.alert(
                    'Slette tråden?',
                    'Dette kan ikke angres.',
                    [
                      { text: 'Avbryt', style: 'cancel' },
                      { text: 'Slett', style: 'destructive', onPress: () => deleteThread(item.id) }
                    ]
                  )}>
                    <Text style={styles.deleteText}>Slett</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => Alert.alert(
                  'Rapporter innlegg',
                  'Vil du rapportere dette innlegget?',
                  [
                    { text: 'Avbryt', style: 'cancel' },
                    { text: 'Rapporter', style: 'destructive', onPress: () => reportThread(item.id) }
                  ]
                )}>
                  <Text style={styles.reportText}>Rapporter</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={renderThread}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchThreads(); }}
            tintColor={C.primary}
          />
        }
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.newThreadBtn}
            onPress={() => setShowNewThread(true)}
          >
            <Text style={styles.newThreadBtnPlus}>+</Text>
            <Text style={styles.newThreadBtnText}>Del noe med fellesskapet</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Ingen tråder ennå. Vær den første!</Text>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      {/* Ny tråd-modal */}
      <Modal visible={showNewThread} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowNewThread(false); setNewContent(''); }}>
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ny tråd</Text>
            <TouchableOpacity onPress={postThread} disabled={posting || !newContent.trim()}>
              <Text style={[styles.postText, (!newContent.trim() || posting) && styles.postTextDisabled]}>
                Del
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Hva vil du dele med fellesskapet?"
            placeholderTextColor={C.light}
            multiline
            value={newContent}
            onChangeText={setNewContent}
            maxLength={1000}
            autoFocus
          />

          <View style={styles.anonRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.anonLabel}>Post anonymt</Text>
              <Text style={styles.anonSub}>{getAnonSubText()}</Text>
            </View>
            <Switch
              value={isAnonymous || !username}
              onValueChange={username ? setIsAnonymous : null}
              disabled={!username}
              trackColor={{ true: C.primary }}
            />
          </View>

          {!username && (
            <TouchableOpacity
              style={styles.usernameHint}
              onPress={() => { setShowNewThread(false); navigation.navigate('Account'); }}
            >
              <Text style={styles.usernameHintText}>Gå til Min konto for å sette brukernavn →</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.charCount}>{newContent.length}/1000</Text>
        </View>
      </Modal>

      {/* Rediger-modal */}
      <Modal visible={!!editingThread} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setEditingThread(null); setEditContent(''); }}>
              <Text style={styles.cancelText}>Avbryt</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Rediger tråd</Text>
            <TouchableOpacity onPress={saveEdit} disabled={saving || !editContent.trim()}>
              <Text style={[styles.postText, (!editContent.trim() || saving) && styles.postTextDisabled]}>
                {saving ? 'Lagrer...' : 'Lagre'}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Rediger innlegget ditt..."
            placeholderTextColor={C.light}
            multiline
            value={editContent}
            onChangeText={setEditContent}
            maxLength={1000}
            autoFocus
          />

          <Text style={styles.charCount}>{editContent.length}/1000</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg },
  list: { padding: 16, paddingBottom: 40 },
  newThreadBtn: {
    backgroundColor: C.dark, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14,
  },
  newThreadBtnPlus: { color: C.primary, fontSize: 20, fontWeight: '600' },
  newThreadBtnText: { color: C.bg, fontSize: 14, fontWeight: '600' },
  threadCard: {
    backgroundColor: C.white, borderRadius: 18, padding: 16,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  threadHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: C.dark, justifyContent: 'center', alignItems: 'center',
  },
  avatarAnon: { backgroundColor: C.warm, borderWidth: 1, borderColor: C.border },
  avatarText: { fontSize: 11, fontWeight: '800', color: C.primary },
  avatarTextAnon: { color: C.light },
  authorName: { fontSize: 13, fontWeight: '700', color: C.dark },
  timeText: { fontSize: 11, color: C.light },
  replyCount: { fontSize: 12, color: C.light },
  threadContent: { fontSize: 14, color: '#3D3028', lineHeight: 21, marginBottom: 4 },
  lesmerBtn: { marginBottom: 10 },
  lesmerText: { fontSize: 13, color: C.primary, fontWeight: '600' },
  pendingBox: { backgroundColor: C.warm, borderRadius: 10, padding: 12, marginBottom: 12 },
  pendingText: { fontSize: 13, color: C.light, fontStyle: 'italic', textAlign: 'center' },
  threadFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 8,
  },
  replyBtn: { backgroundColor: C.warm, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 14 },
  replyBtnText: { fontSize: 12, color: C.mid, fontWeight: '600' },
  footerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  editBtn: { backgroundColor: C.warm, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 14 },
  editBtnText: { fontSize: 12, color: C.primary, fontWeight: '600' },
  deleteText: { fontSize: 12, color: '#d96b6b', fontWeight: '600' },
  reportText: { fontSize: 12, color: C.light },
  emptyText: { textAlign: 'center', color: C.light, fontSize: 14, marginTop: 40 },
  modal: { flex: 1, backgroundColor: C.bg, padding: 20 },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24, paddingTop: 8,
  },
  cancelText: { fontSize: 15, color: C.mid },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.dark },
  postText: { fontSize: 15, fontWeight: '700', color: C.primary },
  postTextDisabled: { color: C.light },
  textInput: {
    fontSize: 15, color: C.dark, lineHeight: 24,
    minHeight: 150, textAlignVertical: 'top',
  },
  anonRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 24, backgroundColor: C.warm, borderRadius: 14, padding: 16,
  },
  anonLabel: { fontSize: 14, fontWeight: '600', color: C.dark },
  anonSub: { fontSize: 12, color: C.light, marginTop: 2 },
  usernameHint: { marginTop: 10, padding: 4 },
  usernameHintText: { fontSize: 13, color: C.primary, fontWeight: '500' },
  charCount: { fontSize: 11, color: C.light, marginTop: 12, textAlign: 'right' },
});