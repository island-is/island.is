import PDFDocument from 'pdfkit'

import {
  capitalize,
  formatDate,
  getRoleTitleFromCaseFileCategory,
  getWordByGender,
  lowercase,
  Word,
} from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  CourtDocumentType,
  CourtSessionRulingType,
  CourtSessionStringType,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import { Case, CaseFile, CourtDocument } from '../../modules/repository'
import {
  addCoatOfArms,
  addEmptyLines,
  addFooter,
  addLargeHeading,
  addMediumHeading,
  addNormalCenteredText,
  addNormalText,
  addNumberedList,
  addRichText,
  Confirmation,
  drawConfirmation,
  setLineGap,
  setTitle,
} from '../pdfHelpers'

const formatFiledBy = (submitterText: string, submittedBy?: string | null) => {
  if (submitterText === 'Ákærandi') {
    return 'Ákærandi lagði fram:'
  }

  return [submitterText, submittedBy, 'lagði fram:'].filter(Boolean).join(' ')
}

export const getFiledBy = (
  document: CourtDocument,
  files: CaseFile[],
): string => {
  if (document.documentType === CourtDocumentType.EXTERNAL_DOCUMENT) {
    const split = document.submittedBy?.split('|')

    if (split?.length === 2) {
      const submitterText = getRoleTitleFromCaseFileCategory(split[1], {
        prosecutor: 'Ákærandi',
        notRegistered: '',
      })

      return formatFiledBy(submitterText, split[0])
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
        prosecutor: 'Ákærandi',
        notRegistered: '',
      })

      return formatFiledBy(
        submitterText,
        file.fileRepresentative ?? file.submittedBy,
      )
    }
  }

  return 'Lagt er fram:'
}

export interface FiledCourtDocumentSection {
  mergedFromCaseId?: string
  filedBy?: string
  docs: CourtDocument[]
}

// A court session's documents are one sequence: the case's own, and the ones
// copied from each case merged into it. The copies of a merged case stay
// together, so walking the sequence gives each merged case's section whole -
// written up under the court's account of why the cases were joined - and the
// case's own documents under whoever laid them before the court.
export const groupFiledDocuments = (
  filedDocuments: CourtDocument[],
  caseFiles: CaseFile[],
): FiledCourtDocumentSection[] => {
  const sections: FiledCourtDocumentSection[] = []

  for (const document of filedDocuments) {
    const mergedFromCaseId = document.mergedFromCaseId ?? undefined
    const filedBy = mergedFromCaseId
      ? undefined
      : getFiledBy(document, caseFiles)
    const section = sections[sections.length - 1]

    if (
      section &&
      section.mergedFromCaseId === mergedFromCaseId &&
      section.filedBy === filedBy
    ) {
      section.docs.push(document)
    } else {
      sections.push({ mergedFromCaseId, filedBy, docs: [document] })
    }
  }

  return sections
}

const lineGap = 2

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

  if (confirmation) {
    drawConfirmation(doc, {
      showLockIcon: false,
      confirmationText: 'Rafræn staðfesting',
      date: confirmation.date,
      boxes: [
        {
          title: 'Dómstóll',
          content: confirmation.institution,
          widthPercent: 100,
        },
      ],
    })

    doc.y = doc.page.margins.top + 10
  }

  addCoatOfArms(doc)
  addEmptyLines(doc, confirmation ? 11 : 6, doc.page.margins.left)
  setLineGap(doc, lineGap)
  addLargeHeading(doc, theCase.court?.name ?? 'Héraðsdómur', 'Times-Roman')
  addMediumHeading(doc, 'Þingbók')
  addMediumHeading(doc, `Mál nr. ${theCase.courtCaseNumber}`)

  const caseFiles = theCase.caseFiles ?? []
  const isMultipleDefendants = (theCase.defendants?.length ?? 0) > 1
  let nrOfFiledDocuments = 0

  for (const courtSession of theCase.courtSessions ?? []) {
    if (!courtSession.isConfirmed && !showOpenCourtSession) {
      break
    }

    const startDate = courtSession.startDate ?? nowFactory()
    const courtDate = capitalize(
      formatDate(startDate, 'eeee d. MMMM yyyy')?.replace('dagur', 'daginn'),
    )

    addEmptyLines(doc, 2)
    addNormalText(
      doc,
      `${courtDate} heldur ${
        courtSession.judge?.name ?? 'óþekktur'
      } ${lowercase(courtSession.judge?.title)} dómþing ${
        courtSession.location ?? 'á óþekktum stað'
      }. Fyrir er tekið mál nr. ${
        theCase.courtCaseNumber ?? 'S-xxxx/yyyy'
      }. Þinghald hefst kl. ${formatDate(startDate, 'p')}.`,
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

    if (isMultipleDefendants) {
      // Check if all defendants have the same gender
      const allDefendantsSameGender =
        theCase.defendants?.every(
          (defendant) => defendant.gender === theCase.defendants?.[0].gender,
        ) ?? false

      addNormalText(
        doc,
        `${
          capitalize(
            getWordByGender(
              Word.AKAERDI,
              allDefendantsSameGender
                ? theCase.defendants?.[0].gender
                : undefined,
              true,
            ),
          ) || 'Ákærðir'
        } eru ${
          theCase.defendants
            ?.map((defendant) => defendant.name)
            .join(', ')
            // finds the last comma+space and everything after it and
            // replaces it with " og " + the last item
            .replace(/, ([^,]*)$/, ' og $1') ?? 'óþekktir'
        }.`,
      )
    } else {
      addNormalText(
        doc,
        `${
          capitalize(
            getWordByGender(Word.AKAERDI, theCase.defendants?.[0].gender),
          ) || 'Ákærði'
        } er ${theCase.defendants?.[0].name ?? 'óþekktur'}.`,
      )
    }

    addEmptyLines(doc)
    addNormalText(
      doc,
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
      for (const { mergedFromCaseId, filedBy, docs } of groupFiledDocuments(
        courtSession.filedDocuments,
        caseFiles,
      )) {
        if (mergedFromCaseId) {
          addEmptyLines(doc, 2)
          addNormalText(
            doc,
            courtSession.courtSessionStrings?.find(
              (courtSessionString) =>
                courtSessionString.stringType ===
                  CourtSessionStringType.ENTRIES &&
                courtSessionString.mergedCaseId === mergedFromCaseId,
            )?.value ?? 'Engar bókanir um sameinað mál voru skráðar.',
          )

          addEmptyLines(doc, 2)
          addNormalText(doc, 'Lagt er fram:', 'Times-Bold')
        } else {
          addEmptyLines(doc)
          addNormalText(doc, filedBy ?? '', 'Times-Bold')
        }

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
    addRichText(
      doc,
      courtSession.entries ?? '<p>Engar bókanir voru skráðar.</p>',
      lineGap,
    )

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
