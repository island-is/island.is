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

const MyPdfDocument = (data: any) => {
  return (
  <Document>
    <Page style={pdfStyles.body}>
      {/* Header */}
      <View style={pdfStyles.pageHeader} fixed>
        <Image src={require('./assets/top.png')} style={pdfStyles.topImage} />
      </View>
      <Image
        src={require('./assets/skraLogo.png')}
        style={pdfStyles.image}
        fixed
      />

      {/* Body */}
      <View>
        <Text style={pdfStyles.title}>Upplýsingar um undirskriftalista</Text>
        <Text style={pdfStyles.header}>Heiti undirskriftalista</Text>
        <Text>{data.petition?.title}</Text>
        <Text style={pdfStyles.header}>Um undirskriftalista</Text>
        <Text>{data.petition?.description}</Text>
        <View style={pdfStyles.row}>
          <View>
            <Text style={pdfStyles.header}>Ábyrgðarmaður: </Text>
            <Text>{data.petition?.ownerName}</Text>
          </View>
          <View>
            <Text style={pdfStyles.header}>Opinn til: </Text>
            <Text>{formatDate(data.petition?.closedDate)}</Text>
          </View>
          <View>
            <Text style={pdfStyles.header}>Fjöldi undirskrifta: </Text>
            <Text>{data.petitionSigners?.totalCount}</Text>
          </View>
        </View>
      </View>
      <View style={pdfStyles.tableView}>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableHeader}>Dags. skráð</Text>
          <Text style={pdfStyles.tableHeader}>Nafn</Text>
        </View>
        <View>
          {data.petitionSigners?.data?.map((sign: any) => {
            return (
              <View key={sign.id} style={pdfStyles.tableRow}>
                <Text style={{ width: '20%' }}>{formatDate(sign.created)}</Text>
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
        src={require('./assets/footerbanner.png')}
        style={pdfStyles.footerBanner}
        fixed
      />
    </Page>
  </Document>
  )
}

export const pdfStyles = StyleSheet.create({
  body: {
    paddingTop: 55,
    paddingBottom: 140,
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
  tableView: {
    marginTop: 50,
  },
  tableRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  listDetailSection: {
    paddingHorizontal: 50,
  },
  documentHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
  },
  documentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00003C',
    height: 100,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
  image: {
    width: 120,
    marginBottom: 30,
  },
  topImage: {
    right: 0,
    position: 'absolute',
    height: 35,
    width: 370,
  },
  bottomImageLeft: {
    left: 0,
    position: 'absolute',
    width: 120,
    bottom: 0,
    margin: 15,
  },
  footerBanner: {
    right: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
  },
  pageHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
})

Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src:
        'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
    },
    {
      src:
        'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf',
      fontWeight: 600,
    },
  ],
})

export default MyPdfDocument