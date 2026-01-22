import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  formatGender,
  lowercase,
} from '@island.is/judicial-system/formatters'
import { SessionArrangements } from '@island.is/judicial-system/types'

import { custodyNotice } from '../messages'
import { Case } from '../modules/repository'
import { formatCustodyRestrictions } from './formatters'
import {
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addLargeHeading,
  addMediumText,
  addNormalText,
  setLineGap,
  setTitle,
} from './pdfHelpers'

const constructCustodyNoticePdf = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, 'Vistunarseðill')
  setLineGap(doc, 8)
  addHugeHeading(doc, 'Vistunarseðill', 'Helvetica-Bold')
  addLargeHeading(
    doc,
    formatMessage(custodyNotice.rulingTitle, { caseType: theCase.type }),
  )
  addLargeHeading(
    doc,
    `Málsnúmer ${theCase.court?.name?.replace('dómur', 'dóms') ?? '?'} ${
      theCase.courtCaseNumber
    }`,
    'Helvetica',
  )
  addEmptyLines(doc)
  setLineGap(doc, 8)
  addMediumText(doc, 'Sakborningur', 'Helvetica-Bold')
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].name
      ? theCase.defendants[0].name
      : 'Nafn ekki skráð',
  )

  if (theCase.defendants && theCase.defendants.length > 0) {
    addNormalText(
      doc,
      formatDOB(
        theCase.defendants[0].nationalId,
        theCase.defendants[0].noNationalId,
      ),
      'Helvetica',
    )
  }

  addNormalText(doc, 'Lögheimili/dvalarstaður: ', 'Helvetica', true)
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].address
      ? theCase.defendants[0].address
      : 'Ekki skráð',
  )
  addNormalText(doc, 'Kyn: ', 'Helvetica', true)
  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].gender
      ? formatGender(theCase.defendants[0].gender)
      : 'Ekki skráð',
  )

  addEmptyLines(doc, 2)
  setLineGap(doc, 8)
  addMediumText(
    doc,
    formatMessage(custodyNotice.rulingTitle, { caseType: theCase.type }),
    'Helvetica-Bold',
  )
  addNormalText(
    doc,
    `${theCase.court?.name}, ${formatDate(theCase.courtStartDate, 'PPP')}`,
    'Helvetica',
  )
  addEmptyLines(doc)
  addNormalText(
    doc,
    `Úrskurður kveðinn upp ${
      formatDate(theCase.rulingDate, 'PPPp')?.replace(' kl.', ', kl.') ?? '?'
    }`,
  )
  addNormalText(
    doc,
    `Úrskurður rennur út ${
      formatDate(theCase.validToDate, 'PPPp')?.replace(' kl.', ', kl.') ?? '?'
    }`,
  )
  addEmptyLines(doc)
  addNormalText(doc, 'Stjórnandi rannsóknar: ', 'Helvetica-Bold', true)
  addNormalText(doc, theCase.leadInvestigator ?? 'Ekki skráður', 'Helvetica')
  addNormalText(doc, 'Ákærandi: ', 'Helvetica-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor
      ? `${theCase.prosecutor.name} ${lowercase(theCase.prosecutor.title)}`
      : 'Ekki skráður',
    'Helvetica',
  )
  addNormalText(doc, 'Verjandi: ', 'Helvetica-Bold', true)
  addNormalText(
    doc,
    theCase.defenderName &&
      theCase.sessionArrangements !==
        SessionArrangements.ALL_PRESENT_SPOKESPERSON
      ? `${theCase.defenderName}${
          theCase.defenderPhoneNumber
            ? `, s. ${theCase.defenderPhoneNumber}`
            : ''
        }${theCase.defenderEmail ? `, ${theCase.defenderEmail}` : ''}`
      : 'Ekki skráður',
    'Helvetica',
  )

  const custodyRestrictions = formatCustodyRestrictions(
    formatMessage,
    theCase.type,
    theCase.requestedCustodyRestrictions,
    theCase.isCustodyIsolation,
  )

  if (theCase.isCustodyIsolation || custodyRestrictions) {
    addEmptyLines(doc, 2)
    setLineGap(doc, 8)
    addMediumText(
      doc,
      formatMessage(custodyNotice.arrangement, { caseType: theCase.type }),
      'Helvetica-Bold',
    )

    if (theCase.isCustodyIsolation) {
      const isolationPeriod = formatDate(theCase.isolationToDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')

      addNormalText(
        doc,
        capitalize(
          formatMessage(custodyNotice.isolationDisclaimer, {
            isolationPeriod,
          }),
        ),
        'Helvetica',
      )
    }

    if (custodyRestrictions) {
      addNormalText(doc, custodyRestrictions, 'Helvetica')
    }
  }

  addFooter(doc)

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}

export const getCustodyNoticePdfAsString = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> => {
  return constructCustodyNoticePdf(theCase, formatMessage).then((buffer) =>
    buffer.toString('binary'),
  )
}

export const getCustodyNoticePdfAsBuffer = (
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> => {
  return constructCustodyNoticePdf(theCase, formatMessage)
}
