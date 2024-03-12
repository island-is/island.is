import { applyCase } from 'beygla'
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
  drawTextWithEllipsis,
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
    .rect(24, 32, doc.page.width - doc.page.margins.left + 16, 88)
    .fill('#FAFAFA')
    .stroke()

  doc.rect(32, 24, 88, 88).fillAndStroke('white', '#CBCBCB')

  addCoatOfArms(doc, 48, 40)

  doc
    .rect(32 + 88, 24, doc.page.width - doc.page.margins.left - 72, 32)
    .fillAndStroke('#FAFAFA', '#CBCBCB')

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Réttarvörslugátt', 128, 35)
  doc.font('Times-Roman')
  doc.text('Skjal samþykkt rafrænt', 216, 35)
  doc
    .translate(doc.page.width - doc.page.margins.right + 32, 33)
    .path(
      'M0.763563 11.8047H7.57201C7.85402 11.8047 8.08264 11.5761 8.08264 11.2941V5.50692C8.08264 5.22492 7.85402 4.99629 7.57201 4.99629H7.06138V3.46439C7.06138 1.86887 5.76331 0.570801 4.16779 0.570801C2.57226 0.570801 1.2742 1.86887 1.2742 3.46439V4.99629H0.763563C0.481557 4.99629 0.25293 5.22492 0.25293 5.50692V11.2941C0.25293 11.5761 0.481557 11.8047 0.763563 11.8047ZM5.61394 8.03817L4.16714 9.48496C4.06743 9.58467 3.93674 9.63455 3.80609 9.63455C3.67543 9.63455 3.54471 9.58467 3.44504 9.48496L2.72164 8.76157C2.52222 8.56215 2.52222 8.23888 2.72164 8.03943C2.92102 7.84001 3.24436 7.84001 3.44378 8.03943L3.80612 8.40174L4.89187 7.31603C5.09125 7.11661 5.41458 7.11661 5.614 7.31603C5.81339 7.51549 5.81339 7.83875 5.61394 8.03817ZM2.29546 3.46439C2.29546 2.43199 3.13539 1.59207 4.16779 1.59207C5.20019 1.59207 6.04011 2.43199 6.04011 3.46439V4.99629H2.29546V3.46439Z',
    )
    .fillAndStroke('#ADA373', '#ADA373')

  doc.translate(-(doc.page.width - doc.page.margins.right + 32), -33)

  doc
    .rect(
      32 + 88,
      24 + 32,
      (doc.page.width - doc.page.margins.left - 208) / 2,
      88 - 32,
    )
    .fillAndStroke('white', '#CBCBCB')

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text('Samþykkt af', 40 + 88, 24 + 32 + 16)
  doc.font('Times-Roman')

  drawTextWithEllipsis(
    doc,
    applyCase('þgf', 'Sóley Ólöf Rún Guðmarsdóttir'), // theCase.prosecutor?.name || ''),
    40 + 88,
    24 + 32 + 32,
    (doc.page.width - doc.page.margins.left - 224) / 2,
  )

  doc
    .rect(
      40 + 80 + (doc.page.width - doc.page.margins.left - 208) / 2,
      24 + 32,
      (doc.page.width - doc.page.margins.left - 104) / 2,
      88 - 32,
    )
    .fillAndStroke('white', '#CBCBCB')

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Embætti',
    40 + 116 + (doc.page.width - doc.page.margins.left - 104 - 156) / 2,
    24 + 32 + 16,
  )
  doc.font('Times-Roman')
  doc.text(
    theCase.prosecutorsOffice?.name || '',
    40 + 116 + (doc.page.width - doc.page.margins.left - 104 - 156) / 2,
    24 + 32 + 32,
  )

  doc
    .rect(
      40 + 120 + (doc.page.width - doc.page.margins.left - 104 - 104) + 8,
      24 + 32,
      88,
      88 - 32,
    )
    .fillAndStroke('white', '#CBCBCB')

  doc.fill('black')
  doc.font('Times-Bold')
  doc.text(
    'Útgáfa ákæru',
    40 + 104 + 16 + (doc.page.width - doc.page.margins.left - 104 - 104) + 16,
    24 + 32 + 16,
    { lineBreak: false },
  )
  doc.font('Times-Roman')
  doc.text(
    formatDate(theCase.created, 'P') || '',
    40 + 104 + 16 + (doc.page.width - doc.page.margins.left - 104 - 104) + 32,
    24 + 32 + 32,
    {
      lineBreak: false,
    },
  )

  addEmptyLines(doc, 4, doc.page.margins.left)

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
