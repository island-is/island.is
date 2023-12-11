import {
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { checkIfValidationFails } from '../../lib/utils'

export const settlementValidation = buildSection({
  id: 'approveSubmission',
  title: m.divisionOfEstateByHeirsTerms,
  condition: (answers) => checkIfValidationFails(answers),
  children: [
    buildMultiField({
      id: 'settlementValidation',
      title: m.settlementValidationTitle,
      description: m.settlementValidationDescription,
      children: [
        buildCustomField({
          title: 'SubmitAndDecline',
          component: 'SubmitAndDecline',
          id: 'SubmitAndDecline',
        }),
      ],
    }),
  ],
})
