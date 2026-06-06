import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { colors } from "./theme";
import { supabase } from "./supabaseClient";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LogScreen from "./screens/LogScreen";
import AccountScreen from "./screens/AccountScreen";
import ShareScreen from "./screens/ShareScreen";
import LoadingScreen from "./screens/LoadingScreen";
import AboutScreen from "./screens/AboutScreen";
import ConversationsScreen from "./screens/ConversationsScreen";
import PrivacyScreen from "./screens/PrivacyScreen";
import TermsScreen from "./screens/TermsScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import FellesskapScreen from "./screens/FellesskapScreen";
import ThreadScreen from "./screens/ThreadScreen";
import UsernameScreen from "./screens/UsernameScreen";

const Stack = createNativeStackNavigator();

const ONBOARDING_KEY = "mannpod_onboarded_v1";

function readOnboardedFlag() {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.localStorage.getItem(ONBOARDING_KEY) === "true";
    }
  } catch (_e) {}
  return false;
}

function writeOnboardedFlag() {
  try {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "true");
    }
  } catch (_e) {}
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function signInQuietly() {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("STARTUP: session =", data.session ? "exists" : "none");

        if (data.session) {
          const { error: userErr } = await supabase.auth.getUser();
          if (userErr) {
            console.log("STARTUP: stored user invalid →", userErr.message);
            await supabase.auth.signOut();
            const { error } = await supabase.auth.signInAnonymously();
            console.log("STARTUP: fresh anon →", error ? error.message : "OK");
          } else {
            console.log("STARTUP: existing user valid");
          }
        } else {
          const { error } = await supabase.auth.signInAnonymously();
          console.log("STARTUP: new anon →", error ? error.message : "OK");
        }
      } catch (e) {
        console.error("STARTUP CRASH:", e.message);
      }

      const onboarded = readOnboardedFlag();
      setNeedsOnboarding(!onboarded);
      setReady(true);
    }
    signInQuietly();
  }, []);

  function finishOnboarding() {
    writeOnboardedFlag();
    setNeedsOnboarding(false);
  }

  if (!ready) return <LoadingScreen />;
  if (needsOnboarding) return <OnboardingScreen onDone={finishOnboarding} />;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "MANNPOD" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: "Chat med Hvermansen" }}
        />
        <Stack.Screen
          name="Log"
          component={LogScreen}
          options={{ title: "Min logg" }}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
          options={{ title: "Min konto" }}
        />
        <Stack.Screen
          name="Share"
          component={ShareScreen}
          options={{ title: "Fellesskap" }}
        />
        <Stack.Screen
          name="Fellesskap"
          component={FellesskapScreen}
          options={{ title: "MANNPOD fellesskap" }}
        />
        <Stack.Screen
          name="Thread"
          component={ThreadScreen}
          options={{ title: "Tråd" }}
        />
        <Stack.Screen
          name="Username"
          component={UsernameScreen}
          options={{ title: "Brukernavn" }}
        />
        <Stack.Screen
          name="Conversations"
          component={ConversationsScreen}
          options={{ title: "Mine samtaler" }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "Viktig å vite" }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ title: "Personvern" }}
        />
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{ title: "Vilkår" }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}