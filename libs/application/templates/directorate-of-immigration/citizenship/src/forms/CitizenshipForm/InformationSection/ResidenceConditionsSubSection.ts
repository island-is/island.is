import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ResidenceCondition } from '@island.is/clients/directorate-of-immigration/citizenship'

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
          options: (application) => {
            const residenceConditionOptions = getValueViaPath(
              application.externalData,
              'residenceConditions.data',
              [],
            ) as ResidenceCondition[]

            return residenceConditionOptions.map(
              ({ conditionId, conditionName }) => ({
                value: conditionId.toString(),
                label: conditionName,
              }),
            )
          },
        }),
      ],
    }),
  ],
})
