import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ResidenceTypes } from '../../../types'

export const ResidenceConditionsSubSection = buildSubSection({
  id: 'residenceConditions',
  title: information.labels.residenceConditions.subSectionTitle,
  children: [
    buildMultiField({
      id: 'residenceConditionsMultiField',
      title: information.labels.residenceConditions.pageTitle,
      description: information.labels.residenceConditions.description,
      children: [
        buildDescriptionField({
          id: 'residenceConditions.title',
          title: information.labels.residenceConditions.title,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'residenceCondition.radio',
          title: '',
          description: '',
          backgroundColor: 'white',
          options: [
            {
              value: ResidenceTypes.MARRIED,
              label: information.labels.residenceTypes.married,
              subLabel: information.labels.residenceTypes.marriedSubLabel,
            },
            {
              value: ResidenceTypes.COHABIT,
              label: information.labels.residenceTypes.coHabit,
              subLabel: information.labels.residenceTypes.coHabitSubLabel,
            },
            {
              value: ResidenceTypes.CHILDOFRESIDENT,
              label: information.labels.residenceTypes.childOfResident,
              subLabel: information.labels.residenceTypes.childOfResidentSubLabel,
            },
            {
              value: ResidenceTypes.NORDICRESIDENT,
              label: information.labels.residenceTypes.nordicResident,
            },
            {
              value: ResidenceTypes.REFUGEE,
              label: information.labels.residenceTypes.refugee,
            },
            {
              value: ResidenceTypes.NORESIDENCY,
              label: information.labels.residenceTypes.noResidency,
            },
            {
              value: ResidenceTypes.FORMER,
              label: information.labels.residenceTypes.former,
            },
          ]
        })
      ],
    }),
  ],
})