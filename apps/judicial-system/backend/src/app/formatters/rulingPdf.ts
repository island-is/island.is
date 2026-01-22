import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'

import { nowFactory } from '../factories'
import { ruling } from '../messages'
import { Case } from '../modules/repository'
import {
  addCoatOfArms,
  addEmptyLines,
  addFooter,
  addLargeHeading,
  addMediumHeading,
  addNormalCenteredText,
  addNormalJustifiedText,
  addNormalText,
  setLineGap,
  setTitle,
} from './pdfHelpers'

const constructRulingPdf = (
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

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
    `${title} ${formatDate(theCase.rulingDate ?? nowFactory(), 'PPP')}`,
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
      theCase.prosecutorsOffice?.name ?? ruling.missingDistrict
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
          } ${defendant.name ?? '-'}${`, ${formatDOB(
            defendant.nationalId,
            defendant.noNationalId,
          )}`}`,
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

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

export const getRulingPdfAsString = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> => {
  return constructRulingPdf(theCase, formatMessage).then((buffer) =>
    buffer.toString('binary'),
  )
}

export const getRulingPdfAsBuffer = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  return constructRulingPdf(theCase, formatMessage)
}
