import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import { PersonResidenceChange } from '@island.is/application/templates/children-residence-change'
import { PdfConstants } from './constants'
import { DistrictCommissionerLogo } from './districtCommissionerLogo'
import { User } from '@island.is/api/domains/national-registry'

export async function generateResidenceChangePdf(
  childrenAppliedFor: Array<PersonResidenceChange>,
  parentA: User,
  parentB: PersonResidenceChange,
  expiry: Array<string>,
  reason?: string,
): Promise<Buffer> {
  const formatSsn = (ssn: string) => {
    return ssn.replace(/(\d{6})(\d+)/, '$1-$2')
  }

  const doc = new PDFDocument({
    size: PdfConstants.PAGE_SIZE,
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })

  const addToDoc = (
    font: string,
    fontSize: number,
    lineGap: number,
    text: string,
  ) => {
    doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text)
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .image(
      DistrictCommissionerLogo,
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

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Samningur foreldra með sameiginlega forsjá um breytt lögheimili barna',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    'skv. 32.gr. barnalaga nr. 76/2003',
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Barn/börn undir 18 ára aldri sem erindið varðar',
  )

  childrenAppliedFor.map((c, i) =>
    addToDoc(
      PdfConstants.NORMAL_FONT,
      PdfConstants.VALUE_FONT_SIZE,
      i === childrenAppliedFor.length - 1
        ? PdfConstants.LARGE_LINE_GAP
        : PdfConstants.NO_LINE_GAP,
      `Nafn og kennitala barns: ${c.name}, ${formatSsn(c.ssn)}`,
    ),
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Foreldri A',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    `Nafn og kennitala: ${parentA.fullName}, ${formatSsn(parentA.nationalId)}`,
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    `Heimilisfang: ${parentA.address?.streetAddress}, ${parentA.address?.postalCode} ${parentA.address?.city}`,
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Foreldri B',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    `Nafn og kennitala: ${parentB.name}, ${formatSsn(parentB.ssn)}`,
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    `Heimilisfang: ${parentB.address}, ${parentB.postalCode} ${parentB.city}`,
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Lögheimilsbreyting:',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    `Fyrra lögheimili: ${parentA.fullName}, Foreldri A`,
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    `Nýtt lögheimili: ${parentB.name}, Foreldri B`,
  )

  if (reason) {
    addToDoc(
      PdfConstants.BOLD_FONT,
      PdfConstants.SUB_HEADER_FONT_SIZE,
      PdfConstants.NORMAL_LINE_GAP,
      'Tilefni breytingar',
    )

    addToDoc(
      PdfConstants.NORMAL_FONT,
      PdfConstants.VALUE_FONT_SIZE,
      PdfConstants.LARGE_LINE_GAP,
      reason,
    )
  }

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Gildistími samnings',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    expiry[0] === PdfConstants.PERMANENT
      ? 'Samningurinn er til frambúðar, þar til barnið hefur náð 18 ára aldri.'
      : `Samningurinn gildir til ${expiry[1]}`,
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Um réttaráhrif þess að barn hafi lögheimili hjá foreldri með sameiginlega forsjá:',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Litið er svo á að barn hafi fasta búsetu hjá því foreldri sem það á lögheimili hjá. Barn á rétt til að umgangast með reglubundnum hætti það foreldri sem það býr ekki hjá og bera foreldrarnir sameiginlega þá skyldu að tryggja rétt barns til umgengni.',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Skráning lögheimilis hefur margvísleg áhrif á ýmsum réttarsviðum. Sem dæmi má nefna að skyldur sveitarfélaga til að veita þjónustu innan velferðarkerfisins, t.d. samkvæmt lögum um félagsþjónustu sveitarfélaga, lögum um leikskóla og lögum um grunnskóla. Önnur þjónusta miðast einnig við búsetu í tilteknu umdæmi svo samkvæmt lögum um málefni fatlaðra. Þá miða lagareglur stundum gagngert við lögheimili, t.d. lagaákvæði um birtingar í lögum um meðferð einkamála og sakamála og reglur barnaverndarlaga um samstarf og samþykki foreldra vegna tiltekinna ráðstafana.',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Foreldrið sem barn er með lögheimili hjá, á rétt á að fá meðlag með barninu frá hinu foreldrinu.',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Foreldrið sem barn á lögheimili hjá hefur stöðu einstæðs foreldris samvkæmt skattalögum. Barnabætur vegna barns greiðast framfæranda barns og er við mat á því hver telst framfærandi fyrst og fremst litið til þess hjá hverjum barn er skráð til lögheimilis í árslok hjá Þjóðskrá. Sjá nánar á www.rsk.is',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Um ákvarðanatöku foreldra með sameiginlega forsjá er fjallað í 28. gr. a barnalaga en þar segir:',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    '„Þegar foreldrar fara sameiginlega með forsjá barns skulu þeir taka sameiginlega allar meiri háttar ákvarðanir sem varða barn. Ef foreldrar búa ekki saman hefur það foreldri sem barn á lögheimili hjá heimild til þess að taka afgerandi ákvarðanir um daglegt líf barnsins, svo sem um hvar barnið skuli eiga lögheimili innan lands, um val á leikskóla, grunnskóla og daggæslu, venjulega eða nauðsynlega heilbrigðisþjónustu og reglubundið tómstundastarf. Foreldrar sem fara saman með forsjá barns skulu þó ávallt leitast við að hafa samráð áður en þessum málefnum barns er ráðið til lykta. Ef annað forsjáforeldra barns er hindrað í að sinna forsjárskyldum sínum eru nauðsynlegar ákvarðanir hins um persónulega hagi barns gildar.“',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Samþykki beggja foreldra með sameiginlega forsjá þarf til þess að barn fari til útlanda. Hægt er að krefjast úrskurðar sýslumanns vegna ágreinins foreldra um utanlandsferð barns.',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    'Þegar annað foreldra á umgengisrétt við barn samkvæmt samningi, úrskurði, dómi eða dómsátt, ber hvoru foreldri að tilkynna hinu með minnst sex vikna fyrirvara, ef foreldri hyggst flytja lögheimili sitt og/eða barnsins hvort sem er innan lands eða utan',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    '* “Foreldrar“ eru hér einnig þeir stjúpforeldrar sem hafa fengið forsjá samvkæmt sérstökum samningi a grundvelli 29. gr. a. barnalaga',
  )

  doc.moveDown()

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    `Undirritaður/uð, ${parentA.fullName}, hefur heimilað fyrirspurn í Þjóðskrá og staðfest með undirritun sinni að ofangreindar upplýsingar séu réttar.`,
  )

  doc.end()

  const pdfBuffer = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdfBuffer
}
