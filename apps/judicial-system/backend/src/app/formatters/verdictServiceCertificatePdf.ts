import PDFDocument from 'pdfkit'

import { FormatMessage } from '@island.is/cms-translations'

import {
  formatDate,
  formatDOB,
  getVerdictAppealDecision,
} from '@island.is/judicial-system/formatters'
import { hasTimestamp } from '@island.is/judicial-system/types'
import {
  UserRole,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { serviceCertificate as strings } from '../messages'
import { Case, Defendant, Verdict } from '../modules/repository'
import {
  addEmptyLines,
  addLargeHeading,
  addMediumCenteredText,
  addNormalCenteredText,
  addNormalText,
  setTitle,
} from './pdfHelpers'

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

export const createVerdictServiceCertificate = ({
  theCase,
  defendant,
  verdict,
  deliveredToDefenderName,
  formatMessage,
}: {
  theCase: Case
  defendant: Defendant
  verdict: Verdict
  deliveredToDefenderName?: string
  formatMessage: FormatMessage
}): Promise<Buffer> => {
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

  const sinc: Uint8Array[] = []

  doc.on('data', (chunk) => sinc.push(chunk))

  setTitle(doc, formatMessage(strings.title))

  addLargeHeading(doc, formatMessage(strings.title).toUpperCase(), 'Times-Bold')
  addMediumCenteredText(
    doc,
    `Dómur í máli nr. ${theCase.courtCaseNumber || ''}`,
    'Times-Bold',
  )
  addNormalCenteredText(doc, theCase.court?.name || '', 'Times-Bold')

  addEmptyLines(doc, 3)

  if (verdict.serviceDate) {
    const format = hasTimestamp(verdict.serviceDate) ? 'PPPp' : 'PPP'
    addMediumCenteredText(
      doc,
      `Birting tókst ${formatDate(verdict.serviceDate, format)}`,
      'Times-Bold',
    )
  }

  addEmptyLines(doc, 2)

  addNormalText(
    doc,
    `${
      verdict.serviceStatus === VerdictServiceStatus.LEGAL_PAPER ||
      verdict.serviceStatus === VerdictServiceStatus.ELECTRONICALLY
        ? 'Birtingarleið'
        : 'Birtingaraðili'
    }: `,
    'Times-Bold',
    true,
  )
  addNormalText(
    doc,
    verdict.serviceStatus === VerdictServiceStatus.ELECTRONICALLY
      ? 'Rafrænt pósthólf island.is'
      : verdict.serviceStatus === VerdictServiceStatus.LEGAL_PAPER
      ? 'Lögbirtingur'
      : verdict.servedBy || 'Ekki skráð',
    'Times-Roman',
  )

  addEmptyLines(doc)

  if (verdict.serviceStatus !== VerdictServiceStatus.ELECTRONICALLY) {
    addNormalText(doc, 'Athugasemd: ', 'Times-Bold', true)
    addNormalText(
      doc,
      verdict.serviceStatus === VerdictServiceStatus.DEFENDER
        ? `Birt fyrir verjanda ${
            deliveredToDefenderName ? `- ${deliveredToDefenderName}` : ''
          }`
        : verdict.comment || 'Ekki skráð',
      'Times-Roman',
    )
  }

  addEmptyLines(doc, 3)

  const defendantLabel = 'Dómþoli: '

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

  if (verdict.isDefaultJudgement) {
    addNormalText(
      doc,
      'Dómur ásamt leiðbeiningum um rétt til endurupptöku málsins hefur verið birt fyrir dómfellda.',
      'Times-Bold',
      true,
    )
  } else {
    addNormalText(
      doc,
      'Dómur ásamt leiðbeiningum um áfrýjun og áfrýjunarfrest hefur verið birt fyrir dómfellda.',
      'Times-Bold',
      true,
    )
  }

  addEmptyLines(doc)
  addEmptyLines(doc)

  addNormalText(doc, 'Ákvörðun dómþola: ', 'Times-Bold', true)
  addNormalText(
    doc,
    `${getVerdictAppealDecision(verdict.appealDecision)} ${
      verdict.appealDate ? formatDate(verdict.appealDate, 'PPPp') : ''
    }`,
    'Times-Roman',
  )

  doc.end()

  return new Promise<Buffer>((resolve) =>
    doc.on('end', () => resolve(Buffer.concat(sinc))),
  )
}
