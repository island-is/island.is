import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ReviewCoOwnerAndOperatorField } from '../../../shared'

export const mainOperatorSubSection = buildSubSection({
  id: 'buyerMainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const coOwnerAndOperator = getValueViaPath(
      formValue,
      'buyerCoOwnerAndOperator',
      [],
    ) as ReviewCoOwnerAndOperatorField[]
    return (
      coOwnerAndOperator.filter((field) => field.type === 'operator').length > 1
    )
  },
  children: [
    buildMultiField({
      id: 'buyerMainOperatorMultiField',
      title: information.labels.mainOperator.title,
      description: information.labels.mainOperator.description,
      children: [
        buildRadioField({
          id: 'buyerMainOperator.nationalId',
          title: information.labels.mainOperator.radioFieldLabel,
          options: (application) => {
            const coOwnerAndOperator = getValueViaPath(
              application.answers,
              'buyerCoOwnerAndOperator',
              [],
            ) as ReviewCoOwnerAndOperatorField[]
            const operators = coOwnerAndOperator.filter(
              (field) => field.type === 'operator',
            )
            return operators.map((operator) => {
              return {
                value: operator.nationalId,
                label: `${operator.name} - ${operator.nationalId}`,
              }
            })
          },
        }),
      ],
    }),
  ],
})
