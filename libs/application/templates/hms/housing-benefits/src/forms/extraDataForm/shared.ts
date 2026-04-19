import { getValueViaPath } from '@island.is/application/core'
import { Application, FormatMessage } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { institutionRequestedDocumentTypes } from '../../lib/dataSchema'

const requestedDocumentMessage = {
  exemptionReason: m.extraDataMessages.documentExemptionReason,
  custodyAgreement: m.extraDataMessages.documentCustodyAgreement,
  changedCircumstances: m.extraDataMessages.documentChangedCircumstances,
} as const

const isRequestedDocType = (
  value: string,
): value is keyof typeof requestedDocumentMessage =>
  (institutionRequestedDocumentTypes as readonly string[]).includes(value)

export const buildInstitutionMessageMarkdown = (application: Application) => {
  const message = getValueViaPath<string>(
    application.answers,
    'institutionMessageToApplicant',
  )?.trim()

  if (!message) {
    return ''
  }

  return message
}

export const buildRequestedDocumentsMarkdown = (
  application: Application,
  formatMessage: FormatMessage,
) => {
  const rawDocs = getValueViaPath<string[]>(
    application.answers,
    'institutionRequestedDocuments',
  )

  const docLines =
    rawDocs
      ?.filter(isRequestedDocType)
      .map((d) => `- ${formatMessage(requestedDocumentMessage[d])}`)
      .join('\n') ?? ''

  if (!docLines) {
    return ''
  }

  return docLines
}
