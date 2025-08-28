import {
  Page,
  Text,
  Document,
  Image,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer'
import logo from './logo.png'
import { dark200 } from '@island.is/island-ui/theme'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionListSummary,
} from '@island.is/api/schema'
import format from 'date-fns/format'

const PdfDocument = ({
  report,
  collectionType,
}: {
  report: SignatureCollectionListSummary
  collectionType: SignatureCollectionCollectionType
}) => {
  return (
    <Document>
      {report && (
        <Page style={styles.body} key={report.candidateName}>
          <View>
            <Text style={styles.pageTitle}>
              {report.listName?.split(' - ')[1]}
            </Text>
            <View style={styles.dividerLineBox}>
              <View style={styles.dividerLine} />
            </View>

            <Text style={styles.header}>Flokkur:</Text>
            <Text style={styles.text}>{report.candidateName}</Text>

            <Text style={styles.header}>Dagsetning:</Text>
            <Text style={styles.text}>
              {format(new Date(), 'dd.MM.yyyy HH:mm')}
            </Text>

            {collectionType ===
              SignatureCollectionCollectionType.Parliamentary && (
              <>
                <Text style={styles.header}>Listabókstafur:</Text>
                <Text style={styles.text}>{report.partyBallotLetter}</Text>
              </>
            )}

            <Text style={styles.header}>Rafræn meðmæli:</Text>
            <Text style={styles.text}>{report.nrOfDigitalSignatures}</Text>

            <Text style={styles.header}>Meðmæli af pappír:</Text>
            <Text style={styles.text}>{report.nrOfPaperSignatures}</Text>

            <Text style={styles.header}>Samtals fjöldi gildra meðmæla:</Text>
            <Text style={styles.text}>{report.nrOfSignatures}</Text>
          </View>

          <Image src={logo} style={styles.logo} fixed />
        </Page>
      )}
    </Document>
  )
}

export const styles = StyleSheet.create({
  body: {
    paddingVertical: 50,
    paddingHorizontal: 60,
    fontFamily: 'IBM Plex Sans',
    fontSize: 10,
  },
  pageTitle: {
    fontSize: 20,
  },
  dividerLineBox: {
    marginTop: 25,
    marginBottom: 10,
  },
  dividerLine: {
    borderTop: `1px solid ${dark200}`,
  },
  header: {
    fontSize: 14,
    marginTop: 25,
    fontWeight: 600,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
  },
  logo: {
    position: 'absolute',
    right: 60,
    bottom: 50,
    width: 50,
  },
})

Font.register({
  family: 'IBM Plex Sans',
  fonts: [
    {
      src: './assets/fonts/ibm-plex-sans-v7-latin-regular.ttf',
    },
    {
      src: './assets/fonts/ibm-plex-sans-v7-latin-600.ttf',
      fontWeight: 600,
    },
  ],
})

export default PdfDocument
