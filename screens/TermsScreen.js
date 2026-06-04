// screens/TermsScreen.js
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Vilkår for bruk</Text>
      <Text style={styles.updated}>Sist oppdatert: juni 2026</Text>

      <Text style={styles.intro}>
        Ved å bruke MANNPOD Chat aksepterer du disse vilkårene. Les dem
        gjerne nøye – de handler om hva appen er, og om sikkerheten din.
      </Text>

      <Text style={styles.heading}>1. Hvem som driver appen</Text>
      <Text style={styles.body}>
        MANNPOD Chat drives av foreningen{" "}
        <Text style={styles.bold}>Menn for mental helse</Text>{" "}
        (org.nr. 932 323 656), Vollskroken 4, 2930 Bagn.
      </Text>

      <Text style={styles.heading}>2. Hva MANNPOD Chat er</Text>
      <Text style={styles.body}>
        MANNPOD Chat er et rolig samtalested for menn, der du kan snakke med
        en kunstig samtalepartner kalt Hvermansen, sjekke inn med deg selv,
        og lese hva andre deler anonymt.
      </Text>

      <Text style={styles.heading}>3. Dette er ikke helsehjelp</Text>
      <Text style={styles.body}>
        Hvermansen er en kunstig samtalepartner. Den er{" "}
        <Text style={styles.bold}>ikke</Text> terapeut, lege eller psykolog.
        Appen erstatter ikke profesjonell hjelp, diagnose eller behandling.
        Samtalene er ment som en pust i hverdagen, ikke som behandling av
        psykiske lidelser.
      </Text>

      <Text style={styles.heading}>4. Appen er ikke for kriser</Text>
      <Text style={styles.body}>
        MANNPOD Chat er <Text style={styles.bold}>ikke egnet</Text> for å
        håndtere akutte kriser eller nødsituasjoner. Dersom du vurderer å
        skade deg selv eller andre, eller er i en akutt livssituasjon, må du
        kontakte nødetater eller profesjonelle hjelpetjenester{" "}
        <Text style={styles.bold}>umiddelbart</Text>.
        {"\n\n"}
        <Text style={styles.bold}>Ring 113</Text> ved akutt fare for liv og
        helse.
        {"\n"}
        <Text style={styles.bold}>Ring 116 123</Text> for Mental Helse, hele
        døgnet.
        {"\n"}
        <Text style={styles.bold}>Ring 22 40 00 40</Text> for Kirkens SOS.
        {"\n\n"}
        Hvermansen kan be deg om å kontakte disse tjenestene hvis han er
        bekymret. Det er fordi du fortjener ekte hjelp i ekte kriser.
      </Text>

      <Text style={styles.heading}>5. Begrensninger ved AI-samtaler</Text>
      <Text style={styles.body}>
        Hvermansen er en språkmodell. Det betyr:
      </Text>
      <Text style={styles.body}>
        • Svarene kan inneholde feil eller misforståelser.
        {"\n\n"}
        • Hvermansen kan ikke vurdere din helsesituasjon eller gi medisinske
        råd.
        {"\n\n"}
        • Hvermansen «husker» bare det dere har snakket om i denne samtalen
        og dine siste innsjekkinger – ikke hele livet ditt.
        {"\n\n"}
        Du bør bruke egen vurdering, og søke profesjonell hjelp når du
        trenger det.
      </Text>

      <Text style={styles.heading}>6. Aldersgrense</Text>
      <Text style={styles.body}>
        Du må være minst 16 år for å bruke MANNPOD Chat. Er du under 18, bør
        en forelder eller verge vite at du bruker appen.
      </Text>

      <Text style={styles.heading}>7. Slik skal du bruke appen</Text>
      <Text style={styles.body}>
        Du skal:
      </Text>
      <Text style={styles.body}>
        • Bruke appen til ditt eget formål – ikke for å skade andre.
        {"\n\n"}
        • Respektere andre brukere i delings-rommet.
        {"\n\n"}
        • Ikke dele kontaktinfo, personlige opplysninger om andre, eller
        innhold som identifiserer noen.
      </Text>

      <Text style={styles.heading}>8. Dette er ikke tillatt</Text>
      <Text style={styles.body}>
        Du skal ikke bruke appen til å:
      </Text>
      <Text style={styles.body}>
        • Trakassere, true eller skade andre.
        {"\n\n"}
        • Dele innhold som oppfordrer til vold, selvskading eller selvmord.
        {"\n\n"}
        • Dele seksuelt eller voldelig innhold som involverer mindreårige.
        {"\n\n"}
        • Spre hat mot etnisitet, religion, kjønn, legning eller andre
        grupper.
        {"\n\n"}
        • Markedsføre, selge eller spamme.
        {"\n\n"}
        • Forsøke å hacke, omgå sikkerhet eller misbruke appen teknisk.
      </Text>

      <Text style={styles.heading}>9. Innhold du deler</Text>
      <Text style={styles.body}>
        Du eier det du deler. Når du deler et innlegg i «Les hva andre
        deler», gir du oss tillatelse til å vise det anonymt til andre
        brukere. Vi forbeholder oss retten til å fjerne, redigere eller
        forsinke publisering av innhold som kan være skadelig, ulovlig eller
        i strid med formålet til tjenesten, uten varsel.
      </Text>

      <Text style={styles.heading}>10. Rapportering og moderering</Text>
      <Text style={styles.body}>
        Brukere kan rapportere innlegg som bryter vilkårene. Vi gjennomgår
        rapporter manuelt så raskt vi kan, men kan ikke garantere
        responstid. Moderering skjer av frivillige i foreningen, og MANNPOD
        Chat tilbyr ingen 24/7-overvåking av delings-rommet.
        {"\n\n"}
        Hvis du ser innhold som krever umiddelbar handling (trusler, akutt
        fare), kontakt politiet på 02800 i tillegg til å rapportere i
        appen.
      </Text>

      <Text style={styles.heading}>11. Sletting og oppsigelse</Text>
      <Text style={styles.body}>
        Du kan slette kontoen din når du vil, fra «Min konto»-skjermen. Vi
        kan også stenge en konto hvis vilkårene brytes alvorlig eller
        gjentatt.
      </Text>

      <Text style={styles.heading}>12. Ansvarsbegrensning</Text>
      <Text style={styles.body}>
        MANNPOD Chat tilbys «som det er». Vi kan ikke garantere at appen
        alltid er tilgjengelig, fri for feil eller at innholdet i samtaler
        med Hvermansen er korrekt.
        {"\n\n"}
        Foreningen er ikke ansvarlig for beslutninger du tar basert på
        samtaler i appen, eller for innhold andre brukere deler. Bruk sunn
        fornuft, og søk profesjonell hjelp når du trenger det.
        {"\n\n"}
        Så langt loven tillater, fraskriver foreningen seg ansvar for
        indirekte tap, følgeskader eller skader knyttet til bruk av eller
        manglende tilgang til tjenesten.
      </Text>

      <Text style={styles.heading}>13. Personvern</Text>
      <Text style={styles.body}>
        Hvordan vi behandler dine data er beskrevet i
        personvernerklæringen, tilgjengelig fra «Min konto» og «Viktig å
        vite».
      </Text>

      <Text style={styles.heading}>14. Endringer i vilkårene</Text>
      <Text style={styles.body}>
        Vilkårene kan endres over tid. Datoen øverst viser når de sist ble
        oppdatert. Vesentlige endringer varsles i appen. Fortsatt bruk etter
        slik varsling regnes som aksept av de nye vilkårene.
      </Text>

      <Text style={styles.heading}>15. Norsk lov</Text>
      <Text style={styles.body}>
        Disse vilkårene følger norsk lov. Eventuelle tvister behandles av
        norske domstoler.
      </Text>

      <Text style={styles.heading}>Kontakt</Text>
      <Text style={styles.body}>
        Spørsmål? Send en e-post til{" "}
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