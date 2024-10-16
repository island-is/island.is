import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  getWordByGender,
  Word,
} from '@island.is/judicial-system/formatters'
import { SubpoenaType } from '@island.is/judicial-system/types'

import { nowFactory } from '../factories/date.factory'
import { serviceCertificate as strings } from '../messages'
import { Case } from '../modules/case'
import { Defendant } from '../modules/defendant'
import { Subpoena } from '../modules/subpoena'
import {
  addConfirmation,
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addMediumCenteredText,
  addMediumText,
  addNormalCenteredText,
  addNormalRightAlignedText,
  addNormalText,
  Confirmation,
  setTitle,
} from './pdfHelpers'

const getSubpoenaType = (subpoenaType?: SubpoenaType): string => {
  switch (subpoenaType) {
    case SubpoenaType.ABSENCE:
      return 'Útivistarfyrirkall'
    case SubpoenaType.ARREST:
      return 'Handtökufyrirkall'
    default:
      // Should never happen
      return 'Ekki skráð'
  }
}

export const createServiceCertificate = (
  theCase: Case,
  defendant: Defendant,
  formatMessage: FormatMessage,
  subpoena?: Subpoena,
  arraignmentDate?: Date,
  location?: string,
  subpoenaType?: SubpoenaType,
  confirmation?: Confirmation,
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

  const sinc: Buffer[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))

  if (confirmation) {
    addEmptyLines(doc, 5)
  }

  arraignmentDate = arraignmentDate ?? subpoena?.arraignmentDate
  location = location ?? subpoena?.location
  subpoenaType = subpoenaType ?? defendant.subpoenaType

  addHugeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addMediumCenteredText(
    doc,
    `Mál nr. ${theCase.courtCaseNumber || ''}`,
    'Times-Bold',
  )
  addNormalCenteredText(doc, theCase.court?.name || '', 'Times-Bold')

  addEmptyLines(doc, 2)

  addMediumCenteredText(
    doc,
    `Birting tókst ${
      subpoena?.serviceDate ? formatDate(subpoena?.serviceDate, 'PPp') : ''
    }`,
    'Times-Bold',
  )

  addEmptyLines(doc)

  if (subpoena?.servedBy) {
    addNormalText(doc, 'Birtingaraðili: ', 'Times-Bold', true)
    addNormalText(doc, subpoena.servedBy, 'Times-Roman')
  }

  if (subpoena?.comment) {
    addNormalText(doc, 'Athugasemd: ', 'Times-Bold', true)
    addNormalText(doc, subpoena.comment, 'Times-Roman')
  }

  addEmptyLines(doc, 2)

  addNormalText(
    doc,
    `${capitalize(getWordByGender(Word.AKAERDI, defendant.gender))}: `,
    'Times-Bold',
    true,
  )
  addNormalText(
    doc,
    defendant.name && defendant.nationalId && defendant.address
      ? `${defendant.name}, ${formatDOB(
          defendant.nationalId,
          defendant.noNationalId,
        )}, ${defendant.address}`
      : 'Ekki skráður',
    'Times-Roman',
  )

  addEmptyLines(doc, 2)

  addNormalText(doc, 'Ákærandi: ', 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor?.institution
      ? theCase.prosecutor.institution.name
      : 'Ekki skráður',
    'Times-Roman',
  )

  addNormalText(doc, 'Dómari: ', 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.judge ? theCase.judge.name : 'Ekki skráður',
    'Times-Roman',
  )

  addEmptyLines(doc)

  addNormalText(doc, 'Þingfesting: ', 'Times-Bold', true)
  addNormalText(
    doc,
    formatDate(arraignmentDate ? new Date(arraignmentDate) : null, 'Pp') ||
      'Ekki skráð',
    'Times-Roman',
  )

  addNormalText(doc, 'Staður: ', 'Times-Bold', true)
  addNormalText(doc, location || 'Ekki skáður', 'Times-Roman')

  addNormalText(doc, 'Tegund fyrirkalls: ', 'Times-Bold', true)
  addNormalText(doc, getSubpoenaType(defendant.subpoenaType), 'Times-Roman')

  addFooter(doc)

  if (confirmation) {
    addConfirmation(doc, confirmation)
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
