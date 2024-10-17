import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  getWordByGender,
  Word,
} from '@island.is/judicial-system/formatters'
import { ServiceStatus, SubpoenaType } from '@island.is/judicial-system/types'

import { serviceCertificate as strings } from '../messages'
import { Case } from '../modules/case'
import { Defendant } from '../modules/defendant'
import { Subpoena } from '../modules/subpoena'
import {
  addEmptyLines,
  addFooter,
  addHugeHeading,
  addMediumCenteredText,
  addNormalCenteredText,
  addNormalText,
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
  subpoena: Subpoena,
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

  const sinc: Buffer[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))

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
      subpoena.serviceDate ? formatDate(subpoena.serviceDate, 'PPp') : ''
    }`,
    'Times-Bold',
  )

  addEmptyLines(doc)

  addNormalText(doc, 'Birtingaraðili: ', 'Times-Bold', true)
  addNormalText(
    doc,
    subpoena.serviceStatus === ServiceStatus.ELECTRONICALLY
      ? 'Rafrænt pósthólf island.is'
      : subpoena.servedBy || '',
    'Times-Roman',
  )

  if (subpoena.serviceStatus !== ServiceStatus.ELECTRONICALLY) {
    addNormalText(doc, 'Athugasemd: ', 'Times-Bold', true)
    addNormalText(
      doc,
      subpoena.serviceStatus === ServiceStatus.DEFENDER
        ? `Birt fyrir verjanda ${
            defendant.defenderName ? `- ${defendant.defenderName}` : ''
          }`
        : subpoena.comment || '',
      'Times-Roman',
    )
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
    formatDate(
      subpoena.arraignmentDate ? new Date(subpoena.arraignmentDate) : null,
      'Pp',
    ) || 'Ekki skráð',
    'Times-Roman',
  )

  addNormalText(doc, 'Staður: ', 'Times-Bold', true)
  addNormalText(doc, subpoena.location || 'Ekki skáður', 'Times-Roman')

  addNormalText(doc, 'Tegund fyrirkalls: ', 'Times-Bold', true)
  addNormalText(doc, getSubpoenaType(defendant.subpoenaType), 'Times-Roman')

  addFooter(doc)
  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
