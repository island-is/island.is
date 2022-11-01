import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { CoOwnerAndOperatorField } from '../../../fields/CoOwnerAndOperatorRepeater/CoOwnerAndOperatorRepeater'
import { information } from '../../../lib/messages'

export const mainCoOwnerSubSection = buildSubSection({
  id: 'mainCoOwner',
  title: information.labels.mainCoOwner.sectionTitle,
  condition: (formValue) => {
    const coOwnerAndOperator = getValueViaPath(
      formValue,
      'coOwnerAndOperator',
      [],
    ) as CoOwnerAndOperatorField[]
    console.log(
      coOwnerAndOperator.filter((field) => field.type === 'coOwner').length,
    )
    return (
      coOwnerAndOperator.filter((field) => field.type === 'coOwner').length > 1
    )
  },
  children: [
    buildMultiField({
      id: 'mainCoOwnerMultiField',
      title: information.labels.mainCoOwner.title,
      description: information.labels.mainCoOwner.description,
      children: [
        buildRadioField({
          id: 'mainCoOwner.nationalId',
          title: information.labels.mainCoOwner.radioFieldLabel,
          options: (application) => {
            const coOwnerAndOperator = getValueViaPath(
              application.answers,
              'coOwnerAndOperator',
              [],
            ) as CoOwnerAndOperatorField[]
            const coOwners = coOwnerAndOperator.filter(
              (field) => field.type === 'coOwner',
            )
            return coOwners.map((coOwner) => {
              return {
                value: coOwner.nationalId,
                label: `${coOwner.name} - ${coOwner.nationalId}`,
              }
            })
          },
        }),
      ],
    }),
  ],
})
