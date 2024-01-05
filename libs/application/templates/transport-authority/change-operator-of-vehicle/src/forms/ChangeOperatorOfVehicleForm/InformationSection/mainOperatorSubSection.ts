import {
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { OperatorInformation, OldOperatorInformation } from '../../../shared'

export const mainOperatorSubSection = buildSubSection({
  id: 'mainOperator',
  title: information.labels.mainOperator.sectionTitle,
  condition: (formValue) => {
    const operators = getValueViaPath(
      formValue,
      'operators',
      [],
    ) as OperatorInformation[]
    const oldOperators = getValueViaPath(
      formValue,
      'oldOperators',
      [],
    ) as OldOperatorInformation[]
    return (
      operators.filter(({ wasRemoved }) => wasRemoved !== 'true').length +
        oldOperators?.filter((x) => x.wasRemoved === 'false').length >
      1
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
            const operators = getValueViaPath(
              application.answers,
              'operators',
              [],
            ) as OperatorInformation[]
            const oldOperators = getValueViaPath(
              application.answers,
              'oldOperators',
              [],
            ) as OldOperatorInformation[]
            return [
              ...operators.filter(({ wasRemoved }) => wasRemoved !== 'true'),
              ...oldOperators.filter(({ wasRemoved }) => wasRemoved !== 'true'),
            ].map((operator) => {
              return {
                value: operator.nationalId!,
                label: `${operator.name} - ${operator.nationalId}`,
              }
            })
          },
        }),
      ],
    }),
  ],
})
