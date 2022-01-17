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
  baseFontSize,
  hugeFontSize,
  largeFontSize,
  mediumFontSize,
  mediumPlusFontSize,
  setPageNumbers,
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

  if (doc.info) {
    doc.info['Title'] = title
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(hugeFontSize)
    .lineGap(8)
    .text(title, { align: 'center' })
    .font('Helvetica')
    .fontSize(largeFontSize)
    .text(
      theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(mediumPlusFontSize)
    .text(
      `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
        theCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`, {
      align: 'center',
    })
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .lineGap(4)
    // Assume there is at most one defendant
    .text(
      `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
        theCase.defendants &&
          theCase.defendants.length > 0 &&
          theCase.defendants[0].nationalId
          ? theCase.defendants[0].nationalId
          : '',
      )}`,
    )
    .text(
      `${formatMessage(m.baseInfo.fullName)} ${
        theCase.defendants &&
        theCase.defendants.length > 0 &&
        theCase.defendants[0].name
          ? theCase.defendants[0].name
          : ''
      }`,
    )
    .text(
      `${formatMessage(m.baseInfo.address)} ${
        theCase.defendants &&
        theCase.defendants.length > 0 &&
        theCase.defendants[0].address
          ? theCase.defendants[0].address
          : ''
      }`,
    )
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
    .lineGap(8)
    .text(formatMessage(m.demands.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.demands ?? formatMessage(m.demands.noDemands), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.lawsBroken.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.legalBasis.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(formatLegalProvisions(theCase.legalProvisions, theCase.legalBasis), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(mediumFontSize)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
      {
        lineGap: 6,
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

  if (doc.info) {
    doc.info['Title'] = title
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(hugeFontSize)
    .lineGap(8)
    .text(title, { align: 'center' })
    .font('Helvetica')
    .fontSize(largeFontSize)
    .text(
      theCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(mediumPlusFontSize)
    .text(
      `${formatDate(theCase.created, 'PPP')} - Mál nr. ${
        theCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`${formatMessage(m.baseInfo.court)} ${theCase.court?.name}`, {
      align: 'center',
    })
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .lineGap(4)

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

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.description.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .lineGap(4)
    .text(
      capitalize(
        theCase.type === CaseType.OTHER
          ? formatMessage(core.caseType.investigate)
          : caseTypes[theCase.type],
      ),
    )
    .text(theCase.description ?? formatMessage(m.description.noDescription), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.demands.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.demands ?? formatMessage(m.demands.noDemands), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.lawsBroken.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.legalBasis.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.legalBasis ?? formatMessage(m.legalBasis.noLegalBasis), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(mediumFontSize)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(theCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts), {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      theCase.legalArguments ?? formatMessage(m.factsAndArguments.noArguments),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')

  if (theCase.requestProsecutorOnlySession) {
    doc
      .font('Helvetica-Bold')
      .fontSize(mediumFontSize)
      .lineGap(8)
      .text(formatMessage(m.requestProsecutorOnlySession))
      .font('Helvetica')
      .fontSize(baseFontSize)
      .text(theCase.prosecutorOnlySessionRequest ?? '', {
        lineGap: 6,
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
  existingCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return isRestrictionCase(existingCase.type)
    ? constructRestrictionRequestPdf(existingCase, formatMessage)
    : constructInvestigationRequestPdf(existingCase, formatMessage)
}

export async function getRequestPdfAsString(
  existingCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructRequestPdf(existingCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.pdf`, pdf)
  }

  return pdf
}

export async function getRequestPdfAsBuffer(
  existingCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructRequestPdf(existingCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-request.pdf`, pdf)
  }

  return pdf
}
