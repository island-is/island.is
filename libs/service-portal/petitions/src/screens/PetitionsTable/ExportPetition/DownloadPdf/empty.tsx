import { Page, Text, Document, View } from '@react-pdf/renderer'

const MyPdfDocument = () => {
  return (
    <Document>
      <Page>
        {/* Header */}

        {/* Body */}
        <View>
          <Text>Upplýsingar um undirskriftalista</Text>
          <Text>Heiti undirskriftalista</Text>
        </View>
      </Page>
    </Document>
  )
}

export default MyPdfDocument
