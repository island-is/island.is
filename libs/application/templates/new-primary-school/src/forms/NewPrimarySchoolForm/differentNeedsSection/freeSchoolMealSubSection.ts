import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES } from '@island.is/application/types'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/newPrimarySchoolUtils'

export const freeSchoolMealSubSection = buildSubSection({
  id: 'freeSchoolMealSubSection',
  title: newPrimarySchoolMessages.differentNeeds.freeSchoolMealSubSectionTitle,
  children: [
    buildMultiField({
      id: 'freeSchoolMeal',
      title:
        newPrimarySchoolMessages.differentNeeds.freeSchoolMealSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds.freeSchoolMealDescription,
      children: [
        buildRadioField({
          id: 'freeSchoolMeal.acceptFreeSchoolLunch',
          title: newPrimarySchoolMessages.differentNeeds.acceptFreeSchoolLunch,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'freeSchoolMeal.hasSpecialNeeds',
          title: newPrimarySchoolMessages.differentNeeds.hasSpecialNeeds,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
          condition: (answers) => {
            const { acceptFreeSchoolLunch } = getApplicationAnswers(answers)

            return acceptFreeSchoolLunch === YES
          },
        }),
        buildCustomField(
          {
            id: 'freeSchoolMeal.specialNeedsType',
            title: newPrimarySchoolMessages.differentNeeds.specialNeedsType,
            component: 'FriggOptionsAsyncSelectField',
            condition: (answers) => {
              const { acceptFreeSchoolLunch, hasSpecialNeeds } =
                getApplicationAnswers(answers)

              return acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES
            },
          },
          {
            optionsType: OptionsType.ALLERGY, // TODO: Update when Júní has updated key-options
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .specialNeedsTypePlaceholder,
          },
        ),
        buildAlertMessageField({
          id: 'freeSchoolMeal.foodAllergiesAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.differentNeeds.foodAllergiesAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: (answers) => {
            const { acceptFreeSchoolLunch, hasSpecialNeeds } =
              getApplicationAnswers(answers)

            return acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES
          },
        }),
      ],
    }),
  ],
})
