import {
  buildSection,
  buildMultiField,
  buildDateField,
  buildSelectField,
  buildDescriptionField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { terminationReasonOptions } from '../../utils/options'
import { isUnboundTermination } from '../../utils/conditions'
import {
  getSelectedContractStartDate,
  getOneMonthFromToday,
} from '../../utils/helpers'

export const unboundTerminationSection = buildSection({
  condition: isUnboundTermination,
  id: 'unboundTerminationSection',
  title: m.unboundTerminationMessages.title,
  children: [
    buildMultiField({
      id: 'unboundTerminationMultiField',
      title: m.unboundTerminationMessages.title,
      description: m.unboundTerminationMessages.dateInfo,
      children: [
        buildDateField({
          id: 'unboundTermination.unboundTerminationDate',
          title: m.unboundTerminationMessages.dateTitle,
          minDate: getSelectedContractStartDate,
          maxDate: getOneMonthFromToday,
        }),
        buildSelectField({
          id: 'unboundTermination.unboundTerminationReason',
          title: m.unboundTerminationMessages.selectTitle,
          options: terminationReasonOptions,
        }),
      ],
    }),
  ],
})
