import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  capitalize,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { FormatMessage } from '@island.is/cms-translations'
import { Gender, SessionArrangements } from '@island.is/judicial-system/types'

import { environment } from '../../environments'
import { Case } from '../modules/case'
import { core, custodyNotice } from '../messages'
import { formatCustodyRestrictions } from './formatters'
import {
  addEmptyLines,
  addHugeHeading,
  addLargeHeading,
  addMediumText,
  addNormalText,
  setLineGap,
  addFooter,
  setTitle,
} from './pdfHelpers'
import { writeFile } from './writeFile'

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

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

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
  addLargeHeading(doc, `LÖKE málsnúmer ${theCase.policeCaseNumber}`)
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

  if (
    theCase.defendants &&
    theCase.defendants.length > 0 &&
    theCase.defendants[0].noNationalId
  ) {
    if (theCase.defendants[0].nationalId) {
      addNormalText(doc, `fd. ${theCase.defendants[0].nationalId}`, 'Helvetica')
    }
  } else {
    addNormalText(
      doc,
      `kt. ${formatNationalId(
        theCase.defendants &&
          theCase.defendants.length > 0 &&
          theCase.defendants[0].nationalId
          ? theCase.defendants[0].nationalId
          : 'ekki skráð',
      )}`,
      'Helvetica',
    )
  }

  addNormalText(
    doc,
    theCase.defendants &&
      theCase.defendants.length > 0 &&
      theCase.defendants[0].address
      ? theCase.defendants[0].address
      : 'Heimili ekki skráð',
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
      ? `${theCase.prosecutor.name} ${theCase.prosecutor.title}`
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
      const genderedAccused = formatMessage(core.accused, {
        suffix:
          !theCase.defendants ||
          theCase.defendants.length < 1 ||
          theCase.defendants[0].gender === Gender.MALE
            ? 'i'
            : 'a',
      })
      const isolationPeriod = formatDate(theCase.isolationToDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')

      addNormalText(
        doc,
        capitalize(
          formatMessage(custodyNotice.isolationDisclaimer, {
            genderedAccused,
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

  return stream
}

export async function getCustodyNoticePdfAsString(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<string> {
  const stream = constructCustodyNoticePdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-custody-notice.pdf`, pdf)
  }

  return pdf
}

export async function getCustodyNoticePdfAsBuffer(
  theCase: Case,
  formatMessage: FormatMessage,
): Promise<Buffer> {
  const stream = constructCustodyNoticePdf(theCase, formatMessage)

  // wait for the writing to finish
  const pdf = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })

  if (!environment.production) {
    writeFile(`${theCase.id}-custody-notice.pdf`, pdf)
  }

  return pdf
}
