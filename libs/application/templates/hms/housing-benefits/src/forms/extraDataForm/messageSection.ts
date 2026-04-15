import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, FormatMessage } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import * as m from '../../lib/messages'
import {
  buildInstitutionMessageMarkdown,
  buildRequestedDocumentsMarkdown,
} from './shared'

export const extraDataMessageSection = buildSection({
  id: 'extraDataMessageSection',
  title: m.extraDataMessages.messageScreenTitle,
  children: [
    buildMultiField({
      id: 'extraDataMessageMultiField',
      title: m.extraDataMessages.messageScreenTitle,
      description: m.extraDataMessages.intro,
      children: [
        buildDescriptionField({
          id: 'extraDataInstitutionMessage',
          title: m.extraDataMessages.messageFromInstitutionTitle,
          titleVariant: 'h4',
          marginBottom: 4,
          description: (
            application: Application,
            _locale: Locale,
            formatMessage?: FormatMessage,
          ) => {
            if (!formatMessage) {
              return ''
            }
            return buildInstitutionMessageMarkdown(application)
          },
        }),
        buildDescriptionField({
          id: 'extraDataRequestedDocuments',
          title: m.extraDataMessages.requestedDocumentsTitle,
          titleVariant: 'h4',
          description: (
            application: Application,
            _locale: Locale,
            formatMessage?: FormatMessage,
          ) => {
            if (!formatMessage) {
              return ''
            }
            return buildRequestedDocumentsMarkdown(application, formatMessage)
          },
        }),
      ],
    }),
  ],
})
