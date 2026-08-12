import { buildForm, buildMultiField } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'

import { overviewMessages } from '../../lib/messages'
import { adultProcurationOverviewFields } from '../../utils/adultProcurationOverviewFields'

export const AdultProcurationCompletedForm = buildForm({
  id: 'AdultProcurationCompletedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'completedOverview',
      title: overviewMessages.sectionTitle,
      children: adultProcurationOverviewFields(false),
    }),
  ],
})
