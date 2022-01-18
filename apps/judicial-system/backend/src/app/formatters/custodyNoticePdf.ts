import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  capitalize,
  formatCustodyRestrictions,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { FormatMessage } from '@island.is/cms-translations'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import {
  baseFontSize,
  hugeFontSize,
  largeFontSize,
  mediumFontSize,
  setPageNumbers,
} from './pdfHelpers'
import { writeFile } from './writeFile'
import { core, custodyNotice } from '../messages'
import { Gender } from '@island.is/judicial-system/types'

function constructCustodyNoticePdf(
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
      `Málsnúmer ${theCase.court?.name?.replace('dómur', 'dóms') ?? '?'} ${
        theCase.courtCaseNumber
      }`,
      { align: 'center' },
    )
    .text(`LÖKE málsnúmer ${theCase.policeCaseNumber}`, {
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
      theCase.defendants &&
        theCase.defendants.length > 0 &&
        theCase.defendants[0].name
        ? theCase.defendants[0].name
        : 'Nafn ekki skráð',
    )
    .font('Helvetica')
    .text(
      `kt. ${formatNationalId(
        theCase.defendants &&
          theCase.defendants.length > 0 &&
          theCase.defendants[0].nationalId
          ? theCase.defendants[0].nationalId
          : 'Kennitala ekki skráð',
      )}`,
    )
    .text(
      theCase.defendants &&
        theCase.defendants.length > 0 &&
        theCase.defendants[0].address
        ? theCase.defendants[0].address
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
      `${theCase.court?.name}, ${formatDate(theCase.courtStartDate, 'PPP')}`,
    )
    .text(' ')
    .text(
      `Úrskurður kveðinn upp ${
        formatDate(theCase.rulingDate, 'PPPp')?.replace(' kl.', ', kl.') ?? '?'
      }`,
    )
    .text(
      `Úrskurður rennur út ${
        formatDate(theCase.validToDate, 'PPPp')?.replace(' kl.', ', kl.') ?? '?'
      }`,
    )
    .text(' ')
    .font('Helvetica-Bold')
    .text('Stjórnandi rannsóknar: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(theCase.leadInvestigator ?? 'Ekki skráður')
    .font('Helvetica-Bold')
    .text('Ákærandi: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(
      theCase.prosecutor
        ? `${theCase.prosecutor.name} ${theCase.prosecutor.title}`
        : 'Ekki skráður',
    )
    .font('Helvetica-Bold')
    .text('Verjandi: ', {
      continued: true,
    })
    .font('Helvetica')
    .text(
      theCase.defenderName && !theCase.defenderIsSpokesperson
        ? `${theCase.defenderName}${
            theCase.defenderPhoneNumber
              ? `, s. ${theCase.defenderPhoneNumber}`
              : ''
          }${theCase.defenderEmail ? `, ${theCase.defenderEmail}` : ''}`
        : 'Ekki skráður',
    )

  const custodyRestrictions = formatCustodyRestrictions(
    theCase.requestedCustodyRestrictions,
    theCase.isCustodyIsolation,
  )

  if (theCase.isCustodyIsolation || custodyRestrictions) {
    doc
      .text(' ')
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(mediumFontSize)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(baseFontSize)
    if (theCase.isCustodyIsolation && theCase.defendants) {
      const genderedAccused = formatMessage(core.accused, {
        suffix: theCase.defendants[0].gender === Gender.MALE ? 'i' : 'a',
      })
      const isolationPeriod = formatDate(theCase.isolationToDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')

      doc.text(
        capitalize(
          formatMessage(custodyNotice.isolationDisclaimer, {
            genderedAccused,
            isolationPeriod,
          }),
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
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructCustodyNoticePdf(existingCase, formatMessage)

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
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructCustodyNoticePdf(existingCase, formatMessage)

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
