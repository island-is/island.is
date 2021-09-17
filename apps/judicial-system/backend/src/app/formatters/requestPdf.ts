import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { CaseType } from '@island.is/judicial-system/types'
import {
  caseTypes,
  formatRequestedCustodyRestrictions,
  formatNationalId,
  capitalize,
  formatDate,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatCustodyProvisions } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'
import { FormatMessage } from '@island.is/cms-translations'
import { restrictionRequest as m } from '../messages/requestPdf'

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
      existingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann',
  })

  if (doc.info) {
    doc.info['Title'] = title
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text(title, { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(
      existingCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(16)
    .text(
      `${formatDate(existingCase.created, 'PPP')} - Mál nr. ${
        existingCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court?.name}`, { align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(12)
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
    .fontSize(14)
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.demands ?? 'Dómkröfur ekki skráðar', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem brot varða við')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.lawsBroken ?? 'Lagaákvæði ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem krafan er byggð á')
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatCustodyProvisions(
        existingCase.custodyProvisions,
        existingCase.legalBasis,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(
      `Takmarkanir og tilhögun ${
        existingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
      }`,
      {},
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      `${formatRequestedCustodyRestrictions(
        existingCase.type,
        existingCase.requestedCustodyRestrictions,
        existingCase.requestedOtherRestrictions,
      )}`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.heading))
    .fontSize(14)
    .text(formatMessage(m.factsAndArguments.facts))
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.caseFacts ?? 'Málsatvik ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(formatMessage(m.factsAndArguments.arguments))
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalArguments ?? 'Lagarök ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.prosecutor?.name ?? 'Saksóknari ekki skráður'} ${
        existingCase.prosecutor?.title ?? ''
      }`,
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

  if (doc.info) {
    doc.info['Title'] = 'Krafa um rannsóknarheimild'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Krafa um rannsóknarheimild', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(
      existingCase.prosecutor?.institution?.name ?? formatMessage(m.noDistrict),
      { align: 'center' },
    )
    .fontSize(16)
    .text(
      `${formatDate(existingCase.created, 'PPP')} - Mál nr. ${
        existingCase.policeCaseNumber
      }`,
      { align: 'center' },
    )
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court?.name}`, { align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(`Kennitala: ${formatNationalId(existingCase.accusedNationalId)}`)
    .text(`Fullt nafn: ${existingCase.accusedName}`)
    .text(`Lögheimili: ${existingCase.accusedAddress}`)
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
    .fontSize(14)
    .lineGap(8)
    .text('Efni kröfu')
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(capitalize(caseTypes[existingCase.type]))
    .text(existingCase.description ?? 'Efni kröfu ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.demands ?? 'Dómkröfur ekki skráðar', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem brot varða við')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.lawsBroken ?? 'Lagaákvæði ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagaákvæði sem krafan er byggð á')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalBasis ?? 'Lagaákvæði ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text('Greinargerð um málsatvik og lagarök')
    .fontSize(14)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.caseFacts ?? 'Málsatvik ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagarök')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalArguments ?? 'Lagarök ekki skráð', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')

  if (existingCase.requestProsecutorOnlySession) {
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Beiðni um dómþing að varnaraðila fjarstöddum')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.prosecutorOnlySessionRequest ?? '', {
        lineGap: 6,
        paragraphGap: 0,
      })
      .text(' ')
  }

  doc
    .font('Helvetica-Bold')
    .text(
      `${existingCase.prosecutor?.name ?? 'Saksóknari ekki skráður'} ${
        existingCase.prosecutor?.title ?? ''
      }`,
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructRequestPdf(
  existingCase: Case,
  formatMessage: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return existingCase.type === CaseType.CUSTODY ||
    existingCase.type === CaseType.TRAVEL_BAN
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
