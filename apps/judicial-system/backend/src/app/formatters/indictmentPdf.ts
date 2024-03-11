import { setLineCap } from 'pdf-lib'
import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'

import { nowFactory } from '../factories'
import { indictment } from '../messages'
import { Case } from '../modules/case'
import {
  addCoatOfArms,
  addEmptyLines,
  addGiganticHeading,
  addNormalPlusCenteredText,
  addNormalPlusJustifiedText,
  addNormalPlusText,
  addNormalText,
  setTitle,
} from './pdfHelpers'

// Credit: https://stackoverflow.com/a/41358305
const roman = (num: number) => {
  const roman: { [key: string]: number } = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  }

  let str = ''

  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i])
    num -= q * roman[i]
    str += i.repeat(q)
  }

  return str
}

export const createIndictment = async (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 70,
      bottom: 70,
      left: 70,
      right: 70,
    },
    bufferPages: true,
  })

  const sinc: Buffer[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  const title = formatMessage(indictment.title)
  const heading = formatMessage(indictment.heading)

  setTitle(doc, title)

  doc
    .rect(32, 32, doc.page.width - doc.page.margins.left, 88)
    .fill('#FAFAFA')
    .stroke()

  doc.rect(40, 24, 104, 88).fillAndStroke('white', '#CBCBCB')

  addCoatOfArms(doc, 64, 40)

  doc
    .rect(40 + 104, 24, doc.page.width - doc.page.margins.left - 104, 32)
    .fillAndStroke('#FAFAFA', '#CBCBCB')

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Réttarvörslugátt', 168, 35)
  doc.font('Times-Roman')
  doc.text('Skjal samþykkt rafrænt', 260, 35)

  doc
    .rect(
      40 + 104,
      24 + 32,
      (doc.page.width - doc.page.margins.left - 104 - 104) / 2,
      88 - 32,
    )
    .stroke()

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Samþykkt af', 40 + 104 + 16, 24 + 32 + 16)
  doc.font('Times-Roman')
  doc.text('Nafn', 40 + 104 + 16, 24 + 32 + 32)

  doc
    .rect(
      40 + 104 + (doc.page.width - doc.page.margins.left - 104 - 104) / 2,
      24 + 32,
      (doc.page.width - doc.page.margins.left - 104 - 104) / 2,
      88 - 32,
    )
    .stroke()

  doc
    .rect(
      40 + 104 + (doc.page.width - doc.page.margins.left - 104 - 104),
      24 + 32,
      104,
      88 - 32,
    )
    .stroke()

  addEmptyLines(doc, 6)

  doc.fill('black').stroke()

  addGiganticHeading(doc, heading, 'Times-Roman')
  addNormalPlusText(doc, ' ')
  setLineCap(2)
  addNormalPlusText(doc, theCase.indictmentIntroduction || '')

  const hasManyCounts =
    theCase.indictmentCounts && theCase.indictmentCounts.length > 1
  theCase.indictmentCounts?.forEach((count, index) => {
    addEmptyLines(doc)

    if (hasManyCounts) {
      addNormalPlusCenteredText(doc, `${roman(index + 1)}.`)
      addNormalPlusJustifiedText(
        doc,
        capitalize(count.incidentDescription || ''),
      )
    } else {
      addNormalPlusJustifiedText(doc, count.incidentDescription || '')
    }
    addEmptyLines(doc)
    addNormalPlusJustifiedText(doc, count.legalArguments || '')
    addNormalText(doc, `M: ${count.policeCaseNumber || ''}`)
  })

  addEmptyLines(doc, 2)
  addNormalPlusJustifiedText(doc, theCase.demands || '')
  addEmptyLines(doc, 2)
  addNormalPlusCenteredText(
    doc,
    formatMessage(
      indictment.signature,
      {
        prosecutorsOfficeName:
          lowercase(theCase.prosecutorsOffice?.name)
            .replace('lögreglustjórinn', 'lögreglustjórans')
            .replace('saksóknari', 'saksóknara') ?? '',
        date: formatDate(nowFactory(), 'PPP'),
      } ?? '',
    ),
  )

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
