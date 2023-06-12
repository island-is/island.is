import {
  Page,
  Text,
  Document,
  View,
  Font,
  StyleSheet,
} from '@react-pdf/renderer'

const MyPdfDocument = (data: { title: string; description: string }) => {
  const { title, description } = data
  return (
    <Document>
      <Page style={pdfStyles.body}>
        {/* Header */}

        {/* Body */}
        <View style={pdfStyles.listInfo}>
          <Text style={pdfStyles.title}>Upplýsingar um undirskriftalista</Text>
          <Text style={pdfStyles.header}>Heiti undirskriftalista</Text>
          <Text>{title}</Text>
          <Text style={pdfStyles.header}>Um undirskriftalista</Text>
          <Text>{description}</Text>
          <View style={pdfStyles.row}>
            <View>
              <Text style={pdfStyles.header}>Ábyrgðarmaður: </Text>
            </View>
            <View>
              <Text style={pdfStyles.header}>Opinn til: </Text>
            </View>
            <View>
              <Text style={pdfStyles.header}>Fjöldi undirskrifta: </Text>
            </View>
          </View>
        </View>
        <View style={pdfStyles.tableView}>
          <View style={pdfStyles.tableRow}>
            <Text style={pdfStyles.tableHeader}>Dags. skráð</Text>
            <Text style={pdfStyles.tableHeader}>Nafn</Text>
          </View>
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
    borderTop: `1px solid #ebebeb`,
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
