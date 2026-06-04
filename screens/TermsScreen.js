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
        gjerne nøye.
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
        Hvermansen er ikke terapeut, lege eller psykolog. Appen erstatter
        ikke profesjonell hjelp. Samtalene er ment som en pust i hverdagen,
        ikke som behandling.
        {"\n\n"}
        <Text style={styles.bold}>I akutt fare:</Text> Ring 113 (medisinsk
        nødtelefon). Trenger du noen å snakke med? Ring Mental Helse på 116
        123 eller Kirkens SOS på 22 40 00 40.
      </Text>

      <Text style={styles.heading}>4. Aldersgrense</Text>
      <Text style={styles.body}>
        Du må være minst 16 år for å bruke MANNPOD Chat. Er du under 18, bør
        en forelder eller verge vite at du bruker appen.
      </Text>

      <Text style={styles.heading}>5. Slik skal du bruke appen</Text>
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

      <Text style={styles.heading}>6. Dette er ikke tillatt</Text>
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

      <Text style={styles.heading}>7. Innhold du deler</Text>
      <Text style={styles.body}>
        Du eier det du deler. Når du deler et innlegg i «Les hva andre
        deler», gir du oss tillatelse til å vise det anonymt til andre
        brukere. Vi forbeholder oss retten til å slette innhold som bryter
        disse vilkårene, uten varsel.
      </Text>

      <Text style={styles.heading}>8. Rapportering og moderering</Text>
      <Text style={styles.body}>
        Brukere kan rapportere innlegg som bryter vilkårene. Vi går gjennom
        rapporter så raskt vi kan og sletter innhold som ikke hører hjemme.
      </Text>

      <Text style={styles.heading}>9. Sletting og oppsigelse</Text>
      <Text style={styles.body}>
        Du kan slette kontoen din når du vil, fra «Min konto»-skjermen. Vi
        kan også stenge en konto hvis vilkårene brytes alvorlig eller
        gjentatt.
      </Text>

      <Text style={styles.heading}>10. Ansvarsbegrensning</Text>
      <Text style={styles.body}>
        MANNPOD Chat tilbys «som det er». Vi kan ikke garantere at appen
        alltid er tilgjengelig eller fri for feil. Foreningen er ikke
        ansvarlig for beslutninger du tar basert på samtaler i appen. Bruk
        sunn fornuft, og søk profesjonell hjelp når du trenger det.
      </Text>

      <Text style={styles.heading}>11. Endringer i vilkårene</Text>
      <Text style={styles.body}>
        Vilkårene kan endres over tid. Datoen øverst viser når de sist ble
        oppdatert. Vesentlige endringer varsles i appen.
      </Text>

      <Text style={styles.heading}>12. Norsk lov</Text>
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