import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatDate,
  lowercase,
  formatAppeal,
  formatRequestCaseType,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { courtRecord } from '../messages'
import {
  setPageNumbers,
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

function constructRestrictionCourtRecordPdf(
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
      judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${
        theCase.judge?.title ?? '?'
      }`,
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
      theCase.prosecutor?.institution?.name ?? courtRecord.missingDistrict
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
              ? ', og'
              : ','
          } ${defendant.name ?? '-'}, kt. ${formatNationalId(
            defendant.nationalId ?? '-',
          )}`,
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
    formatMessage(courtRecord.courtDocuments.request, {
      caseTypes: formatRequestCaseType(theCase.type),
    }),
    'Times-Roman',
  )
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.courtDocuments.announcement),
  )

  theCase.courtDocuments?.forEach((courttDocument, index) =>
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
    ),
  )

  if (theCase.accusedBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.accusedBookings)
  }

  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.litigationPresentations ??
      formatMessage(courtRecord.missingLitigationPresentations),
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
  addEmptyLines(doc, 2)
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.conclusionIntro),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalJustifiedText(doc, formatMessage(courtRecord.appealDirections))

  let prosecutorAppeal = formatAppeal(
    theCase.prosecutorAppealDecision,
    capitalize(formatMessage(courtRecord.prosecutor)),
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      theCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = theCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, prosecutorAppeal)
  }

  let accusedAppeal = formatAppeal(
    theCase.accusedAppealDecision,
    capitalize(
      formatMessage(courtRecord.defendant, {
        suffix:
          theCase.defendants && theCase.defendants?.length > 1 ? 'ar' : 'i',
      }),
    ),
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      theCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = theCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, accusedAppeal)
  }

  if (theCase.endOfSessionBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.endOfSessionBookings)
  }

  if (theCase.registrar) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${theCase.registrar.title}`,
      }),
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    theCase.courtEndTime
      ? formatMessage(courtRecord.signOff, {
          endTime: formatDate(theCase.courtEndTime, 'p'),
        })
      : formatMessage(courtRecord.inSession),
  )
  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationCourtRecordPdf(
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
      judgeNameAndTitle: `${theCase.judge?.name ?? '?'} ${
        theCase.judge?.title ?? '?'
      }`,
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
      theCase.prosecutor?.institution?.name ?? courtRecord.missingDistrict
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
              ? ', og'
              : ','
          } ${defendant.name ?? '-'}, kt. ${formatNationalId(
            defendant.nationalId ?? '-',
          )}`,
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
    formatMessage(courtRecord.courtDocuments.request, {
      caseTypes: formatRequestCaseType(theCase.type),
    }),
    'Times-Roman',
  )
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.courtDocuments.announcement),
  )

  theCase.courtDocuments?.forEach((courttDocument, index) =>
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.courtDocuments.other, {
        documentName: courttDocument,
        documentNumber: index + 2,
      }),
    ),
  )

  if (theCase.accusedBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.accusedBookings)
  }

  addEmptyLines(doc)
  addNormalJustifiedText(
    doc,
    theCase.litigationPresentations ??
      formatMessage(courtRecord.missingLitigationPresentations),
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
  addEmptyLines(doc, 2)
  addNormalJustifiedText(
    doc,
    formatMessage(courtRecord.conclusionIntro),
    'Times-Roman',
  )

  if (theCase.sessionArrangements === SessionArrangements.ALL_PRESENT) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, formatMessage(courtRecord.appealDirections))
  }

  let prosecutorAppeal = formatAppeal(
    theCase.prosecutorAppealDecision,
    capitalize(formatMessage(courtRecord.prosecutor)),
  )

  if (prosecutorAppeal) {
    prosecutorAppeal = `${prosecutorAppeal} ${
      theCase.prosecutorAppealAnnouncement ?? ''
    }`
  } else {
    prosecutorAppeal = theCase.prosecutorAppealAnnouncement ?? ''
  }

  if (prosecutorAppeal) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, prosecutorAppeal)
  }

  let accusedAppeal = formatAppeal(
    theCase.accusedAppealDecision,
    capitalize(
      formatMessage(courtRecord.defendant, {
        suffix:
          theCase.defendants && theCase.defendants?.length > 1 ? 'ar' : 'i',
      }),
    ),
  )

  if (accusedAppeal) {
    accusedAppeal = `${accusedAppeal} ${
      theCase.accusedAppealAnnouncement ?? ''
    }`
  } else {
    accusedAppeal = theCase.accusedAppealAnnouncement ?? ''
  }

  if (accusedAppeal) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, accusedAppeal)
  }

  if (theCase.endOfSessionBookings) {
    addEmptyLines(doc)
    addNormalJustifiedText(doc, theCase.endOfSessionBookings)
  }

  if (theCase.registrar) {
    addEmptyLines(doc)
    addNormalJustifiedText(
      doc,
      formatMessage(courtRecord.registrarWitness, {
        registrarNameAndTitle: `${theCase.registrar.name} ${theCase.registrar.title}`,
      }),
    )
  }

  addEmptyLines(doc)
  addNormalText(
    doc,
    theCase.courtEndTime
      ? formatMessage(courtRecord.signOff, {
          endTime: formatDate(theCase.courtEndTime, 'p'),
        })
      : formatMessage(courtRecord.inSession),
  )
  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructCourtRecordPdf(
  theCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionCourtRecordPdf(theCase, formatMessage)
    : constructInvestigationCourtRecordPdf(theCase, formatMessage)
}

export async function getCourtRecordPdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructCourtRecordPdf(theCase, formatMessage)

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

export async function getCourtRecordPdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructCourtRecordPdf(theCase, formatMessage)

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
