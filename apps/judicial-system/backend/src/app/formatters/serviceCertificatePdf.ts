import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  capitalize,
  formatDate,
  formatDOB,
  formatNationalId,
  getWordByGender,
  Word,
} from '@island.is/judicial-system/formatters'
import {
  DefenderChoice,
  ServiceStatus,
  SubpoenaType,
  UserRole,
} from '@island.is/judicial-system/types'

import { serviceCertificate as strings } from '../messages'
import { Case, Defendant, Subpoena } from '../modules/repository'
import {
  addEmptyLines,
  addLargeHeading,
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

const getRole = (userRole?: UserRole) => {
  switch (userRole) {
    case UserRole.DISTRICT_COURT_ASSISTANT: {
      return 'Aðstoðarmaður dómara'
    }
    default: {
      return 'Dómari'
    }
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
      top: 80,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  const sinc: Buffer[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))

  addLargeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addMediumCenteredText(
    doc,
    `Mál nr. ${theCase.courtCaseNumber || ''}`,
    'Times-Bold',
  )
  addNormalCenteredText(doc, theCase.court?.name || '', 'Times-Bold')

  addEmptyLines(doc, 3)

  addMediumCenteredText(
    doc,
    `Birting tókst ${
      subpoena.serviceDate ? formatDate(subpoena.serviceDate, 'PPPp') : ''
    }`,
    'Times-Bold',
  )

  addEmptyLines(doc, 2)

  addNormalText(doc, 'Birtingaraðili: ', 'Times-Bold', true)
  addNormalText(
    doc,
    subpoena.serviceStatus === ServiceStatus.ELECTRONICALLY
      ? 'Rafrænt pósthólf island.is'
      : subpoena.servedBy || '',
    'Times-Roman',
  )

  addEmptyLines(doc)

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

  addEmptyLines(doc, 3)

  const defendantText = capitalize(
    getWordByGender(Word.AKAERDI, defendant.gender),
  )
  const defendantLabel = `${defendantText}: `

  addNormalText(doc, defendantLabel, 'Times-Bold', true)
  addNormalText(
    doc,
    defendant.name && defendant.nationalId
      ? `${defendant.name}, ${formatDOB(
          defendant.nationalId,
          defendant.noNationalId,
        )}`
      : 'Ekki skráður',
    'Times-Roman',
  )

  // Consider adding indentation to helper functions
  doc.text(
    ` ${defendant.address ?? 'Ekki skráð'}`,
    50 + doc.widthOfString(defendantLabel),
    doc.y + 5,
  )
  doc.text('', 50)

  addEmptyLines(doc, 3)

  addNormalText(doc, 'Ákærandi: ', 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.prosecutor?.institution
      ? theCase.prosecutor.institution.name
      : 'Ekki skráður',
    'Times-Roman',
  )

  addEmptyLines(doc)

  addNormalText(doc, `${getRole(theCase.judge?.role)}: `, 'Times-Bold', true)
  addNormalText(
    doc,
    theCase.judge ? theCase.judge.name : 'Ekki skráður',
    'Times-Roman',
  )

  addEmptyLines(doc, 3)

  addNormalText(doc, 'Þingfesting: ', 'Times-Bold', true)
  addNormalText(
    doc,
    formatDate(
      subpoena.arraignmentDate ? new Date(subpoena.arraignmentDate) : null,
      'Pp',
    ) || 'Ekki skráð',
    'Times-Roman',
  )

  addEmptyLines(doc)

  addNormalText(doc, 'Staður: ', 'Times-Bold', true)
  addNormalText(
    doc,
    `Dómsalur ${subpoena.location}` || 'ekki skráður',
    'Times-Roman',
  )

  addEmptyLines(doc)

  addNormalText(doc, 'Tegund fyrirkalls: ', 'Times-Bold', true)
  addNormalText(doc, getSubpoenaType(subpoena.type), 'Times-Roman')

  addEmptyLines(doc, 3)

  let defenderChoiceText = ''

  switch (defendant.requestedDefenderChoice) {
    case DefenderChoice.CHOOSE:
      defenderChoiceText =
        'Ég óska þess að valinn lögmaður verði skipaður verjandi minn.'
      break
    case DefenderChoice.WAIVE:
      defenderChoiceText = 'Ég óska ekki eftir verjanda.'
      break
    case DefenderChoice.DELEGATE:
      defenderChoiceText =
        'Ég fel dómara málsins að tilnefna og skipa mér verjanda.'
      break
    case DefenderChoice.DELAY:
    default:
      defenderChoiceText =
        'Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda.'
  }

  addNormalText(doc, 'Afstaða til verjanda: ', 'Times-Bold', true)
  addNormalText(doc, defenderChoiceText, 'Times-Roman')

  if (defendant.requestedDefenderChoice === DefenderChoice.CHOOSE) {
    addEmptyLines(doc)

    addNormalText(
      doc,
      defendant.requestedDefenderName && defendant.requestedDefenderNationalId
        ? `${defendant.requestedDefenderName}, kt. ${formatNationalId(
            defendant.requestedDefenderNationalId,
          )}`
        : 'Ekki skráður',
      'Times-Roman',
    )
  }

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
