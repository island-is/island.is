import PDFDocument from 'pdfkit'

import {
  capitalize,
  formatCaseType,
  formatDate,
  formatNationalId,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  CaseType,
  EventType,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import {
  core,
  formatIcuMessage,
  request as m,
} from '../../messages'
import { Case, Defendant, EventLog } from '../../modules/repository'
import { formatLegalProvisions } from '../formatters'
import {
  addCoatOfArms,
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addLargeHeading,
  addLargeText,
  addMediumPlusHeading,
  addMediumText,
  addNormalJustifiedText,
  addNormalText,
  addPoliceStar,
  setLineGap,
  setTitle,
} from '../pdfHelpers'

/** Defender display name for a request-PDF defendant row. */
export const formatRequestPdfDefenderName = (
  defendant: Pick<Defendant, 'defenderName'>,
  sessionArrangements: Case['sessionArrangements'],
  noDefenderLabel: string,
): string => {
  if (
    defendant.defenderName &&
    sessionArrangements !== SessionArrangements.ALL_PRESENT_SPOKESPERSON
  ) {
    return defendant.defenderName
  }

  return noDefenderLabel
}

const constructRestrictionRequestPdf = (
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  let caseTypeText = ''
  if (theCase.type === CaseType.ADMISSION_TO_FACILITY) {
    caseTypeText = core.caseType.admissionToFacility
  } else if (theCase.type === CaseType.TRAVEL_BAN) {
    caseTypeText = core.caseType.travelBan
  } else if (theCase.type === CaseType.CUSTODY) {
    caseTypeText = core.caseType.custody
  }

  const title = formatIcuMessage(m.heading, {
    caseType: caseTypeText,
  })

  setTitle(doc, title)

  if (theCase.prosecutorsOffice?.name?.startsWith('Lögreglustjórinn')) {
    addPoliceStar(doc)
    addEmptyLines(doc, 5)
  } else {
    addCoatOfArms(doc)
    addEmptyLines(doc, 5)
  }

  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.prosecutorsOffice?.name ?? m.noDistrict,
    'Times-Bold',
  )
  setLineGap(doc, 24)
  addLargeHeading(doc, title, 'Times-Roman')
  setLineGap(doc, 8)
  addMediumPlusHeading(
    doc,
    formatDate(
      EventLog.getEventLogByEventType(
        EventType.CASE_SENT_TO_COURT,
        theCase.eventLogs,
      )?.created ?? new Date(),
      'PPP',
    ) ?? '',
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${m.baseInfo.court} ${theCase.court?.name}`,
  )
  setLineGap(doc, 4)
  addMediumText(doc, m.policeCaseNumbers, 'Times-Bold')
  theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
    addNormalText(doc, policeCaseNumber, 'Times-Roman')
  })
  addEmptyLines(doc)
  addMediumText(
    doc,
    capitalize(
      formatIcuMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      }),
    ),
    'Times-Bold',
  )

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      addEmptyLines(doc)
    }

    if (!defendant.noNationalId) {
      addNormalText(
        doc,
        `${m.baseInfo.nationalId} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
        'Times-Roman',
      )
    } else if (defendant.nationalId) {
      addNormalText(
        doc,
        `${m.baseInfo.dateOfBirth} ${defendant.nationalId}`,
        'Times-Roman',
      )
    }

    addNormalText(
      doc,
      `${m.baseInfo.fullName} ${defendant.name ?? ''}`,
    )
    addNormalText(
      doc,
      `${m.baseInfo.address} ${defendant.address ?? ''}`,
    )
    addNormalText(
      doc,
      formatIcuMessage(m.baseInfo.defender, {
        defenderName: formatRequestPdfDefenderName(
          defendant,
          theCase.sessionArrangements,
          m.baseInfo.noDefender,
        ),
      }),
      'Times-Roman',
    )
  })

  addEmptyLines(doc)
  addMediumText(doc, m.demands.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.demands ?? m.demands.noDemands,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.lawsBroken.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.lawsBroken ?? m.lawsBroken.noLawsBroken,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.legalBasis.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    formatLegalProvisions(theCase.legalProvisions, theCase.legalBasis),
    'Times-Roman',
  )
  addEmptyLines(doc, 2)
  addLargeText(doc, m.factsAndArguments.heading, 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, m.factsAndArguments.facts)
  addNormalJustifiedText(
    doc,
    theCase.caseFacts ?? m.factsAndArguments.noFacts,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.factsAndArguments.arguments, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalArguments ?? m.factsAndArguments.noArguments,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    `${
      theCase.prosecutor?.name ?? m.prosecutor.noProsecutor
    } ${lowercase(theCase.prosecutor?.title)}`,
    'Times-Bold',
  )
  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

