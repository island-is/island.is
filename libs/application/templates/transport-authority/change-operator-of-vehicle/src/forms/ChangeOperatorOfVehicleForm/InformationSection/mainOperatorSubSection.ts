import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { OperatorField } from '../../../shared'

export const mainOperatorSubSection = buildSubSection({
  id: 'buyerMainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const operators = getValueViaPath(
      formValue,
      'operators',
      [],
    ) as OperatorField[]
    return operators.length > 1
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
            const operators = getValueViaPath(
              application.answers,
              'operators',
              [],
            ) as OperatorField[]
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
