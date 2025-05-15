import {
  buildSection,
  buildMultiField,
  buildDateField,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { TerminationTypes } from '../../utils/constants'

export const boundTerminationSection = buildSection({
  // TODO: Redo this when we have data from HMS
  condition: (answers) => {
    const terminationType = getValueViaPath<string>(answers, 'terminationType')
    const rentalAgreement = getValueViaPath<string>(answers, 'rentalAgreement')
    console.log(rentalAgreement)
    return terminationType === TerminationTypes.DISMISSAL && true
  },
  id: 'boundTerminationSection',
  title: m.boundTerminationMessages.title,
  children: [
    buildMultiField({
      id: 'boundTerminationMultiField',
      title: m.boundTerminationMessages.title,
      description: m.boundTerminationMessages.description,
      children: [
        buildDateField({
          id: 'boundTerminationDate',
          title: m.boundTerminationMessages.dateTitle,
        }),
      ],
    }),
  ],
})
