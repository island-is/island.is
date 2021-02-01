import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import {
  ParentResidenceChange,
  PersonResidenceChange,
} from '@island.is/application/templates/children-residence-change'
import { Constants } from './constants'
import { DistrictCommissionerLogo } from './districtCommissionerLogo'

export async function generateResidenceChangePdf(
  childrenAppliedFor: Array<PersonResidenceChange>,
  parentA: ParentResidenceChange,
  parentB: ParentResidenceChange,
  expiry: string,
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: Constants.PAGE_SIZE,
    margins: {
      top: Constants.VERTICAL_MARGIN,
      bottom: Constants.VERTICAL_MARGIN,
      left: Constants.HORIZONTAL_MARGIN,
      right: Constants.HORIZONTAL_MARGIN,
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
    addToDoc(Constants.BOLD_FONT, Constants.SUB_HEADER_FONT_SIZE, Constants.NORMAL_LINE_GAP, header)
    addToDoc(Constants.NORMAL_FONT, Constants.VALUE_FONT_SIZE, Constants.NO_LINE_GAP, `Nafn: ${parent.name}`)

    doc
      .text(`Kennitala: ${parent.ssn}`)
      .text(`Netfang: ${parent.email}`)
      .text(`Símanúmer: ${parent.phoneNumber}`)
      .lineGap(Constants.LARGE_LINE_GAP)
      .text(`Heimilisfang: ${parentHomeAddress(parent)}`)
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .image(
      DistrictCommissionerLogo,
      doc.page.width - Constants.HORIZONTAL_MARGIN - Constants.IMAGE_WIDTH,
      Constants.VERTICAL_MARGIN,
      { fit: [Constants.IMAGE_WIDTH, Constants.IMAGE_HEIGHT], align: 'right' },
    )
    .moveDown()

  addToDoc(
    Constants.BOLD_FONT,
    Constants.HEADER_FONT_SIZE,
    Constants.NORMAL_LINE_GAP,
    'Samningur foreldra með sameiginlega forsjá um breytt lögheimili barna',
  )

  addToDoc(
    Constants.NORMAL_FONT,
    Constants.SUB_HEADER_FONT_SIZE,
    Constants.LARGE_LINE_GAP,
    'skv. 32.gr. barnalaga nr. 76/2003',
  )

  addToDoc(
    Constants.BOLD_FONT,
    Constants.SUB_HEADER_FONT_SIZE,
    Constants.NORMAL_LINE_GAP,
    'Barn/börn undir 18 ára aldri sem erindið varðar',
  )

  childrenAppliedFor.map((c, i) =>
    addToDoc(
      Constants.NORMAL_FONT,
      Constants.VALUE_FONT_SIZE,
      i === childrenAppliedFor.length - 1 ? Constants.LARGE_LINE_GAP : Constants.NO_LINE_GAP,
      `Nafn og kennitala barns: ${c.name}, ${c.ssn}`,
    ),
  )

  addParentToDoc('Foreldri A', parentA)
  addParentToDoc('Foreldri B', parentB)

  addToDoc(Constants.BOLD_FONT, Constants.SUB_HEADER_FONT_SIZE, Constants.NORMAL_LINE_GAP, 'Lögheimilsbreyting:')

  addToDoc(
    Constants.NORMAL_FONT,
    Constants.VALUE_FONT_SIZE,
    Constants.NO_LINE_GAP,
    `Fyrra lögheimili: ${parentHomeAddress(parentA)}`,
  )

  addToDoc(
    Constants.NORMAL_FONT,
    Constants.VALUE_FONT_SIZE,
    Constants.LARGE_LINE_GAP,
    `Fyrra lögheimili: ${parentHomeAddress(parentB)}`,
  )

  addToDoc(Constants.BOLD_FONT, Constants.SUB_HEADER_FONT_SIZE, Constants.NORMAL_LINE_GAP, 'Gildistími samnings')

  addToDoc(
    Constants.NORMAL_FONT,
    Constants.VALUE_FONT_SIZE,
    Constants.NO_LINE_GAP,
    expiry === Constants.PERMANENT
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
