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
  addEmptyLines,
  addGiganticHeading,
  addNormalPlusCenteredText,
  addNormalPlusJustifiedText,
  addNormalPlusText,
  addNormalText,
  setTitle,
} from './pdfHelpers'

// Credit: https://stackoverflow.com/a/41358305
function roman(num: number) {
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
          lowercase(theCase.creatingProsecutor?.institution?.name)
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
