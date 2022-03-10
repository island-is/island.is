import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case'
import { now } from '../factories'
import { ruling } from '../messages'
import {
  addFooter,
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
  addMediumHeading(
    doc,
    `${title} ${formatDate(theCase.rulingDate ?? now(), 'PPP')}`,
  )
  setLineGap(doc, 30)
  addMediumHeading(
    doc,
    formatMessage(ruling.caseNumber, {
      caseNumber: theCase.courtCaseNumber,
    }),
  )
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    theCase.introduction ?? formatMessage(ruling.missingIntroduction),
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${formatMessage(ruling.prosecutorIs)} ${
      theCase.prosecutor?.institution?.name ?? ruling.missingDistrict
    }.`,
  )
  addNormalJustifiedText(
    doc,
    `${formatMessage(ruling.defendantIs, {
      suffix: theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      isSuffix: theCase.defendants && theCase.defendants.length > 1 ? 'u' : '',
    })}${
      theCase.defendants?.reduce(
        (acc, defendant, index) =>
          `${acc}${
            index === 0
              ? ''
              : index + 1 === theCase.defendants?.length
              ? ', og'
              : ','
          } ${defendant.name ?? '-'}, ${
            defendant.noNationalId ? 'fd.' : 'kt.'
          } ${
            defendant.noNationalId
              ? defendant.nationalId
              : formatNationalId(defendant.nationalId ?? '-')
          }`,
        '',
      ) ?? ` ${ruling.missingDefendants}`
    }.`,
  )
  addEmptyLines(doc)
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
  addFooter(doc)

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
