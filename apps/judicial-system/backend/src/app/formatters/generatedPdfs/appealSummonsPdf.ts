import PDFDocument from 'pdfkit'

import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories/date.factory'
import { Case } from '../../modules/repository'
import {
  addEmptyLines,
  addHugeHeading,
  addNormalText,
  setTitle,
} from '../pdfHelpers'
import {
  APPEAL_SUMMONS_CLOSING_PROCEDURE,
  APPEAL_SUMMONS_PROSECUTOR_NAME,
  APPEAL_SUMMONS_PROSECUTOR_TITLE,
  APPEAL_SUMMONS_TITLE,
  formatAppealSummonsClosingPlaceAndDate,
  formatAppealSummonsIntro,
} from './appealSummonsPdf.text'

export type AppealSummonsPdfDefendant = {
  defendantId: string
  appellantSide: AppealSummonsAppellantSide
  claims: string
  appealDate?: Date | string | null
}

export const createAppealSummons = (
  theCase: Case,
  defendants: AppealSummonsPdfDefendant[],
  issuedDate?: Date,
): Promise<Buffer> => {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, APPEAL_SUMMONS_TITLE)
  addHugeHeading(doc, APPEAL_SUMMONS_TITLE, 'Times-Bold')
  addEmptyLines(doc)

  const defendantNames = (theCase.defendants ?? []).map(
    (defendant) => defendant.name,
  )
  const closingDate = issuedDate ?? nowFactory()

  for (const row of defendants) {
    const defendant = theCase.defendants?.find(
      (item) => item.id === row.defendantId,
    )

    addNormalText(
      doc,
      formatAppealSummonsIntro({
        appellantSide: row.appellantSide,
        defendantName: defendant?.name,
        defendantNationalId: defendant?.nationalId,
        defendantAddress: defendant?.address,
        appealDate: row.appealDate,
        courtName: theCase.court?.name,
        rulingDate: theCase.rulingDate,
        courtCaseNumber: theCase.courtCaseNumber,
        defendantNames,
      }),
      'Times-Roman',
    )
    addEmptyLines(doc)

    for (const paragraph of row.claims.split('\n')) {
      addNormalText(doc, paragraph, 'Times-Roman')
    }

    addEmptyLines(doc)
  }

  addNormalText(doc, APPEAL_SUMMONS_CLOSING_PROCEDURE, 'Times-Roman')
  addEmptyLines(doc, 2)
  addNormalText(
    doc,
    formatAppealSummonsClosingPlaceAndDate(closingDate),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(doc, APPEAL_SUMMONS_PROSECUTOR_NAME, 'Times-Bold')
  addNormalText(doc, APPEAL_SUMMONS_PROSECUTOR_TITLE, 'Times-Roman')

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
