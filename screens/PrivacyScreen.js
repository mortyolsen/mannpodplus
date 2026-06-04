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

      <Text style={styles.heading}>Databehandlere vi bruker</Text>
      <Text style={styles.body}>
        For å levere tjenesten benytter vi følgende databehandlere:
      </Text>
      <Text style={styles.body}>
        • <Text style={styles.bold}>Supabase</Text> (EU/Frankfurt): Lagrer
        kontoer, samtaler, innsjekkinger og delte innlegg. Data lagres innenfor
        EØS.
        {"\n\n"}
        • <Text style={styles.bold}>Anthropic</Text> (USA): Tar imot meldingene
        dine for at Hvermansen skal kunne svare. Vi har konfigurert tjenesten
        slik at innhold ikke brukes til å trene modeller. Anthropic kan likevel
        oppbevare data i kort tid for sikkerhets- og misbrukskontroll. Se
        Anthropics personvernerklæring for detaljer.
        {"\n\n"}
        • <Text style={styles.bold}>Vercel</Text> (EU/global): Leverer selve
        appen til nettleseren din. Behandler tekniske data som IP-adresse for
        å levere innholdet.
        {"\n\n"}
        Overføring til USA skjer på grunnlag av EUs standardkontraktbestemmelser
        og EU-US Data Privacy Framework.
      </Text>

      <Text style={styles.heading}>Hvor lenge vi lagrer</Text>
      <Text style={styles.body}>
        Vi lagrer dine data så lenge kontoen din eksisterer. Når du sletter
        kontoen, fjernes data fra våre aktive systemer uten ugrunnet opphold.
        Enkelte opplysninger kan forbli i automatiske sikkerhetskopier i en
        begrenset periode (vanligvis inntil 30 dager) før de slettes
        automatisk. Vi henter ikke disse dataene tilbake.
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

      <Text style={styles.heading}>Vi sporer deg ikke</Text>
      <Text style={styles.body}>
        Vi bruker ikke analyseverktøy, sporingsverktøy eller annonsetjenester.
        Vi selger ikke data. Vi deler ikke data med tredjeparter utover
        databehandlerne nevnt over. Skulle vi senere ta i bruk et verktøy som
        krasjrapportering eller analyse, vil vi oppdatere denne erklæringen
        først.
      </Text>

      <Text style={styles.heading}>Sikkerhet</Text>
      <Text style={styles.body}>
        Vi bruker etablerte tjenester med kryptert overføring (HTTPS) og
        kryptert lagring. Passord lagres aldri i klartekst, kun som irreversible
        krypteringssummer. Ingen tjeneste kan likevel garantere fullstendig
        sikkerhet, og du oppfordres til å bruke et unikt passord.
      </Text>

      <Text style={styles.heading}>Aldersgrense</Text>
      <Text style={styles.body}>
        MANNPOD Chat er for personer over 16 år. Vi samler ikke bevisst inn
        data fra barn under 16. Hvis du oppdager at et barn har opprettet
        konto, ber vi om at du gir oss beskjed slik at vi kan slette kontoen.
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