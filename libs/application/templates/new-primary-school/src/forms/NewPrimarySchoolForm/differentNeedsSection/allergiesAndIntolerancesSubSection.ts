import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { YES } from '@island.is/application/types'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const allergiesAndIntolerancesSubSection = buildSubSection({
  id: 'allergiesAndIntolerancesSubSection',
  title:
    newPrimarySchoolMessages.differentNeeds
      .allergiesAndIntolerancesSubSectionTitle,
  children: [
    buildMultiField({
      id: 'allergiesAndIntolerances',
      title:
        newPrimarySchoolMessages.differentNeeds
          .foodAllergiesAndIntolerancesTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .foodAllergiesAndIntolerancesDescription,
      children: [
        buildCheckboxField({
          id: 'allergiesAndIntolerances.hasFoodAllergies',
          title: '',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds.childHasFoodAllergies,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.foodAllergies',
            title: newPrimarySchoolMessages.differentNeeds.typeOfAllergies,
            component: 'FriggOptionsAsyncSelectField',
            dataTestId: 'food-allergies',
            condition: (answers) => {
              const { hasFoodAllergies } = getApplicationAnswers(answers)

              return hasFoodAllergies?.includes(YES)
            },
          },
          {
            optionsType: OptionsType.ALLERGY,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .typeOfAllergiesPlaceholder,
          },
        ),
        buildAlertMessageField({
          id: 'allergiesAndIntolerances.info',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.differentNeeds
              .confirmFoodAllergiesAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          marginBottom: 4,
          condition: (answers) => {
            const { hasFoodAllergies } = getApplicationAnswers(answers)

            return hasFoodAllergies?.includes(YES)
          },
        }),
        buildCheckboxField({
          id: 'allergiesAndIntolerances.hasFoodIntolerances',
          title: '',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .childHasFoodIntolerances,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.foodIntolerances',
            title: newPrimarySchoolMessages.differentNeeds.typeOfIntolerances,
            component: 'FriggOptionsAsyncSelectField',
            dataTestId: 'food-intolerances',
            condition: (answers) => {
              const { hasFoodIntolerances } = getApplicationAnswers(answers)

              return hasFoodIntolerances?.includes(YES)
            },
          },
          {
            optionsType: OptionsType.INTOLERANCE,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .typeOfIntolerancesPlaceholder,
          },
        ),
        buildDescriptionField({
          // Needed to add space
          id: 'allergiesAndIntolerances.divider',
          title: '',
          marginBottom: 4,
          condition: (answers) => {
            const { hasFoodIntolerances } = getApplicationAnswers(answers)

            return hasFoodIntolerances?.includes(YES)
          },
        }),
        buildCheckboxField({
          id: 'allergiesAndIntolerances.isUsingEpiPen',
          title: '',
          spacing: 0,
          options: [
            {
              value: YES,
              label: newPrimarySchoolMessages.differentNeeds.usesEpinephrinePen,
            },
          ],
        }),
      ],
    }),
  ],
})
