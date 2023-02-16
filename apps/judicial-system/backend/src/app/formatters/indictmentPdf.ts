import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  capitalize,
  formatDate,
  lowercase,
} from '@island.is/judicial-system/formatters'

import { Case } from '../modules/case'
import { nowFactory } from '../factories'
import { indictment } from '../messages'
import {
  addEmptyLines,
  addGiganticHeading,
  addNormalPlusCenteredText,
  addNormalPlusText,
  setTitle,
} from './pdfHelpers'
import { setLineCap } from 'pdf-lib'

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

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  const title = formatMessage(indictment.title)

  setTitle(doc, title)

  addGiganticHeading(doc, title, 'Times-Roman')
  addNormalPlusText(doc, ' ')
  setLineCap(4)
  addNormalPlusText(doc, theCase.indictmentIntroduction || '')

  const hasManyCounts =
    theCase.indictmentCounts && theCase.indictmentCounts.length > 1
  theCase.indictmentCounts?.forEach((count, index) => {
    addEmptyLines(doc)

    if (hasManyCounts) {
      addNormalPlusCenteredText(doc, `${roman(index + 1)}.`)
      addNormalPlusText(doc, capitalize(count.incidentDescription || ''))
    } else {
      addNormalPlusText(doc, count.incidentDescription || '')
    }
    addEmptyLines(doc)
    addNormalPlusText(doc, count.legalArguments || '')
    addNormalPlusText(doc, `M: ${count.policeCaseNumber || ''}`)
  })

  addEmptyLines(doc, 2)
  addNormalPlusText(doc, theCase.demands || '')
  addEmptyLines(doc, 2)
  addNormalPlusText(
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

  return new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })
}
