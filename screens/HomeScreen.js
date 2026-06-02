// screens/HomeScreen.js
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Card from "../components/Card";
import { colors, spacing } from "../theme";

// "navigation" is handed to every screen automatically. We use it to move
// to other screens, e.g. navigation.navigate("Chat").
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.tagline}>
        
        </Text>
        <Card
          title="Min konto"
          text="Ta vare på samtalene dine."
          onPress={() => navigation.navigate("Account")}
        />

        {/* This card opens the Daily check-in screen when tapped */}
        <Card
          title="Daglig innsjekk"
          text="Hvordan har du det i dag?"
          onPress={() => navigation.navigate("CheckIn")}
        />

        {/* This card opens the Chat screen when tapped */}
       <Card
          title="Kan vi snakke litt?"
          text="Snakk med en som aldri sover."
          onPress={() => navigation.navigate("Conversations")}
        />

        {/* This card opens the Share screen when tapped */}
        <Card
          title="Les hva andre deler"
          text="Ord fra andre som også bærer på noe."
          onPress={() => navigation.navigate("Share")}
        />

        {/* This card opens the Podcast screen when tapped */}
      


        {/* This card opens the About screen when tapped */}
        <Card
          title="Viktig å vite"
          text="Om appen, og hjelp når det haster."
          onPress={() => navigation.navigate("About")}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
});