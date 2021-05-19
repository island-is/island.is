import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  CaseCustodyRestrictions,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  formatRequestedCustodyRestrictions,
  formatGender,
  formatNationalId,
  formatProsecutorDemands,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatCustodyProvisions } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'

function constructRequestPdf(existingCase: Case) {
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
    doc.info['Title'] = `Krafa um ${
      existingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
    }`
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text(
      `Krafa um ${
        existingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      }`,
      { align: 'center' },
    )
    .font('Helvetica')
    .fontSize(18)
    .text(`LÖKE málsnúmer: ${existingCase.policeCaseNumber}`, {
      align: 'center',
    })
    .fontSize(16)
    .text(
      `Embætti: ${existingCase.prosecutor?.institution?.name || 'Ekki skráð'}`,
      {
        align: 'center',
      },
    )
    .lineGap(40)
    .text(`Dómstóll: ${existingCase.court}`, { align: 'center' })
    .font('Helvetica-Bold')
    .fontSize(18)
    .lineGap(8)
    .text('Grunnupplýsingar')
    .font('Helvetica')
    .fontSize(12)
    .lineGap(4)
    .text(`Kennitala: ${formatNationalId(existingCase.accusedNationalId)}`)
    .text(`Fullt nafn: ${existingCase.accusedName}`)
    .text(`Kyn: ${formatGender(existingCase.accusedGender)}`)
    .text(`Lögheimili: ${existingCase.accusedAddress}`)
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
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómkröfur')
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatProsecutorDemands(
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )

  if (existingCase.otherDemands) {
    doc.text(' ').text(existingCase.otherDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
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
    .font('Helvetica-Bold')
    .text(
      `${existingCase.prosecutor?.name || ''} ${
        existingCase.prosecutor?.title || ''
      }`,
    )

  setPageNumbers(doc)

  doc.end()
  return stream
}

export async function getRequestPdfAsString(
  existingCase: Case,
): Promise<string> {
  const stream = constructRequestPdf(existingCase)

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
