import PDFDocument from 'pdfkit'

import { formatDate, formatDOB } from '@island.is/judicial-system/formatters'

import { nowFactory } from '../../factories'
import { formatIcuMessage, ruling } from '../../messages'
import { Case } from '../../modules/repository'
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
} from '../pdfHelpers'

const constructRulingPdf = (theCase: Case): Promise<Buffer> => {
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

  const title = ruling.title

  setTitle(doc, title)
  addCoatOfArms(doc)
  addEmptyLines(doc, 5)
  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.court?.name ?? ruling.missingCourt,
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
    formatIcuMessage(ruling.caseNumber, {
      caseNumber: theCase.courtCaseNumber,
    }),
  )
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    theCase.introduction ?? ruling.missingIntroduction,
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${ruling.prosecutorIs} ${
      theCase.prosecutorsOffice?.name ?? ruling.missingDistrict
    }.`,
  )
  addNormalJustifiedText(
    doc,
    `${formatIcuMessage(ruling.defendantIs, {
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
  addNormalText(doc, ruling.prosecutorDemandsHeading, 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.prosecutorDemands ?? ruling.missingProsecutorDemands,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, ruling.courtCaseFactsHeading, 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.courtCaseFacts ?? ruling.missingCourtCaseFacts,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, ruling.courtLegalArgumentsHeading, 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.courtLegalArguments ?? ruling.missingCourtLegalArguments,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, ruling.rulingHeading, 'Times-Bold')
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.ruling ?? ruling.missingRuling,
    'Times-Roman',
  )
  setLineGap(doc, 3)
  addEmptyLines(doc, 2)
  setLineGap(doc, 16)
  addMediumHeading(doc, ruling.conclusionHeading)
  setLineGap(doc, 1)
  addNormalJustifiedText(doc, theCase.conclusion ?? ruling.missingConclusion)
  addEmptyLines(doc)
  addNormalCenteredText(
    doc,
    theCase.judge?.name ?? ruling.missingJudge,
    'Times-Bold',
  )
  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

export const getRulingPdfAsString = (theCase: Case): Promise<string> => {
  return constructRulingPdf(theCase).then((buffer) => buffer.toString('binary'))
}

export const getRulingPdfAsBuffer = (theCase: Case): Promise<Buffer> => {
  return constructRulingPdf(theCase)
}
