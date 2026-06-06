import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { supabase } from '../supabaseClient';

const C = {
  bg: '#FAF7F2', warm: '#F5EFE6', white: '#FFFFFF',
  dark: '#1C1714', primary: '#C17B4E',
  mid: '#6B5B52', light: '#A8998E', border: '#EDE5DA',
};

export default function UsernameScreen({ route, navigation }) {
  const { returnTo, thread } = route.params || {};
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveUsername() {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      Alert.alert('For kort', 'Brukernavnet må ha minst 2 tegn.');
      return;
    }
    if (trimmed.length > 30) {
      Alert.alert('For langt', 'Brukernavnet kan ikke være lenger enn 30 tegn.');
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id);

    if (error?.code === '23505') {
      Alert.alert('Opptatt', 'Dette brukernavnet er allerede i bruk. Prøv et annet.');
      setSaving(false);
      return;
    }

    if (error) {
      Alert.alert('Noe gikk galt', 'Prøv igjen.');
      setSaving(false);
      return;
    }

    setSaving(false);

    if (returnTo === 'Thread' && thread) {
      navigation.replace('Thread', { thread });
    } else {
      navigation.navigate('Fellesskap');
    }
  }

  function skipToAnonymous() {
    if (returnTo === 'Thread' && thread) {
      navigation.replace('Thread', { thread });
    } else {
      navigation.navigate('Fellesskap');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <View style={styles.top}>
          <Text style={styles.title}>Velg et brukernavn</Text>
          <Text style={styles.sub}>
            Brukernavnet vises når du deler i fellesskapet.
            Du kan alltid velge å poste anonymt i stedet.
          </Text>
        </View>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Ditt brukernavn"
            placeholderTextColor={C.light}
            value={username}
            onChangeText={setUsername}
            maxLength={30}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          <Text style={styles.charCount}>{username.length}/30</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, (!username.trim() || saving) && styles.saveBtnDisabled]}
          onPress={saveUsername}
          disabled={!username.trim() || saving}
        >
          <Text style={styles.saveBtnText}>
            {saving ? 'Lagrer...' : 'Lagre brukernavn'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={skipToAnonymous}>
          <Text style={styles.skipText}>Fortsett anonymt i stedet</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: {
    flex: 1, padding: 28,
    justifyContent: 'center',
  },
  top: { marginBottom: 32 },
  title: {
    fontSize: 26, fontWeight: '800',
    color: C.dark, letterSpacing: -0.5,
    marginBottom: 10,
  },
  sub: {
    fontSize: 15, color: C.mid,
    lineHeight: 23,
  },
  inputWrap: {
    backgroundColor: C.white,
    borderRadius: 16, padding: 16,
    marginBottom: 14,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontSize: 18, color: C.dark,
    fontWeight: '600',
  },
  charCount: {
    fontSize: 11, color: C.light,
    textAlign: 'right', marginTop: 6,
  },
  saveBtn: {
    backgroundColor: C.dark,
    borderRadius: 16, padding: 16,
    alignItems: 'center', marginBottom: 12,
  },
  saveBtnDisabled: { backgroundColor: C.border },
  saveBtnText: {
    color: C.bg, fontSize: 16,
    fontWeight: '700', letterSpacing: -0.2,
  },
  skipBtn: {
    alignItems: 'center', padding: 12,
  },
  skipText: {
    fontSize: 14, color: C.light,
    fontWeight: '500',
  },
});