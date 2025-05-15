import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { CoOwnerAndOperator } from '../../../shared'
import kennitala from 'kennitala'

export const mainOperatorSubSection = buildSubSection({
  id: 'buyerMainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const coOwnerAndOperator = getValueViaPath(
      formValue,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[]
    return (
      coOwnerAndOperator
        .filter(({ wasRemoved }) => wasRemoved !== 'true')
        .filter((field) => field.type === 'operator').length > 1
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
            ) as CoOwnerAndOperator[]
            const operators = coOwnerAndOperator
              .filter(({ wasRemoved }) => wasRemoved !== 'true')
              .filter((field) => field.type === 'operator')
            return operators.map((operator) => {
              return {
                value: operator.nationalId!,
                label: `${operator.name} - ${kennitala.format(
                  operator.nationalId!,
                )}`,
              }
            })
          },
        }),
      ],
    }),
  ],
})
