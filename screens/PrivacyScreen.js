// screens/PrivacyScreen.js
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Personvernerklæring</Text>
      <Text style={styles.updated}>Sist oppdatert: juni 2026</Text>

      <Text style={styles.intro}>
        Denne erklæringen forklarer hvordan MANNPOD Chat samler inn, lagrer og
        bruker personopplysningene dine. Den følger norsk personopplysningslov
        og EUs personvernforordning (GDPR).
      </Text>

      <Text style={styles.heading}>Behandlingsansvarlig</Text>
      <Text style={styles.body}>
        Foreningen <Text style={styles.bold}>Menn for mental helse</Text> er
        behandlingsansvarlig for MANNPOD Chat.
        {"\n\n"}
        Organisasjonsnummer: 932 323 656
        {"\n"}
        Adresse: Vollskroken 4, 2930 Bagn
        {"\n"}
        E-post: <Text style={styles.link}>kontakt@mannpod.no</Text>
      </Text>

      <Text style={styles.heading}>Hva vi lagrer</Text>
      <Text style={styles.body}>
        Vi lagrer kun det som er nødvendig for at appen skal fungere:
      </Text>
      <Text style={styles.body}>
        • <Text style={styles.bold}>Anonym bruker-ID:</Text> Når du åpner
        appen, opprettes en anonym konto automatisk. Vi vet ikke hvem du er.
        {"\n\n"}
        • <Text style={styles.bold}>E-post (valgfritt):</Text> Hvis du
        oppretter en konto for å beholde samtalene dine på tvers av enheter,
        lagrer vi e-posten og et kryptert passord.
        {"\n\n"}
        • <Text style={styles.bold}>Samtaler med Hvermansen:</Text> Meldinger
        du sender og svar du får, knyttet til din bruker-ID.
        {"\n\n"}
        • <Text style={styles.bold}>Innsjekkinger:</Text> Stress- og
        energinivå (1–10) og notater du selv skriver.
        {"\n\n"}
        • <Text style={styles.bold}>Delte innlegg:</Text> Tekst du selv velger
        å dele anonymt med andre brukere.
      </Text>

      <Text style={styles.heading}>Rettslig grunnlag</Text>
      <Text style={styles.body}>
        Behandlingen er basert på ditt samtykke (GDPR artikkel 6 nr. 1
        bokstav a) når du oppretter konto og deler innhold, og på berettiget
        interesse (artikkel 6 nr. 1 bokstav f) for å holde tjenesten trygg og
        fungerende.
      </Text>

      <Text style={styles.heading}>Hvor det lagres</Text>
      <Text style={styles.body}>
        All data lagres hos Supabase i EU (Frankfurt, Tyskland). Data forlater
        ikke EØS. Samtalene dine sendes til Anthropic (USA) for at Hvermansen
        skal kunne svare deg. Anthropic lagrer ikke samtalene.
      </Text>

      <Text style={styles.heading}>Hvor lenge vi lagrer</Text>
      <Text style={styles.body}>
        Data lagres så lenge kontoen din eksisterer. Når du sletter kontoen,
        slettes alt umiddelbart og permanent.
      </Text>

      <Text style={styles.heading}>Dine rettigheter</Text>
      <Text style={styles.body}>
        Etter GDPR har du rett til:
      </Text>
      <Text style={styles.body}>
        • <Text style={styles.bold}>Innsyn:</Text> Se hvilke opplysninger vi
        har lagret om deg.
        {"\n\n"}
        • <Text style={styles.bold}>Retting:</Text> Få rettet feilaktige
        opplysninger.
        {"\n\n"}
        • <Text style={styles.bold}>Sletting:</Text> Slette kontoen din når du
        vil, fra «Min konto»-skjermen.
        {"\n\n"}
        • <Text style={styles.bold}>Dataportabilitet:</Text> Få utlevert dine
        data i et lesbart format.
        {"\n\n"}
        • <Text style={styles.bold}>Innsigelse:</Text> Protestere på vår
        behandling av dine data.
        {"\n\n"}
        • <Text style={styles.bold}>Klage:</Text> Klage til Datatilsynet hvis
        du mener vi behandler dine data feil. Se{" "}
        <Text style={styles.link}>datatilsynet.no</Text>.
      </Text>

      <Text style={styles.heading}>Hva vi ikke gjør</Text>
      <Text style={styles.body}>
        Vi selger ikke data. Vi deler ikke data med annonsører eller
        tredjeparter (utover Supabase og Anthropic som vi trenger for at appen
        skal fungere). Vi sporer deg ikke på tvers av andre nettsteder.
      </Text>

      <Text style={styles.heading}>Sikkerhet</Text>
      <Text style={styles.body}>
        Vi bruker etablerte tjenester (Supabase, Vercel) med kryptert
        overføring (HTTPS) og kryptert lagring. Passord lagres aldri i
        klartekst, kun som irreversible krypteringssummer.
      </Text>

      <Text style={styles.heading}>Endringer</Text>
      <Text style={styles.body}>
        Hvis denne erklæringen endres, oppdateres datoen øverst. Vesentlige
        endringer varsles i appen.
      </Text>

      <Text style={styles.heading}>Kontakt</Text>
      <Text style={styles.body}>
        Spørsmål om personvern? Send en e-post til{" "}
        <Text style={styles.link}>kontakt@mannpod.no</Text>.
      </Text>

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  updated: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.lg,
  },
  intro: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.lg,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: spacing.sm,
  },
  bold: { fontWeight: "700" },
  link: { color: colors.accent },
});