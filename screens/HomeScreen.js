import { useEffect, useState } from "react";
import {
  ScrollView, StyleSheet, Text, View,
  TouchableOpacity, Platform, ActivityIndicator
} from "react-native";
import { supabase } from "../supabaseClient";

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
  darkAlt: '#2C2420',
};

export default function HomeScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: 'MANNPOD fellesskap',
      headerRight: () => (
        <TouchableOpacity
          style={styles.accountPill}
          onPress={() => navigation.navigate('Account')}
        >
          <View style={styles.accountAvatar}>
            <Text style={styles.accountAvatarText}>M</Text>
          </View>
          <Text style={styles.accountPillText}>Min konto</Text>
        </TouchableOpacity>
      ),
    });
    fetchLatestThreads();
  }, [navigation]);

  async function fetchLatestThreads() {
    const { data } = await supabase
      .from('threads')
      .select('id, content, is_anonymous, created_at, profiles:user_id (username)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4);

    setThreads(data || []);
    setLoadingThreads(false);
  }

  function getDisplayName(item) {
    if (item.is_anonymous) return 'Anonym';
    return item.profiles?.username || 'Anonym';
  }

  function formatTime(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Nå';
    if (hours < 24) return `${hours}t`;
    return `${Math.floor(hours / 24)}d`;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      {/* Hvermansen */}
      <TouchableOpacity
        style={styles.hvermansen}
        onPress={() => navigation.navigate('Conversations')}
        activeOpacity={0.85}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.hverLabel}>Alltid tilgjengelig</Text>
          <Text style={styles.hverTitle}>Skriv med{'\n'}Hvermansen</Text>
          <Text style={styles.hverSub}>Hvermansen lytter alltid</Text>
          <View style={styles.privacyBadge}>
            <Text style={styles.privacyDot}>🔒</Text>
            <Text style={styles.privacyText}>Meldingene dine er helt private</Text>
          </View>
        </View>
        <View style={styles.hverArrow}>
          <Text style={styles.hverArrowText}>→</Text>
        </View>
      </TouchableOpacity>

      {/* Fellesskap — mørk bakgrunn som Hvermansen */}
      <TouchableOpacity
        style={styles.fellesskap}
        onPress={() => navigation.navigate('Fellesskap')}
        activeOpacity={0.85}
      >
        <View style={styles.felleskapsTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardLabel}>Åpent for alle</Text>
            <Text style={styles.cardTitle}>Fellesskap</Text>
            <Text style={styles.cardSub}>Del og les hva andre tenker på</Text>
          </View>
          <View style={styles.cardArrow}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </View>

        {loadingThreads ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 16 }} />
        ) : threads.length > 0 ? (
          <View style={styles.previewList}>
            {threads.map((t, i) => (
              <View
                key={t.id}
                style={[
                  styles.previewItem,
                  i < threads.length - 1 && styles.previewItemBorder
                ]}
              >
                <View style={styles.previewMeta}>
                  <View style={styles.previewAuthorDot} />
                  <Text style={styles.previewAuthor}>{getDisplayName(t)}</Text>
                  <Text style={styles.previewTime}>{formatTime(t.created_at)}</Text>
                </View>
                <Text style={styles.previewText} numberOfLines={1}>
                  {t.content}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewText}>Ingen innlegg ennå — vær den første!</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Viktig å vite */}
      <TouchableOpacity
        style={styles.viktig}
        onPress={() => navigation.navigate('About')}
        activeOpacity={0.85}
      >
        <View>
          <Text style={styles.viktigTitle}>Viktig å vite</Text>
          <Text style={styles.viktigSub}>Krisetelefoner og om appen</Text>
        </View>
        <Text style={styles.viktigArrow}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32, gap: 12 },
  accountPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.warm, borderRadius: 20,
    paddingVertical: 6, paddingLeft: 6, paddingRight: 12,
    marginRight: Platform.OS === 'ios' ? 0 : 8,
  },
  accountAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.dark,
    justifyContent: 'center', alignItems: 'center',
  },
  accountAvatarText: { fontSize: 10, fontWeight: '800', color: C.primary },
  accountPillText: { fontSize: 12, fontWeight: '600', color: C.dark },

  // Hvermansen
  hvermansen: {
    backgroundColor: C.dark,
    borderRadius: 20, padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flex: 1, marginRight: 12 },
  hverLabel: {
    fontSize: 11, color: C.primary, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
  },
  hverTitle: {
    fontSize: 22, fontWeight: '800', color: C.bg,
    letterSpacing: -0.5, lineHeight: 26, marginBottom: 6,
  },
  hverSub: { fontSize: 13, color: C.light, marginBottom: 12 },
  privacyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 8, paddingVertical: 5, paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  privacyDot: { fontSize: 11 },
  privacyText: { fontSize: 11, color: '#A8998E', fontWeight: '500' },
  hverArrow: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  hverArrowText: { color: C.white, fontSize: 20, fontWeight: '700' },

  // Fellesskap — mørk som Hvermansen
  fellesskap: {
    backgroundColor: C.darkAlt,
    borderRadius: 20, padding: 22,
  },
  felleskapsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 11, color: C.primary, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
  },
  cardTitle: {
    fontSize: 22, fontWeight: '800', color: C.bg,
    letterSpacing: -0.5, marginBottom: 6,
  },
  cardSub: { fontSize: 13, color: C.light },
  cardArrow: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  cardArrowText: { color: C.bg, fontSize: 20, fontWeight: '700' },

  // Thread preview
  previewList: {
    marginTop: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  previewItem: { paddingVertical: 10 },
  previewItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  previewMeta: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, marginBottom: 3,
  },
  previewAuthorDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: C.primary,
  },
  previewAuthor: { fontSize: 12, fontWeight: '700', color: C.light },
  previewTime: { fontSize: 11, color: '#6B5B52', marginLeft: 'auto' },
  previewText: { fontSize: 13, color: '#D4C4B8', lineHeight: 19 },
  emptyPreview: {
    marginTop: 14, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)',
  },
  emptyPreviewText: { fontSize: 13, color: C.light, fontStyle: 'italic' },

  // Viktig
  viktig: {
    backgroundColor: C.warm, borderRadius: 16, padding: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  viktigTitle: { fontSize: 14, fontWeight: '700', color: C.dark },
  viktigSub: { fontSize: 12, color: C.light, marginTop: 2 },
  viktigArrow: { fontSize: 18, color: C.light },
});