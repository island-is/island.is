import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatCaseType,
  formatDate,
  formatNationalId,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  CaseType,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import { core, request as m } from '../messages'
import { Case } from '../modules/repository'
import { formatLegalProvisions } from './formatters'
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
} from './pdfHelpers'

const constructRestrictionRequestPdf = (
  theCase: Case,
  formatMessage: FormatMessage,
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
    caseTypeText = formatMessage(core.caseType.admissionToFacility)
  } else if (theCase.type === CaseType.TRAVEL_BAN) {
    caseTypeText = formatMessage(core.caseType.travelBan)
  } else if (theCase.type === CaseType.CUSTODY) {
    caseTypeText = formatMessage(core.caseType.custody)
  }

  const title = formatMessage(m.heading, {
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
    theCase.prosecutorsOffice?.name ?? formatMessage(m.noDistrict),
    'Times-Bold',
  )
  setLineGap(doc, 24)
  addLargeHeading(doc, title, 'Times-Roman')
  setLineGap(doc, 8)
  addMediumPlusHeading(doc, formatDate(theCase.created, 'PPP') ?? '')
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  setLineGap(doc, 4)
  addMediumText(doc, formatMessage(m.policeCaseNumbers), 'Times-Bold')
  theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
    addNormalText(doc, policeCaseNumber, 'Times-Roman')
  })
  addEmptyLines(doc)
  addMediumText(
    doc,
    capitalize(
      formatMessage(core.defendant, {
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
        `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
        'Times-Roman',
      )
    } else if (defendant.nationalId) {
      addNormalText(
        doc,
        `${formatMessage(m.baseInfo.dateOfBirth)} ${defendant.nationalId}`,
        'Times-Roman',
      )
    }

    addNormalText(
      doc,
      `${formatMessage(m.baseInfo.fullName)} ${defendant.name ?? ''}`,
    )
    addNormalText(
      doc,
      `${formatMessage(m.baseInfo.address)} ${defendant.address ?? ''}`,
    )
  })

  if (theCase.defendants && theCase.defendants.length > 1) {
    addEmptyLines(doc)
  }

  addNormalText(
    doc,
    formatMessage(m.baseInfo.defender, {
      defenderName:
        theCase.defenderName &&
        theCase.sessionArrangements !==
          SessionArrangements.ALL_PRESENT_SPOKESPERSON
          ? theCase.defenderName
          : formatMessage(m.baseInfo.noDefender),
    }),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.demands.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.demands ?? formatMessage(m.demands.noDemands),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.lawsBroken.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.legalBasis.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    formatLegalProvisions(theCase.legalProvisions, theCase.legalBasis),
    'Times-Roman',
  )
  addEmptyLines(doc, 2)
  addLargeText(doc, formatMessage(m.factsAndArguments.heading), 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.factsAndArguments.facts))
  addNormalJustifiedText(
    doc,
    theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.factsAndArguments.arguments), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    `${
      theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)
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
  formatMessage: FormatMessage,
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

  const title = formatMessage(m.heading, {
    caseType: formatMessage(core.caseType.investigate),
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
    theCase.prosecutorsOffice?.name ?? formatMessage(m.noDistrict),
    'Times-Bold',
  )
  setLineGap(doc, 24)
  addHugeHeading(doc, title, 'Times-Roman')
  setLineGap(doc, 8)
  addMediumPlusHeading(doc, formatDate(theCase.created, 'PPP') ?? '')
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  setLineGap(doc, 4)
  addMediumText(doc, formatMessage(m.policeCaseNumbers), 'Times-Bold')
  theCase.policeCaseNumbers.forEach((policeCaseNumber) => {
    addNormalText(doc, policeCaseNumber, 'Times-Roman')
  })
  addEmptyLines(doc)
  addMediumText(
    doc,
    capitalize(
      formatMessage(core.defendant, {
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
        `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
        'Times-Roman',
      )
    } else if (defendant.nationalId) {
      addNormalText(
        doc,
        `${formatMessage(m.baseInfo.dateOfBirth)} ${defendant.nationalId}`,
        'Times-Roman',
      )
    }

    addNormalText(
      doc,
      `${formatMessage(m.baseInfo.fullName)} ${defendant.name ?? ''}`,
    )
    addNormalText(
      doc,
      `${formatMessage(m.baseInfo.address)} ${defendant.address ?? ''}`,
    )
  })

  if (
    theCase.defenderName &&
    theCase.sessionArrangements !== SessionArrangements.ALL_PRESENT_SPOKESPERSON
  ) {
    if (theCase.defendants && theCase.defendants.length > 1) {
      addEmptyLines(doc)
    }

    addNormalText(
      doc,
      formatMessage(m.baseInfo.defender, {
        defenderName: theCase.defenderName,
      }),
      'Times-Roman',
    )
  }

  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.description.heading), 'Times-Bold')
  addNormalText(
    doc,
    capitalize(
      theCase.type === CaseType.OTHER
        ? formatMessage(core.caseType.investigate)
        : formatCaseType(theCase.type),
    ),
    'Times-Roman',
  )

  if (theCase.description && theCase.description.trim()) {
    addNormalJustifiedText(doc, theCase.description)
  }

  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.demands.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.demands ?? formatMessage(m.demands.noDemands),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.lawsBroken.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.legalBasis.heading), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalBasis ?? formatMessage(m.legalBasis.noLegalBasis),
    'Times-Roman',
  )
  addEmptyLines(doc, 2)
  addLargeText(doc, formatMessage(m.factsAndArguments.heading), 'Times-Bold')
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.factsAndArguments.facts))
  addNormalJustifiedText(
    doc,
    theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
    'Times-Roman',
  )
  addEmptyLines(doc)
  addMediumText(doc, formatMessage(m.factsAndArguments.arguments), 'Times-Bold')
  addNormalJustifiedText(
    doc,
    theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
    'Times-Roman',
  )
  addEmptyLines(doc)

  if (theCase.requestProsecutorOnlySession) {
    addMediumText(
      doc,
      formatMessage(m.requestProsecutorOnlySession),
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
      theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)
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
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionRequestPdf(theCase, formatMessage)
    : constructInvestigationRequestPdf(theCase, formatMessage)
}

export const getRequestPdfAsString = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> => {
  return constructRequestPdf(theCase, formatMessage).then((buffer) =>
    buffer.toString('binary'),
  )
}

export const getRequestPdfAsBuffer = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  return constructRequestPdf(theCase, formatMessage)
}
