import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Operator } from '../../../shared'
import kennitala from 'kennitala'

export const mainOperatorSubSection = buildSubSection({
  id: 'buyerMainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const buyerOperator = getValueViaPath(
      formValue,
      'buyerOperator',
      [],
    ) as Operator[]
    return (
      buyerOperator.filter(({ wasRemoved }) => wasRemoved !== 'true').length > 1
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
            const buyerOperator = getValueViaPath(
              application.answers,
              'buyerOperator',
              [],
            ) as Operator[]
            const operators = buyerOperator.filter(
              ({ wasRemoved }) => wasRemoved !== 'true',
            )
            return operators.map((operator) => {
              return {
                value: operator.nationalId || '',
                label: `${operator.name} - ${kennitala.format(
                  operator.nationalId || '',
                  '-',
                )}`,
              }
            })
          },
        }),
      ],
    }),
  ],
})
