import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { ruling } from '../messages'
import {
  setPageNumbers,
  addCoatOfArms,
  addLargeHeading,
  addMediumHeading,
  setLineGap,
  setTitle,
  addEmptyLines,
  addNormalText,
  addNormalJustifiedText,
  addNormalCenteredText,
} from './pdfHelpers'
import { writeFile } from './writeFile'

function constructRulingPdf(
  theCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
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

  const title = formatMessage(ruling.title)

  setTitle(doc, title)
  addCoatOfArms(doc)
  addEmptyLines(doc, 5)
  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.court?.name ?? formatMessage(ruling.missingCourt),
    'Times-Roman',
  )
  setLineGap(doc, 2)
  addMediumHeading(doc, title)
  setLineGap(doc, 30)
  addMediumHeading(
    doc,
    formatMessage(ruling.caseNumber, {
      caseNumber: theCase.courtCaseNumber,
    }),
  )
  setLineGap(doc, 1)
  addNormalText(
    doc,
    formatMessage(ruling.prosecutorDemandsHeading),
    'Times-Bold',
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.prosecutorDemands ?? formatMessage(ruling.missingProsecutorDemands),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(ruling.courtCaseFactsHeading), 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.courtCaseFacts ?? formatMessage(ruling.missingCourtCaseFacts),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    formatMessage(ruling.courtLegalArgumentsHeading),
    'Times-Bold',
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.courtLegalArguments ??
      formatMessage(ruling.missingCourtLegalArguments),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, formatMessage(ruling.rulingHeading), 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.ruling ?? formatMessage(ruling.missingRuling),
    'Times-Roman',
  )
  setLineGap(doc, 3)
  addEmptyLines(doc, 2)
  setLineGap(doc, 16)
  addMediumHeading(doc, formatMessage(ruling.conclusionHeading))
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    theCase.conclusion ?? formatMessage(ruling.missingConclusion),
  )
  addEmptyLines(doc)
  addNormalCenteredText(
    doc,
    theCase.judge?.name ?? formatMessage(ruling.missingJudge),
    'Times-Bold',
  )
  setPageNumbers(doc)

  doc.end()

  return stream
}

export async function getRulingPdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructRulingPdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}

export async function getRulingPdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructRulingPdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
