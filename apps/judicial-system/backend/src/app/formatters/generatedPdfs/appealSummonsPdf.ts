import PDFDocument from 'pdfkit'

import { formatDate } from '@island.is/judicial-system/formatters'
import { AppealSummonsAppellantSide } from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories/date.factory'
import { Case } from '../../modules/repository'
import {
  addEmptyLines,
  addHugeHeading,
  addNormalCenteredText,
  addNormalText,
  Confirmation,
  drawConfirmation,
  formatActor,
  setTitle,
} from '../pdfHelpers'
import {
  APPEAL_SUMMONS_CLOSING_PROCEDURE,
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

export type AppealSummonsPdfIssuer = {
  name: string
  title?: string
}

export const createAppealSummons = (
  theCase: Case,
  defendants: AppealSummonsPdfDefendant[],
  issuer: AppealSummonsPdfIssuer,
  confirmation?: Confirmation,
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

  if (confirmation) {
    drawConfirmation(doc, {
      showLockIcon: true,
      confirmationText: 'Skjal samþykkt rafrænt',
      boxes: [
        {
          title: 'Samþykktaraðili',
          content: formatActor(confirmation.actor, confirmation.title),
          widthPercent: 40,
        },
        {
          title: 'Embætti',
          content: confirmation.institution,
          widthPercent: 40,
        },
        {
          title: 'Útgáfa áfrýjunarstefnu',
          content: formatDate(confirmation.date) ?? '',
          widthPercent: 20,
        },
      ],
    })
    addEmptyLines(doc, 6, doc.page.margins.left)
  }

  addHugeHeading(doc, APPEAL_SUMMONS_TITLE, 'Times-Bold')
  addEmptyLines(doc)

  const defendantNames = (theCase.defendants ?? []).map(
    (defendant) => defendant.name,
  )
  const closingDate = issuedDate ?? confirmation?.date ?? nowFactory()

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
  addNormalCenteredText(
    doc,
    formatAppealSummonsClosingPlaceAndDate(closingDate),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalCenteredText(doc, issuer.name, 'Times-Bold')

  if (issuer.title) {
    addNormalCenteredText(doc, issuer.title, 'Times-Roman')
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
