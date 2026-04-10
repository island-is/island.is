import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, FormatMessage } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import * as m from '../../lib/messages'
import { buildExtraDataSummaryMarkdown } from './shared'

export const extraDataMessageSection = buildSection({
  id: 'extraDataMessageSection',
  title: m.extraDataMessages.messageScreenTitle,
  children: [
    buildMultiField({
      id: 'extraDataMessageMultiField',
      title: m.extraDataMessages.messageScreenTitle,
      children: [
        buildDescriptionField({
          id: 'extraDataIntro',
          description: m.extraDataMessages.intro,
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'extraDataInstitutionSummary',
          description: (
            application: Application,
            _locale: Locale,
            formatMessage?: FormatMessage,
          ) => {
            if (!formatMessage) {
              return ''
            }
            return buildExtraDataSummaryMarkdown(application, formatMessage)
          },
        }),
      ],
    }),
  ],
})
