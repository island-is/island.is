import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  YES,
  NO,
} from '@island.is/application/core'
import { ApplicationType, OptionsType } from '../../../lib/constants'
import { primarySchoolMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/primarySchoolUtils'

export const allergiesAndIntolerancesSubSection = buildSubSection({
  id: 'allergiesAndIntolerancesSubSection',
  title:
    primarySchoolMessages.differentNeeds
      .allergiesAndIntolerancesSubSectionTitle,
  condition: (answers) => {
    // Only display section if application type is "Enrollment in primary school"
    const { applicationType } = getApplicationAnswers(answers)
    return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
  },
  children: [
    buildMultiField({
      id: 'allergiesAndIntolerances',
      title:
        primarySchoolMessages.differentNeeds
          .allergiesAndIntolerancesSubSectionTitle,
      description:
        primarySchoolMessages.differentNeeds
          .allergiesAndIntolerancesDescription,
      children: [
        buildCheckboxField({
          id: 'allergiesAndIntolerances.hasFoodAllergiesOrIntolerances',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                primarySchoolMessages.differentNeeds
                  .hasFoodAllergiesOrIntolerances,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.foodAllergiesOrIntolerances',
            title:
              primarySchoolMessages.differentNeeds
                .typeOfFoodAllergiesOrIntolerances,
            component: 'FriggOptionsAsyncSelectField',
            marginBottom: 3,
            condition: (answers) => {
              const { hasFoodAllergiesOrIntolerances } =
                getApplicationAnswers(answers)

              return hasFoodAllergiesOrIntolerances?.includes(YES)
            },
          },
          {
            optionsType: OptionsType.FOOD_ALLERGY_AND_INTOLERANCE,
            placeholder:
              primarySchoolMessages.differentNeeds
                .typeOfFoodAllergiesOrIntolerancesPlaceholder,
            isMulti: true,
          },
        ),
        buildCheckboxField({
          id: 'allergiesAndIntolerances.hasOtherAllergies',
          spacing: 0,
          options: [
            {
              value: YES,
              label: primarySchoolMessages.differentNeeds.hasOtherAllergies,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.otherAllergies',
            title: primarySchoolMessages.differentNeeds.typeOfOtherAllergies,
            component: 'FriggOptionsAsyncSelectField',
            condition: (answers) => {
              const { hasOtherAllergies } = getApplicationAnswers(answers)

              return hasOtherAllergies?.includes(YES)
            },
          },
          {
            optionsType: OptionsType.ALLERGY,
            placeholder:
              primarySchoolMessages.differentNeeds
                .typeOfOtherAllergiesPlaceholder,
            isMulti: true,
          },
        ),
        buildAlertMessageField({
          id: 'allergiesAndIntolerances.allergiesCertificateAlertMessage',
          title: primarySchoolMessages.shared.alertTitle,
          message:
            primarySchoolMessages.differentNeeds
              .allergiesCertificateAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          marginTop: 4,
          condition: (answers) => {
            const { hasFoodAllergiesOrIntolerances, hasOtherAllergies } =
              getApplicationAnswers(answers)

            return (
              hasFoodAllergiesOrIntolerances?.includes(YES) ||
              hasOtherAllergies?.includes(YES)
            )
          },
        }),
        buildRadioField({
          id: 'allergiesAndIntolerances.usesEpiPen',
          title: primarySchoolMessages.differentNeeds.usesEpiPen,
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
          condition: (answers) => {
            const { hasFoodAllergiesOrIntolerances, hasOtherAllergies } =
              getApplicationAnswers(answers)

            return (
              hasFoodAllergiesOrIntolerances?.includes(YES) ||
              hasOtherAllergies?.includes(YES)
            )
          },
        }),
        buildRadioField({
          id: 'allergiesAndIntolerances.hasConfirmedMedicalDiagnoses',
          title:
            primarySchoolMessages.differentNeeds.hasConfirmedMedicalDiagnoses,
          description:
            primarySchoolMessages.differentNeeds
              .hasConfirmedMedicalDiagnosesDescription,
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
        }),
        buildRadioField({
          id: 'allergiesAndIntolerances.requestsMedicationAdministration',
          title:
            primarySchoolMessages.differentNeeds
              .requestsMedicationAdministration,
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
        }),
        buildAlertMessageField({
          id: 'allergiesAndIntolerances.schoolNurseAlertMessage',
          title: primarySchoolMessages.shared.alertTitle,
          message: primarySchoolMessages.differentNeeds.schoolNurseAlertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
          marginTop: 4,
          condition: (answers) => {
            const {
              hasConfirmedMedicalDiagnoses,
              requestsMedicationAdministration,
            } = getApplicationAnswers(answers)

            return (
              hasConfirmedMedicalDiagnoses === YES ||
              requestsMedicationAdministration === YES
            )
          },
        }),
      ],
    }),
  ],
})
