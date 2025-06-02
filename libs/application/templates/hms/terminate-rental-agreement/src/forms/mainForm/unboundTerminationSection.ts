import {
  buildSection,
  buildMultiField,
  buildDateField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { terminationReasonOptions } from '../../utils/options'
import { TerminationTypes } from '../../utils/constants'

export const unboundTerminationSection = buildSection({
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(answers, 'terminationType')
    const rentalAgreement = getValueViaPath<string>(answers, 'rentalAgreement')
    console.log(rentalAgreement)
    return terminationType === TerminationTypes.DISMISSAL && true
  },
  id: 'unboundTerminationSection',
  title: m.unboundTerminationMessages.title,
  children: [
    buildMultiField({
      id: 'unboundTerminationMultiField',
      title: m.unboundTerminationMessages.title,
      children: [
        buildDateField({
          id: 'unboundTerminationDate',
          title: m.unboundTerminationMessages.dateTitle,
        }),
        buildSelectField({
          id: 'unboundTerminationReason',
          title: m.unboundTerminationMessages.selectTitle,
          options: terminationReasonOptions,
        }),
      ],
    }),
  ],
})
