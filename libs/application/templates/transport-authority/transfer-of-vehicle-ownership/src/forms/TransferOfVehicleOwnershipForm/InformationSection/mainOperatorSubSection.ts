import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { CoOwnerAndOperatorField } from '../../../fields/CoOwnerAndOperatorRepeater/CoOwnerAndOperatorRepeater'
import { information } from '../../../lib/messages'

export const mainOperatorSubSection = buildSubSection({
  id: 'mainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const coOwnerAndOperator = getValueViaPath(
      formValue,
      'coOwnerAndOperator',
      [],
    ) as CoOwnerAndOperatorField[]
    return (
      coOwnerAndOperator.filter((field) => field.type === 'operator').length > 1
    )
  },
  children: [
    buildMultiField({
      id: 'mainOperatorMultiField',
      title: information.labels.mainOperator.title,
      description: information.labels.mainOperator.description,
      children: [
        buildRadioField({
          id: 'mainOperator.nationalId',
          title: information.labels.mainOperator.radioFieldLabel,
          options: (application) => {
            const coOwnerAndOperator = getValueViaPath(
              application.answers,
              'coOwnerAndOperator',
              [],
            ) as CoOwnerAndOperatorField[]
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
