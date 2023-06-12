import {
  Page,
  Text,
  Document,
  Image,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer'
import { formatDate } from '../../../../lib/utils'
import {
  Endorsement,
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import { dark200 } from '@island.is/island-ui/theme'

const MyPdfDocument = () => {
  return (
    <Document>
      <Page style={pdfStyles.body}>
        {/* Header */}

        {/* Body */}
        <View style={pdfStyles.listInfo}>
          <Text style={pdfStyles.title}>Upplýsingar um undirskriftalista</Text>
          <Text style={pdfStyles.header}>Heiti undirskriftalista</Text>
        </View>
      </Page>
    </Document>
  )
}

export const pdfStyles = StyleSheet.create({
  body: {
    paddingVertical: 50,
    paddingHorizontal: 60,
    fontFamily: 'Open Sans',
    fontSize: 10,
  },
  title: {
    fontSize: 24,
  },
  header: {
    fontSize: 14,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 5,
  },
  tableHeader: {
    fontWeight: 600,
    marginBottom: 5,
    width: '20%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listInfo: {
    paddingBottom: 30,
  },
  tableView: {
    paddingTop: 35,
    borderTop: `1px solid ${dark200}`,
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  image: {
    width: 120,
    marginBottom: 30,
  },
  footerImage: {
    position: 'absolute',
    left: 60,
    bottom: 50,
    width: 120,
  },
})

export default MyPdfDocument
