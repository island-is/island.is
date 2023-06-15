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

const MyPdfDocument = (data: {
  petition?: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
}) => {
  const { petition, petitionSigners } = data
  return (
    <Document>
      <Page style={pdfStyles.body}>
        {/* Header */}
        <Image
          src={'./assets/images/thjodskra.png'}
          style={pdfStyles.image}
          fixed
        />

        {/* Body */}
        <View style={pdfStyles.listInfo}>
          <Text style={pdfStyles.title}>Upplýsingar um undirskriftalista</Text>
          <Text style={pdfStyles.header}>Heiti undirskriftalista</Text>
          <Text>{petition?.title}</Text>
          <Text style={pdfStyles.header}>Um undirskriftalista</Text>
          <Text>{petition?.description}</Text>
          <View style={pdfStyles.row}>
            <View>
              <Text style={pdfStyles.header}>Ábyrgðarmaður: </Text>
              <Text>{petition?.ownerName}</Text>
            </View>
            <View>
              <Text style={pdfStyles.header}>Opinn til: </Text>
              <Text>{formatDate(petition?.closedDate)}</Text>
            </View>
            <View>
              <Text style={pdfStyles.header}>Fjöldi undirskrifta: </Text>
              <Text>{petitionSigners?.totalCount}</Text>
            </View>
          </View>
        </View>
        <View style={pdfStyles.tableView}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableHeader}>Dags. skráð</Text>
            <Text style={pdfStyles.tableHeader}>Nafn</Text>
          </View>
          <View>
            {petitionSigners?.data?.map((sign: Endorsement) => {
              return (
                <View key={sign.id} style={pdfStyles.tableRow}>
                  <Text style={{ width: '20%' }}>
                    {formatDate(sign.created)}
                  </Text>
                  <Text>
                    {sign.meta.fullName ? sign.meta.fullName : 'no name'}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Footer */}
        <Image
          src={'./assets/images/island.png'}
          style={pdfStyles.footerImage}
          fixed
        />
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

Font.register({
  family: 'Open Sans',
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

export default MyPdfDocument
