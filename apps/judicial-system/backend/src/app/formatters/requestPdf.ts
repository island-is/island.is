import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { FormatMessage } from '@island.is/cms-translations'
import { CaseType, isRestrictionCase } from '@island.is/judicial-system/types'
import {
  caseTypes,
  formatNationalId,
  capitalize,
  formatDate,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { restrictionRequest as m, core } from '../messages'
import { Case } from '../modules/case/models'
import { formatLegalProvisions } from './formatters'
import {
  addHugeHeading,
  addLargeHeading,
  addMediumPlusHeading,
  baseFontSize,
  largeFontSize,
  mediumFontSize,
  setLineGap,
  setPageNumbers,
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

  const title = formatMessage(m.heading, {
    caseType:
      theCase.type === CaseType.CUSTODY
        ? formatMessage(core.caseType.custody)
        : formatMessage(core.caseType.travelBan),
  })

  setTitle(doc, title)

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  setLineGap(doc, 8)
  addHugeHeading(doc, 'Helvetica-Bold', title)
  addLargeHeading(
    doc,
    'Helvetica',
    theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
  )
  addMediumPlusHeading(
    doc,
    'Helvetica',
    `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
      theCase.policeCaseNumber
    }`,
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    'Helvetica',
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  doc.font('Helvetica-Bold').fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(
      capitalize(
        formatMessage(core.defendant, {
          suffix:
            theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
        }),
      ),
    )
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 4)

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      doc.text(' ')
    }

    doc
      .text(
        `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
      )
      .text(`${formatMessage(m.baseInfo.fullName)} ${defendant.name ?? ''}`)
      .text(`${formatMessage(m.baseInfo.address)} ${defendant.address ?? ''}`)
  })

  if (theCase.defendants && theCase.defendants.length > 1) {
    doc.text(' ')
  }

  doc
    .text(
      formatMessage(m.baseInfo.defender, {
        defenderName:
          theCase.defenderName && !theCase.defenderIsSpokesperson
            ? theCase.defenderName
            : formatMessage(m.baseInfo.noDefender),
      }),
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.demands.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.demands ?? formatMessage(m.demands.noDemands), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.lawsBroken.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.legalBasis.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(formatLegalProvisions(theCase.legalProvisions, theCase.legalBasis), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(mediumFontSize)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(
      theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
      {
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${
        theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)
      } ${theCase.prosecutor?.title ?? ''}`,
    )

  setPageNumbers(doc)

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

  const title = formatMessage(m.heading, {
    caseType: formatMessage(core.caseType.investigate),
  })

  setTitle(doc, title)

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  setLineGap(doc, 8)
  addHugeHeading(doc, 'Helvetica-Bold', title)
  addLargeHeading(
    doc,
    'Helvetica',
    theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
  )
  addMediumPlusHeading(
    doc,
    'Helvetica',
    `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
      theCase.policeCaseNumber
    }`,
  )
  setLineGap(doc, 40)
  addMediumPlusHeading(
    doc,
    'Helvetica',
    `${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`,
  )
  doc.font('Helvetica-Bold').fontSize(largeFontSize)
  setLineGap(doc, 8)
  doc
    .text(
      capitalize(
        formatMessage(core.defendant, {
          suffix:
            theCase.defendants && theCase.defendants.length > 1 ? 'ar' : 'i',
        }),
      ),
    )
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 4)

  theCase.defendants?.forEach((defendant, index) => {
    if (index > 0) {
      doc.text(' ')
    }

    doc
      .text(
        `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
          defendant.nationalId ?? '',
        )}`,
      )
      .text(`${formatMessage(m.baseInfo.fullName)} ${defendant.name ?? ''}`)
      .text(`${formatMessage(m.baseInfo.address)} ${defendant.address ?? ''}`)
  })

  if (theCase.defenderName && !theCase.defenderIsSpokesperson) {
    if (theCase.defendants && theCase.defendants.length > 1) {
      doc.text(' ')
    }

    doc.text(
      formatMessage(m.baseInfo.defender, {
        defenderName: theCase.defenderName,
      }),
    )
  }

  doc.text(' ').font('Helvetica-Bold').fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.description.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 4)
  doc.text(
    capitalize(
      theCase.type === CaseType.OTHER
        ? formatMessage(core.caseType.investigate)
        : caseTypes[theCase.type],
    ),
  )

  if (theCase.description && theCase.description.trim()) {
    doc.font('Helvetica').fontSize(baseFontSize)
    setLineGap(doc, 4)
    doc.text(theCase.description)
  }

  doc.text(' ').font('Helvetica-Bold').fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.demands.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.demands ?? formatMessage(m.demands.noDemands), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.lawsBroken.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.legalBasis.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.legalBasis ?? formatMessage(m.legalBasis.noLegalBasis), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(mediumFontSize)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts), {
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
  setLineGap(doc, 8)
  doc
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
  setLineGap(doc, 6)
  doc
    .text(
      theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
      {
        paragraphGap: 0,
      },
    )
    .text(' ')

  if (theCase.requestProsecutorOnlySession) {
    doc.font('Helvetica-Bold').fontSize(mediumFontSize)
    setLineGap(doc, 8)
    doc
      .text(formatMessage(m.requestProsecutorOnlySession))
      .font('Helvetica')
      .fontSize(baseFontSize)
    setLineGap(doc, 6)
    doc
      .text(theCase.prosecutorOnlySessionRequest ?? '', {
        paragraphGap: 0,
      })
      .text(' ')
  }

  doc
    .font('Helvetica-Bold')
    .text(
      `${
        theCase.prosecutor?.name ?? formatMessage(m.prosecutor.noProsecutor)
      } ${theCase.prosecutor?.title ?? ''}`,
    )

  setPageNumbers(doc)

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
