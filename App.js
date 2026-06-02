import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { colors } from "./theme";
import { supabase } from "./supabaseClient";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import CheckInScreen from "./screens/CheckInScreen";
import LogScreen from "./screens/LogScreen";
import AccountScreen from "./screens/AccountScreen";
import ShareScreen from "./screens/ShareScreen";
import LoadingScreen from "./screens/LoadingScreen";
import AboutScreen from "./screens/AboutScreen";
import ConversationsScreen from "./screens/ConversationsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

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
      setReady(true);
    }
    signInQuietly();
  }, []);

  if (!ready) {
    return <LoadingScreen />;
  }

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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "MANNPOD+" }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: "Kan vi snakke litt?" }} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: "Daglig innsjekk" }} />
        <Stack.Screen name="Log" component={LogScreen} options={{ title: "Min logg" }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: "Min konto" }} />
        <Stack.Screen name="Share" component={ShareScreen} options={{ title: "Les hva andre deler" }} />
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
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}