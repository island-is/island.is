import isSameDay from 'date-fns/isSameDay'
import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  formatDate,
  formatRequestCaseType,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  completedRequestCaseStates,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../factories'
import { courtRecord } from '../messages'
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

export const formatCourtEndDate = (
  formatMessage: FormatMessage,
  courtStartDate?: Date,
  courtEndTime?: Date,
): string => {
  return courtEndTime
    ? formatMessage(courtRecord.signOff, {
        endDate:
          courtStartDate && isSameDay(courtStartDate, courtEndTime)
            ? 'NONE'
            : formatDate(courtEndTime, 'd. MMMM'),
        endTime: formatDate(courtEndTime, 'p'),
      })
    : formatMessage(courtRecord.inSession)
}

const constructRestrictionCourtRecordPdf = (
  theCase: Case,
  formatMessage: FormatMessage,
  user?: User,
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

  const title = formatMessage(courtRecord.title)

  setTitle(doc, title)
  addCoatOfArms(doc)
  addEmptyLines(doc, 5)
  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.court?.name ?? formatMessage(courtRecord.missingCourt),
    'Times-Roman',
  )
  setLineGap(doc, 2)
  addMediumHeading(doc, title)
  setLineGap(doc, 30)
  addMediumHeading(
    doc,
    formatMessage(courtRecord.caseNumber, {
      caseNumber: theCase.courtCaseNumber,
    }),
  )
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.intro, {
      courtDate: formatDate(theCase.courtStartDate, 'PPP'),
      judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${lowercase(
        theCase.judge?.title,
      )}`,
      courtLocation: theCase.courtLocation
        ? ` ${lowercase(
            theCase.courtLocation?.slice(theCase.courtLocation.length - 1) ===
              '.'
              ? theCase.courtLocation?.slice(0, -1)
              : theCase.courtLocation,
          )}`
        : '',
      caseNumber: theCase.courtCaseNumber,
      startTime: formatDate(theCase.courtStartDate, 'p'),
    }),
  )

  if (!theCase.isClosedCourtHidden) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.closedCourtAnnouncement),
    )
  }

  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.prosecutorIs)} ${
      theCase.prosecutorsOffice?.name ?? courtRecord.missingDistrict
    }.`,
  )
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.defendantIs, {
      suffix: theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      isSuffix: theCase.defendants && theCase.defendants.length > 1 ? 'u' : '',
    })}${
      theCase.defendants?.reduce(
        (acc, defendant, index) =>
          `${acc}${
            index === 0
              ? ''
              : index + 1 === theCase.defendants?.length
              ? ' og'
              : ','
          } ${defendant.name ?? '-'}`,
        '',
      ) ?? ` ${courtRecord.missingDefendants}`
    }.`,
  )

  if (theCase.courtAttendees?.trim()) {
    addEmptyLines(doc)
    addNormalText(
      doc,
      formatMessage(courtRecord.attendeesHeading),
      'Times-Bold',
    )
    addEmptyLines(doc)

    addNormalJustifiedText(doc, theCase.courtAttendees, 'Times-Roman')
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    formatMessage(courtRecord.courtDocuments.heading),
    'Times-Bold',
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.courtDocuments.request, {
      caseTypes: formatRequestCaseType(theCase.type),
    })} ${formatMessage(courtRecord.courtDocuments.announcement)}`,
    'Times-Roman',
  )

  theCase.courtDocuments?.forEach((courtDocument, index) =>
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.courtDocuments.other, {
        documentName: courtDocument.name,
        documentNumber: index + 2,
        submittedBy: courtDocument.submittedBy,
      }),
    ),
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.sessionBookings ??
      formatMessage(courtRecord.missingSessionBookings),
  )
  setLineGap(doc, 3)
  addEmptyLines(doc, 2)
  setLineGap(doc, 16)
  addMediumHeading(doc, formatMessage(courtRecord.conclusionHeading))
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    theCase.conclusion ?? formatMessage(courtRecord.missingConclusion),
  )

  addEmptyLines(doc)
  addNormalCenteredText(
    doc,
    theCase.judge?.name ?? formatMessage(courtRecord.missingJudge),
    'Times-Bold',
  )

  if (theCase.endOfSessionBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.endOfSessionBookings, 'Times-Roman')
  }

  if (theCase.registrar) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${lowercase(
          theCase.registrar.title,
        )}`,
      }),
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    formatCourtEndDate(
      formatMessage,
      theCase.courtStartDate,
      theCase.courtEndTime,
    ),
  )
  addFooter(
    doc,
    completedRequestCaseStates.includes(theCase.state) && user
      ? formatMessage(courtRecord.smallPrint, {
          actorName: user.name,
          actorInstitution: user.institution?.name || 'NONE',
          date: formatDate(nowFactory(), 'PPPp'),
        })
      : undefined,
  )

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

const constructInvestigationCourtRecordPdf = (
  theCase: Case,
  formatMessage: FormatMessage,
  user?: User,
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

  const isCaseCompletedWithRuling = !theCase.isCompletedWithoutRuling

  const title = formatMessage(courtRecord.title)

  setTitle(doc, title)
  addCoatOfArms(doc)
  addEmptyLines(doc, 5)
  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.court?.name ?? formatMessage(courtRecord.missingCourt),
    'Times-Roman',
  )
  setLineGap(doc, 2)
  addMediumHeading(doc, title)
  setLineGap(doc, 30)
  addMediumHeading(
    doc,
    formatMessage(courtRecord.caseNumber, {
      caseNumber: theCase.courtCaseNumber,
    }),
  )
  setLineGap(doc, 1)
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.intro, {
      courtDate: formatDate(theCase.courtStartDate, 'PPP'),
      judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${lowercase(
        theCase.judge?.title,
      )}`,
      courtLocation: theCase.courtLocation
        ? ` ${lowercase(
            theCase.courtLocation?.slice(theCase.courtLocation.length - 1) ===
              '.'
              ? theCase.courtLocation?.slice(0, -1)
              : theCase.courtLocation,
          )}`
        : '',
      caseNumber: theCase.courtCaseNumber,
      startTime: formatDate(theCase.courtStartDate, 'p'),
    }),
  )

  if (!theCase.isClosedCourtHidden) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.closedCourtAnnouncement),
    )
  }

  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.prosecutorIs)} ${
      theCase.prosecutorsOffice?.name ?? courtRecord.missingDistrict
    }.`,
  )
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.defendantIs, {
      suffix: theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      isSuffix: theCase.defendants && theCase.defendants.length > 1 ? 'u' : '',
    })}${
      theCase.defendants?.reduce(
        (acc, defendant, index) =>
          `${acc}${
            index === 0
              ? ''
              : index + 1 === theCase.defendants?.length
              ? ' og'
              : ','
          } ${defendant.name ?? '-'}`,
        '',
      ) ?? ` ${courtRecord.missingDefendants}`
    }.`,
  )

  if (theCase.courtAttendees?.trim()) {
    addEmptyLines(doc)
    addNormalText(
      doc,
      formatMessage(courtRecord.attendeesHeading),
      'Times-Bold',
    )
    addEmptyLines(doc)

    addNormalJustifiedText(doc, theCase.courtAttendees, 'Times-Roman')
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    formatMessage(courtRecord.courtDocuments.heading),
    'Times-Bold',
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    `${formatMessage(courtRecord.courtDocuments.request, {
      caseTypes: formatRequestCaseType(theCase.type),
    })} ${formatMessage(courtRecord.courtDocuments.announcement)}`,
    'Times-Roman',
  )

  theCase.courtDocuments?.forEach((courtDocument, index) =>
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.courtDocuments.other, {
        documentName: courtDocument.name,
        documentNumber: index + 2,
        submittedBy: courtDocument.submittedBy,
      }),
    ),
  )
  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.sessionBookings ??
      formatMessage(courtRecord.missingSessionBookings),
  )
  setLineGap(doc, 3)

  addEmptyLines(doc, 2)
  if (isCaseCompletedWithRuling) {
    setLineGap(doc, 16)

    addMediumHeading(doc, formatMessage(courtRecord.conclusionHeading))

    setLineGap(doc, 1)

    addNormalJustifiedText(
      doc,
      theCase.conclusion ?? formatMessage(courtRecord.missingConclusion),
    )

    addEmptyLines(doc)
    addNormalCenteredText(
      doc,
      theCase.judge?.name ?? formatMessage(courtRecord.missingJudge),
      'Times-Bold',
    )
  }

  if (theCase.endOfSessionBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.endOfSessionBookings, 'Times-Roman')
  }

  if (theCase.registrar) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${lowercase(
          theCase.registrar.title,
        )}`,
      }),
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    formatCourtEndDate(
      formatMessage,
      theCase.courtStartDate,
      theCase.courtEndTime,
    ),
  )
  addFooter(
    doc,
    completedRequestCaseStates.includes(theCase.state) && user
      ? formatMessage(courtRecord.smallPrint, {
          actorName: user.name,
          actorInstitution: user.institution?.name || 'NONE',
          date: formatDate(nowFactory(), 'PPPp'),
        })
      : undefined,
  )

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

const constructCourtRecordPdf = (
  theCase: Case,
  formatMessage: FormatMessage,
  user?: User,
): Promise<Buffer> => {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionCourtRecordPdf(theCase, formatMessage, user)
    : constructInvestigationCourtRecordPdf(theCase, formatMessage, user)
}

export const getCourtRecordPdfAsString = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> => {
  return constructCourtRecordPdf(theCase, formatMessage).then((buffer) =>
    buffer.toString('binary'),
  )
}

export const getCourtRecordPdfAsBuffer = (
  theCase: Case,
  formatMessage: FormatMessage,
  user?: User,
): Promise<Buffer> => {
  return constructCourtRecordPdf(theCase, formatMessage, user)
}
