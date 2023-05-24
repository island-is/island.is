import { PdfConstants } from './constants'
import PDFDocument from 'pdfkit'

export const formatSsn = (ssn: string) => {
  return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
}

const addToDoc = (
  font: string,
  fontSize: number,
  lineGap: number,
  text: string,
  doc: PDFKit.PDFDocument,
) => {
  doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text)
}

export const addHeader = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.BOLD_FONT,
  lineGap = PdfConstants.NORMAL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.HEADER_FONT_SIZE, lineGap, text, doc)
}

export const addSubheader = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.BOLD_FONT,
  lineGap = PdfConstants.NORMAL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.SUB_HEADER_FONT_SIZE, lineGap, text, doc)
}

export const addValue = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.NORMAL_FONT,
  lineGap = PdfConstants.NO_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.VALUE_FONT_SIZE, lineGap, text, doc)
}

export const addSubtitle = (
  text: string,
  doc: PDFKit.PDFDocument,
  weight = PdfConstants.NORMAL_FONT,
  lineGap = PdfConstants.SMALL_LINE_GAP,
) => {
  addToDoc(weight, PdfConstants.SMALL_FONT_SIZE, lineGap, text, doc)
}

export const newDocument = () => {
  return new PDFDocument({
    size: PdfConstants.PAGE_SIZE,
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })
}

export const addLogo = (doc: PDFKit.PDFDocument, logo: string) => {
  doc
    .image(
      logo,
      doc.page.width -
        PdfConstants.HORIZONTAL_MARGIN -
        PdfConstants.IMAGE_WIDTH,
      PdfConstants.VERTICAL_MARGIN,
      {
        fit: [PdfConstants.IMAGE_WIDTH, PdfConstants.IMAGE_HEIGHT],
        align: 'right',
      },
    )
    .moveDown()
}

export const addLegalEffect = (doc: PDFKit.PDFDocument) => {
  addSubheader(
    'Um réttaráhrif þess að barn hafi lögheimili hjá foreldri með sameiginlega forsjá:',
    doc,
  )
  addSubtitle(
    'Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Skráning lögheimilis hefur margvísleg áhrif á ýmsum réttarsviðum. Sem dæmi má nefna að skyldur sveitarfélaga til að veita þjónustu innan velferðarkerfisins, t.d. samkvæmt lögum um félagsþjónustu sveitarfélaga, lögum um leikskóla og lögum um grunnskóla. Önnur þjónusta miðast einnig við búsetu í tilteknu umdæmi svo samkvæmt lögum um málefni fatlaðra. Þá miða lagareglur stundum gagngert við lögheimili, t.d. lagaákvæði um birtingar í lögum um meðferð einkamála og sakamála og reglur barnaverndarlaga um samstarf og samþykki foreldra vegna tiltekinna ráðstafana.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Foreldrið sem barn er með lögheimili hjá, getur fengið meðlag með barninu frá hinu foreldrinu.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Foreldrið sem barn á lögheimili hjá hefur stöðu einstæðs foreldris samkvæmt skattalögum. Barnabætur vegna barns greiðast framfæranda barns og er við mat á því hver telst framfærandi fyrst og fremst litið til þess hjá hverjum barn er skráð til lögheimilis í árslok hjá Þjóðskrá. Sjá nánar á www.rsk.is',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Um ákvarðanatöku foreldra með sameiginlega forsjá er fjallað í 28. gr. a barnalaga en þar segir:',
    doc,
  )
  addSubtitle(
    '„Þegar foreldrar fara sameiginlega með forsjá barns skulu þeir taka sameiginlega allar meiri háttar ákvarðanir sem varða barn. Ef foreldrar búa ekki saman hefur það foreldri sem barn á lögheimili hjá heimild til þess að taka afgerandi ákvarðanir um daglegt líf barnsins, svo sem um hvar barnið skuli eiga lögheimili innan lands, um val á leikskóla, grunnskóla og daggæslu, venjulega eða nauðsynlega heilbrigðisþjónustu og reglubundið tómstundastarf. Foreldrar sem fara saman með forsjá barns skulu þó ávallt leitast við að hafa samráð áður en þessum málefnum barns er ráðið til lykta. Ef annað forsjáforeldra barns er hindrað í að sinna forsjárskyldum sínum eru nauðsynlegar ákvarðanir hins um persónulega hagi barns gildar.“',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Samþykki beggja foreldra með sameiginlega forsjá þarf til þess að barn fari til útlanda. Hægt er að krefjast úrskurðar sýslumanns vegna ágreinings foreldra um utanlandsferð barns.',
    doc,
  )
  doc.moveDown()
  addSubtitle(
    'Þegar annað foreldra á umgengisrétt við barn samkvæmt samningi, úrskurði, dómi eða dómsátt, ber hvoru foreldri að tilkynna hinu með minnst sex vikna fyrirvara, ef foreldri hyggst flytja lögheimili sitt og/eða barnsins hvort sem er innan lands eða utan',
    doc,
  )
  addSubtitle(
    '* “Foreldrar“ eru hér einnig þeir stjúpforeldrar sem hafa fengið forsjá samkvæmt sérstökum samningi a grundvelli 29. gr. a. barnalaga',
    doc,
  )
  doc.moveDown()
}
