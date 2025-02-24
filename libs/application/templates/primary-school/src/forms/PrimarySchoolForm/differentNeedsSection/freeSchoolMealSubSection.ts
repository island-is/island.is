import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  YES,
  NO,
} from '@island.is/application/core'
import { OptionsType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const freeSchoolMealSubSection = buildSubSection({
  id: 'freeSchoolMealSubSection',
  title: primarySchoolMessages.differentNeeds.freeSchoolMealSubSectionTitle,
  children: [
    buildMultiField({
      id: 'freeSchoolMeal',
      title: primarySchoolMessages.differentNeeds.freeSchoolMealSubSectionTitle,
      description:
        primarySchoolMessages.differentNeeds.freeSchoolMealDescription,
      children: [
        buildRadioField({
          id: 'freeSchoolMeal.acceptFreeSchoolLunch',
          title: primarySchoolMessages.differentNeeds.acceptFreeSchoolLunch,
          width: 'half',
          required: true,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'freeSchoolMeal.hasSpecialNeeds',
          title: primarySchoolMessages.differentNeeds.hasSpecialNeeds,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
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
            title: primarySchoolMessages.differentNeeds.specialNeedsType,
            component: 'FriggOptionsAsyncSelectField',
            condition: (answers) => {
              const { acceptFreeSchoolLunch, hasSpecialNeeds } =
                getApplicationAnswers(answers)

              return acceptFreeSchoolLunch === YES && hasSpecialNeeds === YES
            },
          },
          {
            optionsType: OptionsType.SCHOOL_MEAL,
            placeholder:
              primarySchoolMessages.differentNeeds.specialNeedsTypePlaceholder,
          },
        ),
        buildAlertMessageField({
          id: 'freeSchoolMeal.foodAllergiesAlertMessage',
          title: primarySchoolMessages.shared.alertTitle,
          message:
            primarySchoolMessages.differentNeeds.foodAllergiesAlertMessage,
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
