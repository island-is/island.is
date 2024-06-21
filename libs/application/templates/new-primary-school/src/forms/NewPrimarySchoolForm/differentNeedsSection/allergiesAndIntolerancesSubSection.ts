import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { YES } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getFoodAllergiesOptions,
  getFoodIntolerancesOptions,
} from '../../../lib/newPrimarySchoolUtils'

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
        buildAsyncSelectField({
          id: 'allergiesAndIntolerances.foodAllergies',
          title: newPrimarySchoolMessages.differentNeeds.typeOfAllergies,
          dataTestId: 'food-allergies',
          placeholder:
            newPrimarySchoolMessages.differentNeeds.typeOfAllergiesPlaceholder,
          // TODO: Nota gögn fá Júní
          loadOptions: async ({ apolloClient }) => {
            /*  return await getOptionsListByType(
              apolloClient,
              OptionsType.ALLERGRY,
            )*/

            return getFoodAllergiesOptions()
          },
          isMulti: true,
          condition: (answers) => {
            const { hasFoodAllergies } = getApplicationAnswers(answers)

            return hasFoodAllergies?.includes(YES)
          },
        }),
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
        buildAsyncSelectField({
          id: 'allergiesAndIntolerances.foodIntolerances',
          title: newPrimarySchoolMessages.differentNeeds.typeOfIntolerances,
          dataTestId: 'food-intolerances',
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .typeOfIntolerancesPlaceholder,
          // TODO: Nota gögn fá Júní
          loadOptions: async ({ apolloClient }) => {
            /*return await getOptionsListByType(
              apolloClient,
              OptionsType.INTELERENCE,
            )*/

            return getFoodIntolerancesOptions()
          },
          isMulti: true,
          condition: (answers) => {
            const { hasFoodIntolerances } = getApplicationAnswers(answers)

            return hasFoodIntolerances?.includes(YES)
          },
        }),
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
