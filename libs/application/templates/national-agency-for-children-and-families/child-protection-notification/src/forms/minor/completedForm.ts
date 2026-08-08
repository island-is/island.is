import {
  buildForm,
  buildMultiField,
  buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewMessages } from '../../lib/messages'
import { getOverviewItems } from '../../utils/getOverviewItems'

export const MinorCompletedForm = buildForm({
  id: 'MinorCompletedForm',
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
          children: [
            buildOverviewField({
              id: 'overview',
              title: overviewMessages.sectionTitle,
              bottomLine: false,
              items: getOverviewItems,
            }),
          ],
        }),
      ],
    }),
  ],
})