const constructInvestigationRequestPdf = (
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  const title = formatIcuMessage(m.heading, {
    caseType: core.caseType.investigate,
  })

  setTitle(doc, title)

  if (theCase.prosecutorsOffice?.name?.startsWith('Lögreglustjórinn')) {
    addPoliceStar(doc)
    addEmptyLines(doc, 5)
  } else {
    addCoatOfArms(doc)
    addEmptyLines(doc, 5)
  }

  setLineGap(doc, 4)
  addLargeHeading(
    doc,
    theCase.prosecutorsOffice?.name ?? m.noDistrict,
    'Times-Bold',
  )
  setLineGap(doc, 24)
  addHugeHeading(doc, title, 'Times-Roman')
  setLineGap(doc, 8)

  addMediumPlusHeading(
    doc,
    formatDate(
      EventLog.getEventLogByEventType(
        EventType.CASE_SENT_TO_COURT,
        theCase.eventLogs,
      )?.created ?? new Date(),
      'PPP',
    ) ?? '',
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${m.baseInfo.court} ${theCase.court?.name}`,
  )
  setLineGap(doc, 4)
  addMediumText(doc, m.policeCaseNumbers, 'Times-Bold')
  theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
    addNormalText(doc, policeCaseNumber, 'Times-Roman')
  })
  addEmptyLines(doc)
  addMediumText(
    doc,
    capitalize(
      formatIcuMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      }),
    ),
    'Times-Bold',
  )

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      addEmptyLines(doc)
    }

    if (!defendant.noNationalId) {
      addNormalText(
        doc,
        `${m.baseInfo.nationalId} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
        'Times-Roman',
      )
    } else if (defendant.nationalId) {
      addNormalText(
        doc,
        `${m.baseInfo.dateOfBirth} ${defendant.nationalId}`,
        'Times-Roman',
      )
    }

    addNormalText(
      doc,
      `${m.baseInfo.fullName} ${defendant.name ?? ''}`,
    )
    addNormalText(
      doc,
      `${m.baseInfo.address} ${defendant.address ?? ''}`,
    )

    if (
      defendant.defenderName &&
      theCase.sessionArrangements !==
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
    ) {
      addNormalText(
        doc,
        formatIcuMessage(m.baseInfo.defender, {
          defenderName: defendant.defenderName,
        }),
        'Times-Roman',
      )
    }
  })

  addEmptyLines(doc)
  addMediumText(doc, m.description.heading, 'Times-Bold')
  addNormalText(
    doc,
    capitalize(
      theCase.type === CaseType.OTHER
        ? core.caseType.investigate
        : formatCaseType(theCase.type),
    ),
    'Times-Roman',
  )

  if (theCase.description && theCase.description.trim()) {
    addNormalJustifiedText(doc, theCase.description)
  }

  addEmptyLines(doc)
  addMediumText(doc, m.demands.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.demands ?? m.demands.noDemands,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.lawsBroken.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.lawsBroken ?? m.lawsBroken.noLawsBroken,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.legalBasis.heading, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalBasis ?? m.legalBasis.noLegalBasis,
    'Times-Roman',
  )
  addEmptyLines(doc, 2)
  addLargeText(doc, m.factsAndArguments.heading, 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, m.factsAndArguments.facts)
  addNormalJustifiedText(
    doc,
    theCase.caseFacts ?? m.factsAndArguments.noFacts,
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, m.factsAndArguments.arguments, 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalArguments ?? m.factsAndArguments.noArguments,
    'Times-Roman',
  )
  addEmptyLines(doc)

  if (theCase.requestProsecutorOnlySession) {
    addMediumText(
      doc,
      m.requestProsecutorOnlySession,
      'Times-Bold',
    )
    addNormalJustifiedText(
      doc,
      theCase.prosecutorOnlySessionRequest ?? '',
      'Times-Roman',
    )
    addEmptyLines(doc)
  }

  addNormalText(
    doc,
    `${
      theCase.prosecutor?.name ?? m.prosecutor.noProsecutor
    } ${lowercase(theCase.prosecutor?.title)}`,
    'Times-Bold',
  )
  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

const constructRequestPdf = (
  theCase: Case,
): Promise<Buffer> => {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionRequestPdf(theCase)
    : constructInvestigationRequestPdf(theCase)
}

export const getRequestPdfAsString = (
  theCase: Case,
): Promise<string> => {
  return constructRequestPdf(theCase).then((buffer) =>
    buffer.toString('binary'),
  )
}

export const getRequestPdfAsBuffer = (
  theCase: Case,
): Promise<Buffer> => {
  return constructRequestPdf(theCase)
}
