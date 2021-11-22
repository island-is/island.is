import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  formatCustodyRestrictions,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'

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

export async function getCustodyNoticePdfAsString(
  existingCase: Case,
): Promise<string> {
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
    .text(existingCase.accusedName ?? 'Nafn ekki skráð')
    .font('Helvetica')
    .text(`kt. ${formatNationalId(existingCase.accusedNationalId)}`)
    .text(existingCase.accusedAddress ?? 'Heimili ekki skráð')
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
    existingCase.accusedGender,
    existingCase.custodyRestrictions,
  )

  if (
    existingCase.custodyRestrictions?.includes(
      CaseCustodyRestrictions.ISOLATION,
    ) ||
    custodyRestrictions
  ) {
    doc
      .text(' ')
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(mediumFontSize)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(baseFontSize)
    if (
      existingCase.custodyRestrictions?.includes(
        CaseCustodyRestrictions.ISOLATION,
      )
    ) {
      doc.text(
        formatCustodyIsolation(
          existingCase.accusedGender,
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
