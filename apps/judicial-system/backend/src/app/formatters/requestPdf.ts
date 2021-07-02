import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import { CaseType } from '@island.is/judicial-system/types'
import {
  caseTypes,
  formatRequestedCustodyRestrictions,
  formatGender,
  formatNationalId,
  capitalize,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatCustodyProvisions } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'
import { FormatMessage } from '@island.is/api/domains/translations'
import { restrictionRequest as m } from '../messages/requestPdf'

function constructRestrictionRequestPdf(
  existingCase: Case,
  formatMessage?: FormatMessage,
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
      formatMessage(m.caseNumber, {
        caseNumber: existingCase.policeCaseNumber,
      }),
      {
        align: 'center',
      },
    )
    .fontSize(16)
    .text(
      formatMessage(m.district, {
        district:
          existingCase.prosecutor?.institution?.name ??
          formatMessage(m.noDistrict),
      }),
      {
        align: 'center',
      },
    )
    .lineGap(40)
    .text(formatMessage(m.court, { court: existingCase.court?.name }), {
      align: 'center',
    })
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text(formatMessage(m.baseInfo.heading))
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(
      `${formatMessage(m.baseInfo.nationalId)} ${formatNationalId(
        existingCase.accused[0].nationalId,
      )}`,
    )
    .text(
      `${formatMessage(m.baseInfo.fullName)} ${existingCase.accused[0].name}`,
    )
    .text(
      `${formatMessage(m.baseInfo.gender)} ${formatGender(
        existingCase.accused[0].gender,
      )}`,
    )
    .text(
      `${formatMessage(m.baseInfo.address)} ${existingCase.accused[0].address}`,
    )
    .text(
      formatMessage(m.baseInfo.defender, {
        defenderName:
          existingCase.defenderName ?? formatMessage(m.baseInfo.noDefender),
      }),
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.demands, {
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
    .text(existingCase.lawsBroken, {
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
    .text(formatCustodyProvisions(existingCase.custodyProvisions), {
      lineGap: 6,
      paragraphGap: 0,
    })
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
    .text(existingCase.caseFacts, {
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
    .text(existingCase.legalArguments, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.prosecutor?.name ?? ''} ${
        existingCase.prosecutor?.title ?? ''
      }`,
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructInvestigationRequestPdf(
  existingCase: Case,
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
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`, {
      align: 'center',
    })
    .fontSize(16)
    .text(
      `Embætti: ${existingCase.prosecutor?.institution?.name ?? 'Ekki skráð'}`,
      {
        align: 'center',
      },
    )
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court?.name}`, { align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text('Grunnupplýsingar')
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(`Kennitala: ${formatNationalId(existingCase.accused[0].nationalId)}`)
    .text(`Fullt nafn: ${existingCase.accused[0].name}`)
    .text(`Kyn: ${formatGender(existingCase.accused[0].gender)}`)
    .text(`Lögheimili: ${existingCase.accused[0].address}`)
    .text(
      `Verjandi sakbornings: ${
        existingCase.defenderName
          ? existingCase.defenderName
          : 'Hefur ekki verið skráður'
      }`,
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
    .text(existingCase.description, {
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
    .text(existingCase.demands, {
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
    .text(existingCase.lawsBroken, {
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
    .text(existingCase.legalBasis, {
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
    .text(existingCase.caseFacts, {
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
    .text(existingCase.legalArguments, {
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
      `${existingCase.prosecutor?.name ?? ''} ${
        existingCase.prosecutor?.title ?? ''
      }`,
    )

  setPageNumbers(doc)

  doc.end()

  return stream
}

function constructRequestPdf(
  existingCase: Case,
  formatMessage?: FormatMessage,
): streamBuffers.WritableStreamBuffer {
  return existingCase.type === CaseType.CUSTODY ||
    existingCase.type === CaseType.TRAVEL_BAN
    ? constructRestrictionRequestPdf(existingCase, formatMessage)
    : constructInvestigationRequestPdf(existingCase)
}

export async function getRequestPdfAsString(
  existingCase: Case,
  formatMessage?: FormatMessage,
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
): Promise<Buffer> {
  const stream = constructRequestPdf(existingCase)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  return pdf
}
