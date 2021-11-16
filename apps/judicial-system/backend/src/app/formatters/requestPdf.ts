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
  existingCase: Case,
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
      existingCase.type === CaseType.CUSTODY
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
      existingCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(mediumPlusFontSize)
    .text(
      `${formatDate(existingCase.created, 'PPP')} - Mál nr. ${
        existingCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`${formatMessage(m.baseInfo.court)} ${existingCase.court?.name}`, {
      align: 'center',
    })
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .lineGap(4)
    .text(
      `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
        existingCase.accusedNationalId,
      )}`,
    )
    .text(`${formatMessage(m.baseInfo.fullName)} ${existingCase.accusedName}`)
    .text(`${formatMessage(m.baseInfo.address)} ${existingCase.accusedAddress}`)
    .text(
      formatMessage(m.baseInfo.defender, {
        defenderName:
          existingCase.defenderName && !existingCase.defenderIsSpokesperson
            ? existingCase.defenderName
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
    .text(existingCase.demands ?? formatMessage(m.demands.noDemands), {
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
    .text(existingCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
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
    .text(
      formatLegalProvisions(
        existingCase.legalProvisions,
        existingCase.legalBasis,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(mediumFontSize)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      existingCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      existingCase.legalArguments ??
        formatMessage(m.factsAndArguments.noArguments),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${
        existingCase.prosecutor?.name ??
        formatMessage(m.prosecutor.noProsecutor)
      } ${existingCase.prosecutor?.title ?? ''}`,
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationRequestPdf(
  existingCase: Case,
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
      existingCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(mediumPlusFontSize)
    .text(
      `${formatDate(existingCase.created, 'PPP')} - Mál nr. ${
        existingCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`${formatMessage(m.baseInfo.court)} ${existingCase.court?.name}`, {
      align: 'center',
    })
    .font('Helvetica-Bold')
    .fontSize(largeFontSize)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .lineGap(4)
    .text(
      `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
        existingCase.accusedNationalId,
      )}`,
    )
    .text(`${formatMessage(m.baseInfo.fullName)} ${existingCase.accusedName}`)
    .text(`${formatMessage(m.baseInfo.address)} ${existingCase.accusedAddress}`)

  if (existingCase.defenderName) {
    doc.text(
      formatMessage(m.baseInfo.defender, {
        defenderName:
          !existingCase.defenderIsSpokesperson && existingCase.defenderName,
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
    .text(capitalize(caseTypes[existingCase.type]))
    .text(
      existingCase.description ?? formatMessage(m.description.noDescription),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.demands.heading))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(existingCase.demands ?? formatMessage(m.demands.noDemands), {
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
    .text(existingCase.lawsBroken ?? formatMessage(m.lawsBroken.noLawsBroken), {
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
    .text(existingCase.legalBasis ?? formatMessage(m.legalBasis.noLegalBasis), {
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
    .text(
      existingCase.caseFacts ?? formatMessage(m.factsAndArguments.noFacts),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      existingCase.legalArguments ??
        formatMessage(m.factsAndArguments.noArguments),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')

  if (existingCase.requestProsecutorOnlySession) {
    doc
      .font('Helvetica-Bold')
      .fontSize(mediumFontSize)
      .lineGap(8)
      .text(formatMessage(m.requestProsecutorOnlySession))
      .font('Helvetica')
      .fontSize(baseFontSize)
      .text(existingCase.prosecutorOnlySessionRequest ?? '', {
        lineGap: 6,
        paragraphGap: 0,
      })
      .text(' ')
  }

  doc
    .font('Helvetica-Bold')
    .text(
      `${
        existingCase.prosecutor?.name ??
        formatMessage(m.prosecutor.noProsecutor)
      } ${existingCase.prosecutor?.title ?? ''}`,
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

  return pdf
}
