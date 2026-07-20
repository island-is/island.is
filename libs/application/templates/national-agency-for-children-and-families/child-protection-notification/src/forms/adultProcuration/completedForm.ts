import {
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewMessages } from '../../lib/messages'
import { adultProcurationOverviewFields } from '../../utils/adultProcurationOverviewFields'

export const AdultProcurationCompletedForm = buildForm({
  id: 'AdultProcurationCompletedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'completedOverviewSection',
      title: overviewMessages.sectionTitle,
      children: [
        buildMultiField({
          id: 'completedOverview',
          title: overviewMessages.sectionTitle,
          description: overviewMessages.description,
          children: adultProcurationOverviewFields(false),
        }),
      ],
    }),
  ],
})
