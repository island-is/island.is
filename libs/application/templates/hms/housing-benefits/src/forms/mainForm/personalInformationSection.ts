import { buildSection } from '@island.is/application/core'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import * as m from '../../lib/messages'

export const personalInformationSection = buildSection({
  condition: (answers) => {
    console.log('answers: ', answers)
    return true
  },
  id: 'personalInformationSection',
  title: m.draftMessages.personalInformation.title,
  children: [
    applicantInformationMultiField({
      includeBankAccount: true,
      bankAccountRequired: true,
      phoneRequired: true,
    }),
  ],
})
