import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import {
  CaseType,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  caseTypes,
  formatNationalId,
  capitalize,
  formatDate,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case'
import { request as m, core } from '../messages'
import { formatLegalProvisions } from './formatters'
import {
  addEmptyLines,
  addHugeHeading,
  addLargeHeading,
  addLargeText,
  addMediumPlusHeading,
  addMediumText,
  addNormalText,
  setLineGap,
  addFooter,
  setTitle,
} from './pdfHelpers'
import { writeFile } from './writeFile'

function constructRestrictionRequestPdf(
  theCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
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

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  let caseTypeText = ''
  if (CaseType.ADMISSION_TO_FACILITY) {
    caseTypeText = formatMessage(core.caseType.admissionToFacility)
  } else if (CaseType.TRAVEL_BAN) {
    caseTypeText = formatMessage(core.caseType.travelBan)
  } else if (CaseType.CUSTODY) {
    caseTypeText = formatMessage(core.caseType.custody)
  }

  const title = formatMessage(m.heading, {
    caseType: caseTypeText,
  })

  setTitle(doc, title)
  setLineGap(doc, 8)
  addHugeHeading(doc, title, 'Helvetica-Bold')
  addLargeHeading(
    doc,
    theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
    'Helvetica',
  )
  addMediumPlusHeading(
    doc,
    `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
      theCase.policeCaseNumber
    }`,
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  setLineGap(doc, 8)
  addLargeText(
    doc,
    capitalize(
      formatMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      }),
    ),
    'Helvetica-Bold',
  )
  setLineGap(doc, 4)

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      addEmptyLines(doc)
    }

    addNormalText(
      doc,
      `${formatMessage(
        defendant.noNationalId ? m.baseInfo.dateOfBirth : m.baseInfo.nationalId,
      )} ${
        defendant.noNationalId
          ? defendant.nationalId
          : formatNationalId(defendant.nationalId ?? '')
      }`,
      'Helvetica',
    )
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
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.demands.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.demands ?? formatMessage(m.demands.noDemands),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.lawsBroken.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.legalBasis.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    formatLegalProvisions(theCase.legalProvisions, theCase.legalBasis),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addLargeText(
    doc,
    formatMessage(m.factsAndArguments.heading),
    'Helvetica-Bold',
  )
  addMediumText(doc, formatMessage(m.factsAndArguments.facts))
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(
    doc,
    formatMessage(m.factsAndArguments.arguments),
    'Helvetica-Bold',
  )
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
    'Helvetica',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    `${theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)} ${
      theCase.prosecutor?.title ?? ''
    }`,
    'Helvetica-Bold',
  )
  addFooter(doc)

  doc.end()

  return stream
}

function constructInvestigationRequestPdf(
  theCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
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

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  const title = formatMessage(m.heading, {
    caseType: formatMessage(core.caseType.investigate),
  })

  setTitle(doc, title)
  setLineGap(doc, 8)
  addHugeHeading(doc, title, 'Helvetica-Bold')
  addLargeHeading(
    doc,
    theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
    'Helvetica',
  )
  addMediumPlusHeading(
    doc,
    `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
      theCase.policeCaseNumber
    }`,
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  setLineGap(doc, 8)
  addLargeText(
    doc,
    capitalize(
      formatMessage(core.defendant, {
        suffix:
          theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
      }),
    ),
    'Helvetica-Bold',
  )
  setLineGap(doc, 4)

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      addEmptyLines(doc)
    }

    addNormalText(
      doc,
      `${formatMessage(
        defendant.noNationalId ? m.baseInfo.dateOfBirth : m.baseInfo.nationalId,
      )} ${
        defendant.noNationalId
          ? defendant.nationalId
          : formatNationalId(defendant.nationalId ?? '')
      }`,
      'Helvetica',
    )
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
      'Helvetica',
    )
  }

  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.description.heading), 'Helvetica-Bold')
  setLineGap(doc, 4)
  addNormalText(
    doc,
    capitalize(
      theCase.type === CaseType.OTHER
        ? formatMessage(core.caseType.investigate)
        : caseTypes[theCase.type],
    ),
    'Helvetica',
  )

  if (theCase.description && theCase.description.trim()) {
    addNormalText(doc, theCase.description)
  }

  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.demands.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.demands ?? formatMessage(m.demands.noDemands),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.lawsBroken.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, formatMessage(m.legalBasis.heading), 'Helvetica-Bold')
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.legalBasis ?? formatMessage(m.legalBasis.noLegalBasis),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addLargeText(
    doc,
    formatMessage(m.factsAndArguments.heading),
    'Helvetica-Bold',
  )
  addMediumText(doc, formatMessage(m.factsAndArguments.facts))
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(
    doc,
    formatMessage(m.factsAndArguments.arguments),
    'Helvetica-Bold',
  )
  setLineGap(doc, 6)
  addNormalText(
    doc,
    theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
    'Helvetica',
  )
  addEmptyLines(doc)

  if (theCase.requestProsecutorOnlySession) {
    setLineGap(doc, 8)
    addMediumText(
      doc,
      formatMessage(m.requestProsecutorOnlySession),
      'Helvetica-Bold',
    )
    setLineGap(doc, 6)
    addNormalText(doc, theCase.prosecutorOnlySessionRequest ?? '', 'Helvetica')
    addEmptyLines(doc)
  }

  addNormalText(
    doc,
    `${theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)} ${
      theCase.prosecutor?.title ?? ''
    }`,
    'Helvetica-Bold',
  )
  addFooter(doc)

  doc.end()

  return stream
}

function constructRequestPdf(
  theCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return isRestrictionCase(theCase.type)
    ? constructRestrictionRequestPdf(theCase, formatMessage)
    : constructInvestigationRequestPdf(theCase, formatMessage)
}

export async function getRequestPdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructRequestPdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-request.pdf`, pdf)
  }

  return pdf
}

export async function getRequestPdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructRequestPdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-request.pdf`, pdf)
  }

  return pdf
}
