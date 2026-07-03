import {
  buildDescriptionField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { PERIOD_TWELVE_MONTHS } from '../../lib/constants'

export const overviewSection = buildSection({
  id: 'overview',
  title: messages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: messages.overview.title,
      description: messages.overview.intro,
      children: [
        buildKeyValueField({
          label: messages.overview.chiefExecutiveJobTitleLabel,
          width: 'full',
          value: (application: Application) =>
            getValueViaPath(application.answers, 'chiefExecutive.jobTitle'),
        }),
        buildDescriptionField({
          id: 'overview.space0',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: messages.overview.periodLabel,
          width: 'full',
          value: (application: Application) =>
            getValueViaPath(application.answers, 'period.period') ===
            PERIOD_TWELVE_MONTHS
              ? messages.aboutTheCompany.period.medium12months
              : messages.aboutTheCompany.period.oneMonth,
        }),
      ],
    }),
  ],
})
