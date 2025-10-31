import PDFDocument from 'pdfkit'

import {
  formatDate,
  getRoleTitleFromCaseFileCategory,
} from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CourtDocumentType,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../factories'
import { Case, CaseFile, CourtDocument } from '../modules/repository'
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

const getFiledBy = (document: CourtDocument, files: CaseFile[]): string => {
  if (document.documentType === CourtDocumentType.EXTERNAL_DOCUMENT) {
    const split = document.submittedBy?.split('|')

    if (split?.length === 2) {
      const submitterText = getRoleTitleFromCaseFileCategory(split[1], {
        prosecutor: 'Sækjandi',
        notRegistered: '',
      })
      return `${submitterText}${submitterText ? ' ' : ''}${
        split[0]
      } lagði fram:`
    }
  } else if (document.documentType === CourtDocumentType.UPLOADED_DOCUMENT) {
    const file = files?.find((file) => file.id === document.caseFileId)

    if (
      file &&
      file.category &&
      [
        CaseFileCategory.PROSECUTOR_CASE_FILE,
        CaseFileCategory.DEFENDANT_CASE_FILE,
        CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
        CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
      ].includes(file.category)
    ) {
      const submitterText = getRoleTitleFromCaseFileCategory(file.category, {
        prosecutor: 'Sækjandi',
        notRegistered: '',
      })

      return `${submitterText}${submitterText ? ' ' : ''}${
        file.fileRepresentative ?? file.submittedBy
      } lagði fram:`
    }
  }

  return 'Lagt er fram:'
}

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

  const caseFiles = theCase.caseFiles ?? []
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
      const filedDocuments: {
        filedBy: string
        docs: CourtDocument[]
      }[] = []

      for (const d of courtSession.filedDocuments) {
        const filedBy = getFiledBy(d, caseFiles)

        if (
          filedDocuments.length === 0 ||
          filedDocuments[filedDocuments.length - 1].filedBy !== filedBy
        ) {
          filedDocuments.push({ filedBy, docs: [d] })
        } else {
          filedDocuments[filedDocuments.length - 1].docs.push(d)
        }
      }

      for (const { filedBy, docs } of filedDocuments) {
        addEmptyLines(doc)
        addNormalText(doc, filedBy, 'Times-Bold')
        addNormalText(doc, 'Nr.', 'Times-Roman')

        addNumberedList(
          doc,
          docs.map((d) => d.name.normalize()),
          docs[0].documentOrder,
        )
      }

      nrOfFiledDocuments =
        courtSession.filedDocuments[courtSession.filedDocuments.length - 1]
          .documentOrder
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
