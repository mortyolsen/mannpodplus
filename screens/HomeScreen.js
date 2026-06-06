import { useEffect } from "react";
import {
  ScrollView, StyleSheet, Text, View,
  TouchableOpacity, Platform
} from "react-native";

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
};

export default function HomeScreen({ navigation }) {
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
  }, [navigation]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      {/* Øverste kort */}
      <View style={styles.topCards}>
        <TouchableOpacity
          style={styles.hvermansen}
          onPress={() => navigation.navigate('Conversations')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.hverLabel}>Alltid tilgjengelig</Text>
            <Text style={styles.hverTitle}>Chat med Hvermansen</Text>
            <Text style={styles.hverSub}>Hvermansen lytter alltid</Text>
          </View>
          <View style={styles.hverArrow}>
            <Text style={styles.hverArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Fellesskap')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.cardLabel}>Åpent for alle</Text>
            <Text style={styles.cardTitle}>Fellesskap</Text>
            <Text style={styles.cardSub}>Del og les hva andre bærer på</Text>
          </View>
          <View style={styles.cardArrow}>
            <Text style={styles.cardArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Viktig å vite — alltid nederst */}
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
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  topCards: {
    gap: 10,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.warm,
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 12,
    marginRight: Platform.OS === 'ios' ? 0 : 8,
  },
  accountAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: C.dark,
    justifyContent: 'center', alignItems: 'center',
  },
  accountAvatarText: {
    fontSize: 10, fontWeight: '800', color: C.primary,
  },
  accountPillText: {
    fontSize: 12, fontWeight: '600', color: C.dark,
  },
  hvermansen: {
    backgroundColor: C.dark,
    borderRadius: 20, padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hverLabel: {
    fontSize: 11, color: C.primary,
    fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: 4,
  },
  hverTitle: {
    fontSize: 18, fontWeight: '800',
    color: C.bg, letterSpacing: -0.3, marginBottom: 3,
  },
  hverSub: {
    fontSize: 13, color: C.light,
  },
  hverArrow: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  hverArrowText: {
    color: C.white, fontSize: 18, fontWeight: '700',
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 20, padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 11, color: C.light,
    fontWeight: '600', textTransform: 'uppercase',
    letterSpacing: 0.6, marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18, fontWeight: '800',
    color: C.dark, letterSpacing: -0.3, marginBottom: 3,
  },
  cardSub: {
    fontSize: 13, color: C.mid,
  },
  cardArrow: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.warm,
    justifyContent: 'center', alignItems: 'center',
  },
  cardArrowText: {
    color: C.dark, fontSize: 18, fontWeight: '700',
  },
  viktig: {
    backgroundColor: C.warm,
    borderRadius: 16, padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  viktigTitle: {
    fontSize: 14, fontWeight: '700', color: C.dark,
  },
  viktigSub: {
    fontSize: 12, color: C.light, marginTop: 2,
  },
  viktigArrow: {
    fontSize: 18, color: C.light,
  },
});