import _uniqBy from 'lodash/uniqBy'
import PDFDocument from 'pdfkit'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CourtSessionRulingType,
  CourtSessionStringType,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../factories'
import { Case, CourtDocument } from '../modules/repository'
import {
  addCoatOfArms,
  addEmptyLines,
  addFooter,
  addIndictmentCourtRecordConfirmation,
  addLargeHeading,
  addMediumHeading,
  addNormalCenteredText,
  addNormalText,
  addNumberedList,
  Confirmation,
  setLineGap,
  setTitle,
} from './pdfHelpers'

export const createIndictmentCourtRecordPdf = (
  theCase: Case,
  showOpenCourtSession: boolean,
  confirmation: Confirmation | undefined,
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

  setTitle(doc, `Þingbók ${theCase.courtCaseNumber}`)

  addCoatOfArms(doc, undefined, 90)

  if (confirmation) {
    addIndictmentCourtRecordConfirmation(doc, confirmation)
  }

  addEmptyLines(doc, confirmation ? 11 : 6, doc.page.margins.left)
  setLineGap(doc, 2)
  addLargeHeading(doc, theCase.court?.name ?? 'Héraðsdómur', 'Times-Roman')
  addMediumHeading(doc, 'Þingbók')
  addMediumHeading(doc, `Mál nr. ${theCase.courtCaseNumber}`)

  let nrOfFiledDocuments = 0

  for (const courtSession of theCase.courtSessions ?? []) {
    if (!courtSession.isConfirmed && !showOpenCourtSession) {
      break
    }

    addEmptyLines(doc, 2)
    addNormalText(
      doc,
      `Þann ${formatDate(
        courtSession.startDate ?? nowFactory(),
        'PPP',
      )} heldur ${
        courtSession.judge?.name ?? 'óþekktur'
      } héraðsdómari dómþing ${
        courtSession.location ?? 'á óþekktum stað'
      }. Fyrir er tekið mál nr. ${
        theCase.courtCaseNumber ?? 'S-xxxx/yyyy'
      }. Þinghald hefst kl. ${formatDate(
        courtSession.startDate ?? nowFactory(),
        'p',
      )}.`,
    )

    if (courtSession.isClosed) {
      const subparagraphs =
        courtSession.closedLegalProvisions &&
        courtSession.closedLegalProvisions.length > 0
          ? `${courtSession.closedLegalProvisions
              ?.map((p) => p.slice(-1).toLowerCase())
              .sort()
              .join('-, ')
              .replace(/-, (?!.*-, )/, '- og ')}-lið `
          : ''

      addEmptyLines(doc)
      addNormalText(
        doc,
        `Þinghaldið er háð fyrir luktum dyrum sbr. ${subparagraphs}10. gr. laga um meðferð sakamála nr. 88/2008.`,
      )
    }

    addEmptyLines(doc)
    addNormalText(
      doc,
      `Sóknaraðili er ${theCase.prosecutorsOffice?.name ?? 'óþekktur'}.`,
    )
    addNormalText(
      doc,
      `Varnaraðili er ${theCase.defendants?.[0].name ?? 'óþekktur'}.`,
    )

    addEmptyLines(doc)
    addNormalText(doc, 'Mættir eru:', 'Times-Bold')
    addNormalText(
      doc,
      // Must use || here as we want to display a default message if the file has no content
      courtSession.attendees?.trim() || 'Enginn er mættur í þinghaldið.',
      'Times-Roman',
    )

    if (nrOfFiledDocuments > 0) {
      addEmptyLines(doc, 2)
      addNormalText(
        doc,
        `Skjöl málsins nr. 1-${nrOfFiledDocuments} liggja frammi.`,
      )
    }

    if (courtSession.filedDocuments && courtSession.filedDocuments.length > 0) {
      addEmptyLines(doc)
      addNormalText(doc, 'Lagt er fram:', 'Times-Bold')
      addNormalText(doc, 'Nr.', 'Times-Roman')
      addNumberedList(
        doc,
        courtSession.filedDocuments.map((d) => d.name.normalize()),
        courtSession.filedDocuments[0].documentOrder,
      )

      nrOfFiledDocuments =
        courtSession.filedDocuments[courtSession.filedDocuments.length - 1]
          .documentOrder
    }

    if (
      courtSession.mergedFiledDocuments &&
      courtSession.mergedFiledDocuments.length > 0
    ) {
      const uniqueCaseIds = _uniqBy(
        courtSession.mergedFiledDocuments ?? [],
        (c: CourtDocument) => c.caseId,
      ).map((doc) => doc.caseId)

      for (const caseId of uniqueCaseIds) {
        addEmptyLines(doc, 2)
        addNormalText(
          doc,
          courtSession.courtSessionStrings?.find(
            (courtSessionString) =>
              courtSessionString.stringType ===
                CourtSessionStringType.ENTRIES &&
              courtSessionString.mergedCaseId === caseId,
          )?.value ?? 'Engar bókanir um sameinað mál voru skráðar.',
        )

        const mergedCaseFiledDocuments = courtSession.mergedFiledDocuments
          .filter((document) => document.caseId === caseId)
          .sort(
            (a, b) =>
              (a.mergedDocumentOrder ?? 0) - (b.mergedDocumentOrder ?? 0),
          )
        addEmptyLines(doc, 2)
        addNormalText(doc, 'Lagt er fram:', 'Times-Bold')
        addNormalText(doc, 'Nr.', 'Times-Roman')
        addNumberedList(
          doc,
          mergedCaseFiledDocuments.map((d) => d.name.normalize()),
          mergedCaseFiledDocuments[0].mergedDocumentOrder ?? 1,
        )
      }
      nrOfFiledDocuments =
        courtSession.mergedFiledDocuments[
          courtSession.mergedFiledDocuments.length - 1
        ].mergedDocumentOrder ?? nrOfFiledDocuments
    }

    addEmptyLines(doc, 2)
    addNormalText(doc, courtSession.entries ?? 'Engar bókanir voru skráðar.')

    if (courtSession.rulingType !== CourtSessionRulingType.NONE) {
      addEmptyLines(doc)
      addNormalCenteredText(
        doc,
        courtSession.rulingType === CourtSessionRulingType.JUDGEMENT
          ? 'DÓMSORÐ:'
          : 'ÚRSKURÐARORÐ:',
        'Times-Bold',
      )
      addEmptyLines(doc)
      addNormalText(
        doc,
        courtSession.ruling ?? 'Engin niðurstaða er skráð.',
        'Times-Roman',
      )
      addEmptyLines(doc)
      addNormalCenteredText(
        doc,
        courtSession.judge?.name ?? 'Óþekktur héraðsdómari',
      )

      if (courtSession.closingEntries) {
        addEmptyLines(doc)
        addNormalText(doc, courtSession.closingEntries)
      }
    }

    addEmptyLines(doc, 3)
    addNormalCenteredText(
      doc,
      `Dómþingi slitið kl. ${formatDate(
        courtSession.endDate ?? nowFactory(),
        'p',
      )}`,
    )
    addNormalCenteredText(
      doc,
      courtSession.judge?.name ?? 'Óþekktur héraðsdómari',
    )

    if (courtSession.isAttestingWitness) {
      const attestingWitnessName =
        courtSession.attestingWitness?.name ?? 'óþekktur'
      const attestingWitnessTitle = courtSession.attestingWitness?.title
        ? ` ${courtSession.attestingWitness.title.toLocaleLowerCase()}`
        : ''

      addEmptyLines(doc)
      addNormalText(
        doc,
        `Vottur að þinghaldi er ${attestingWitnessName}${attestingWitnessTitle}.`,
      )
    }
  }

  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
