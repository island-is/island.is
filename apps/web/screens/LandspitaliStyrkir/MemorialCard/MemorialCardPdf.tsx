import React from 'react'
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text as PdfText,
  View,
} from '@react-pdf/renderer'

// Optional: use a serif font for authenticity
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/timesnewroman/v11/S5XkU5YyM9WaGVmyDywbH7Uwl3S9QDJI.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
  },
  topText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 60,
  },
  mainTextWrapper: {
    textAlign: 'center',
    marginBottom: 80,
    paddingHorizontal: 30,
  },
  line: {
    marginTop: 6,
    marginBottom: 12,
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 70,
    left: 40,
    right: 40,
  },
  sympathy: {
    textAlign: 'right',
    marginBottom: 10,
  },
  sender: {
    textAlign: 'right',
    fontWeight: 'normal',
    fontSize: 12,
  },
  logoText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
})

export const StyledMemorialCard = ({
  date,
  fund,
  inMemoryOf,
  senderSignature,
}: {
  date: string
  fund: string
  inMemoryOf: string
  senderSignature: string
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <PdfText style={styles.topText}>{date}</PdfText>
      <View style={styles.mainTextWrapper}>
        <PdfText>{fund}</PdfText>
        <PdfText>hefur verið færð gjöf til minningar um</PdfText>
        <PdfText style={styles.line}>{inMemoryOf}</PdfText>
      </View>

      <View style={styles.bottomWrapper}>
        <PdfText style={styles.sympathy}>Með innilegri samúðarkveðju</PdfText>
        <PdfText style={styles.sender}>{senderSignature}</PdfText>
        <PdfText style={styles.logoText}>Landspítali</PdfText>
      </View>
    </Page>
  </Document>
)
