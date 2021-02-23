import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'
import { PdfConstants } from './constants'
import { DistrictCommissionerLogo } from './districtCommissionerLogo'

export async function generateResidenceChangePdf(
  childrenAppliedFor: Array<PersonResidenceChange>,
  parentA: ParentResidenceChange,
  parentB: ParentResidenceChange,
  expiry: string,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: PdfConstants.PAGE_SIZE,
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })

  const parentHomeAddress = (parent: ParentResidenceChange) => {
    return `${parent.address}, ${parent.postalCode} ${parent.city}`
  }

  const addToDoc = (
    font: string,
    fontSize: number,
    lineGap: number,
    text: string,
  ) => {
    doc.font(font).fontSize(fontSize).lineGap(lineGap).text(text)
  }

  const addParentToDoc = (header: string, parent: ParentResidenceChange) => {
    addToDoc(
      PdfConstants.BOLD_FONT,
      PdfConstants.SUB_HEADER_FONT_SIZE,
      PdfConstants.NORMAL_LINE_GAP,
      header,
    )
    addToDoc(
      PdfConstants.NORMAL_FONT,
      PdfConstants.VALUE_FONT_SIZE,
      PdfConstants.NO_LINE_GAP,
      `Nafn: ${parent.name}`,
    )

    doc
      .text(`Kennitala: ${parent.ssn}`)
      .text(`Netfang: ${parent.email}`)
      .text(`Símanúmer: ${parent.phoneNumber}`)
      .lineGap(PdfConstants.LARGE_LINE_GAP)
      .text(`Heimilisfang: ${parentHomeAddress(parent)}`)
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
      `Nafn og kennitala barns: ${c.name}, ${c.ssn}`,
    ),
  )

  addParentToDoc('Foreldri A', parentA)
  addParentToDoc('Foreldri B', parentB)

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
    `Fyrra lögheimili: ${parentHomeAddress(parentA)}`,
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.LARGE_LINE_GAP,
    `Fyrra lögheimili: ${parentHomeAddress(parentB)}`,
  )

  addToDoc(
    PdfConstants.BOLD_FONT,
    PdfConstants.SUB_HEADER_FONT_SIZE,
    PdfConstants.NORMAL_LINE_GAP,
    'Gildistími samnings',
  )

  addToDoc(
    PdfConstants.NORMAL_FONT,
    PdfConstants.VALUE_FONT_SIZE,
    PdfConstants.NO_LINE_GAP,
    expiry === PdfConstants.PERMANENT
      ? 'Samningurinn er til frambúðar, þar til barnið hefur náð 18 ára aldri.'
      : `Samningurinn gildir til ${expiry}`,
  )

  doc.end()

  const pdfBuffer = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdfBuffer
}
