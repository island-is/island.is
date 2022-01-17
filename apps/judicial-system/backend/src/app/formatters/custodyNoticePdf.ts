import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  formatCustodyRestrictions,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatCustodyIsolation } from './formatters'
import {
  baseFontSize,
  hugeFontSize,
  largeFontSize,
  mediumFontSize,
  setPageNumbers,
} from './pdfHelpers'
import { writeFile } from './writeFile'

function constructCustodyNoticePdf(
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
    doc.info['Title'] = 'Vistunarseðill'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  doc
    .font('Helvetica-Bold')
    .fontSize(hugeFontSize)
    .lineGap(8)
    .text('Vistunarseðill', { align: 'center' })
    .fontSize(largeFontSize)
    .text('Úrskurður um gæsluvarðhald', { align: 'center' })
    .font('Helvetica')
    .text(
      `Málsnúmer ${existingCase.court?.name?.replace('dómur', 'dóms') ?? '?'} ${
        existingCase.courtCaseNumber
      }`,
      { align: 'center' },
    )
    .text(`LÖKE málsnúmer ${existingCase.policeCaseNumber}`, {
      align: 'center',
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text('Sakborningur')
    .fontSize(baseFontSize)
    // Assume there is at most one defendant
    .text(
      existingCase.defendants &&
        existingCase.defendants.length > 0 &&
        existingCase.defendants[0].name
        ? existingCase.defendants[0].name
        : 'Nafn ekki skráð',
    )
    .font('Helvetica')
    .text(
      `kt. ${formatNationalId(
        existingCase.defendants &&
          existingCase.defendants.length > 0 &&
          existingCase.defendants[0].nationalId
          ? existingCase.defendants[0].nationalId
          : 'Kennitala ekki skráð',
      )}`,
    )
    .text(
      existingCase.defendants &&
        existingCase.defendants.length > 0 &&
        existingCase.defendants[0].address
        ? existingCase.defendants[0].address
        : 'Heimili ekki skráð',
    )
    .text(' ')
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(mediumFontSize)
    .lineGap(8)
    .text('Úrskurður um gæsluvarðhald')
    .font('Helvetica')
    .fontSize(baseFontSize)
    .text(
      `${existingCase.court?.name}, ${formatDate(
        existingCase.courtStartDate,
        'PPP',
      )}`,
    )
    .text(' ')
    .text(
      `Úrskurður kveðinn upp ${
        formatDate(existingCase.rulingDate, 'PPPp')?.replace(' kl.', ', kl.') ??
        '?'
      }`,
    )
    .text(
      `Úrskurður rennur út ${
        formatDate(existingCase.validToDate, 'PPPp')?.replace(
          ' kl.',
          ', kl.',
        ) ?? '?'
      }`,
    )
    .text(' ')
    .font('Helvetica-Bold')
    .text('Stjórnandi rannsóknar: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(existingCase.leadInvestigator ?? 'Ekki skráður')
    .font('Helvetica-Bold')
    .text('Ákærandi: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(
      existingCase.prosecutor
        ? `${existingCase.prosecutor.name} ${existingCase.prosecutor.title}`
        : 'Ekki skráður',
    )
    .font('Helvetica-Bold')
    .text('Verjandi: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(
      existingCase.defenderName && !existingCase.defenderIsSpokesperson
        ? `${existingCase.defenderName}${
            existingCase.defenderPhoneNumber
              ? `, s. ${existingCase.defenderPhoneNumber}`
              : ''
          }${
            existingCase.defenderEmail ? `, ${existingCase.defenderEmail}` : ''
          }`
        : 'Ekki skráður',
    )

  const custodyRestrictions = formatCustodyRestrictions(
    existingCase.requestedCustodyRestrictions,
    existingCase.isCustodyIsolation,
  )

  if (existingCase.isCustodyIsolation || custodyRestrictions) {
    doc
      .text(' ')
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(mediumFontSize)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(baseFontSize)
    if (existingCase.isCustodyIsolation) {
      doc.text(
        formatCustodyIsolation(
          existingCase.defendants && existingCase.defendants.length > 0
            ? existingCase.defendants[0].gender
            : undefined,
          existingCase.isolationToDate,
        ),
      )
    }
    if (custodyRestrictions) {
      doc.text(custodyRestrictions, {
        lineGap: 6,
        paragraphGap: 0,
      })
    }
  }

  setPageNumbers(doc)

  doc.end()

  return stream
}

export async function getCustodyNoticePdfAsString(
  existingCase: Case,
): Promise<string> {
  const stream = constructCustodyNoticePdf(existingCase)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-custody-notice.pdf`, pdf)
  }

  return pdf
}

export async function getCustodyNoticePdfAsBuffer(
  existingCase: Case,
): Promise<Buffer> {
  const stream = constructCustodyNoticePdf(existingCase)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-custody-notice.pdf`, pdf)
  }

  return pdf
}
