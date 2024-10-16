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

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', defendant.name)

  arraignmentDate = arraignmentDate ?? subpoena?.arraignmentDate
  location = location ?? subpoena?.location
  subpoenaType = subpoenaType ?? defendant.subpoenaType

  addHugeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addMediumCenteredText(doc, `Mál nr. ${theCase.courtCaseNumber}`, 'Times-Bold')
  addNormalCenteredText(doc, theCase.court?.name || '', 'Times-Bold')

  addEmptyLines(doc, 2)

  addMediumCenteredText(
    doc,
    `Birting tókst ${formatDate(subpoena?.serviceDate, 'PPp')}`,
    'Times-Bold',
  )

  addEmptyLines(doc)

  if (subpoena?.servedBy) {
    addNormalText(doc, 'Birtingaraðili: ', 'Times-Bold', true)
    addNormalText(doc, subpoena?.servedBy, 'Times-Roman')
  }

  if (subpoena?.comment) {
    addNormalText(doc, 'Athugasemd: ', 'Times-Bold', true)
    addNormalText(doc, subpoena?.comment, 'Times-Roman')
  }

  addEmptyLines(doc, 2)

  console.log(defendant, subpoena)
  addNormalText(
    doc,
    `${capitalize(getWordByGender(Word.AKAERDI, defendant?.gender))}: `,
    'Times-Bold',
    true,
  )
  addNormalText(
    doc,
    `${subpoena?.defendant?.name}, ${formatDOB(
      subpoena?.defendant?.nationalId,
      subpoena?.defendant?.noNationalId,
    )}, ${subpoena?.defendant?.address}`,
    'Times-Bold',
    true,
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

  if (arraignmentDate) {
    addNormalText(doc, 'Þingfesting: ', 'Times-Bold', true)
    addNormalText(
      doc,
      formatDate(new Date(arraignmentDate), 'PPPp') || '',
      'Times-Roman',
    )
  }

  if (location) {
    addNormalText(
      doc,
      formatMessage(strings.courtRoom, {
        courtRoom: location,
      }),
      'Times-Roman',
    )
  }

  if (subpoena?.defendant?.subpoenaType) {
    addNormalText(doc, 'Tegund fyrirkalls: ', 'Times-Bold', true)
    addNormalText(
      doc,
      subpoena?.defendant?.subpoenaType === SubpoenaType.ABSENCE
        ? 'Útivistarfyrirkall'
        : 'Handtökufyrirkall',
      'Times-Roman',
    )
  }

  addFooter(doc)

  if (confirmation) {
    addConfirmation(doc, confirmation)
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
