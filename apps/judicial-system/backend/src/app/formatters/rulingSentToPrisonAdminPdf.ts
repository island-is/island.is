import PDFDocument from 'pdfkit'

import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import {
  DefendantEventType,
  EventType,
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { Case } from '../modules/case'
import { DefendantEventLog } from '../modules/defendant'
import { EventLog } from '../modules/event-log'
import {
  addEmptyLines,
  addLargeHeading,
  addMediumCenteredText,
  addNormalPlusText,
  setTitle,
} from './pdfHelpers'

export const createRulingSentToPrisonAdminPdf = (
  theCase: Case,
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

  setTitle(doc, 'Dómur til fullnustu')

  addLargeHeading(doc, 'Dómur til fullnustu'.toUpperCase(), 'Times-Bold')

  doc.moveDown(1.5)

  addMediumCenteredText(doc, theCase.court?.name || '', 'Times-Bold')
  addMediumCenteredText(
    doc,
    `Dómsuppkvaðning ${formatDate(theCase.rulingDate)}`,
    'Times-Bold',
  )
  doc.moveDown(0.5)

  addMediumCenteredText(
    doc,
    `Mál nr. ${theCase.courtCaseNumber || ''}`,
    'Times-Bold',
  )

  doc.moveDown(1.5)

  const sentToPrisonAdminDate = DefendantEventLog.getEventLogDateByEventType(
    DefendantEventType.SENT_TO_PRISON_ADMIN,
    theCase.defendants?.flatMap((defendant) => defendant.eventLogs || []),
  )

  const getSignatureDate = EventLog.getEventLogDateByEventType(
    EventType.INDICTMENT_REVIEWED,
    theCase.eventLogs,
  )

  addMediumCenteredText(
    doc,
    `Sent til fullnustu ${formatDate(sentToPrisonAdminDate)}`,
    'Times-Bold',
  )

  addEmptyLines(doc, 2)

  const signatureDateText = `Dagsetning áritunar: `
  const signatureDate = `${formatDate(getSignatureDate)}`

  const reviewedByText = 'Yfirlestur: '
  const reviewerNameText = theCase.indictmentReviewer?.name || ''

  // Measure text widths
  doc.font('Times-Bold').fontSize(12)
  const signatureDateTextWidth = doc.widthOfString(signatureDateText)
  const reviewedByTextWidth = doc.widthOfString(reviewedByText)

  doc.font('Times-Roman').fontSize(12)
  const signatureDateWidth = doc.widthOfString(signatureDate)
  const reviewerNameTextWidth = doc.widthOfString(reviewerNameText)

  // Calculate left and right lengths
  const totalTextWidth =
    signatureDateTextWidth +
    signatureDateWidth +
    reviewedByTextWidth +
    reviewerNameTextWidth

  // Add left-aligned text
  addNormalPlusText(doc, signatureDateText, 'Times-Bold', true)
  addNormalPlusText(doc, signatureDate, 'Times-Roman', true)

  // Get starting x position for right-aligned text
  const startX = doc.page.width - doc.page.margins.left - totalTextWidth

  // Add right-aligned text
  doc
    .font('Times-Bold')
    .text(reviewedByText, startX, doc.y, { continued: true })
  doc.font('Times-Roman').text(reviewerNameText)

  addEmptyLines(doc, 5)

  theCase.defendants?.forEach((defendant, index) => {
    const { verdict } = defendant
    const isServiceRequired =
      verdict?.serviceRequirement === ServiceRequirement.REQUIRED

    const verdictServiceDateText =
      isServiceRequired && verdict?.serviceDate
        ? (formatDate(verdict.serviceDate) as string)
        : verdict?.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
        ? 'Dómfelldi var viðstaddur dómsuppkvaðningu'
        : verdict?.serviceRequirement === ServiceRequirement.NOT_REQUIRED
        ? 'Birting dóms ekki þörf'
        : 'Óþekkt'

    const defendantVerdictAppealDecisionText =
      verdict?.appealDecision === VerdictAppealDecision.ACCEPT
        ? 'Unir dómi'
        : verdict?.appealDecision === VerdictAppealDecision.POSTPONE
        ? 'Tekur áfrýjunarfrest'
        : 'Óþekkt'

    addNormalPlusText(doc, 'Dómþoli: ', 'Times-Bold', true)
    addNormalPlusText(doc, defendant.name || '', 'Times-Roman', true)

    if (defendant.nationalId) {
      const formattedNationalId = formatNationalId(defendant.nationalId)
      addNormalPlusText(doc, `, kt. ${formattedNationalId}`, 'Times-Roman')
      addEmptyLines(doc, 1)
    } else {
      addEmptyLines(doc, 2)
    }

    addNormalPlusText(doc, 'Dómur birtur: ', 'Times-Bold', true)
    addNormalPlusText(doc, verdictServiceDateText, 'Times-Roman')

    addEmptyLines(doc)

    addNormalPlusText(doc, 'Ákvörðun dómþola: ', 'Times-Bold', true)
    addNormalPlusText(doc, defendantVerdictAppealDecisionText, 'Times-Roman')

    addEmptyLines(doc)

    addNormalPlusText(doc, 'Ákvörðun saksóknara: ', 'Times-Bold', true)
    // This file shouldn't really ever be made unless the public prosecutor
    // reviwing the indictment has accepted the verdict
    addNormalPlusText(doc, 'Unir dómi', 'Times-Roman')

    if (theCase.defendants && index < theCase.defendants.length - 1) {
      addEmptyLines(doc, 3)
      addNormalPlusText(doc, '_________________', 'Times-Roman')
      addEmptyLines(doc, 3)
    }
  })

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
