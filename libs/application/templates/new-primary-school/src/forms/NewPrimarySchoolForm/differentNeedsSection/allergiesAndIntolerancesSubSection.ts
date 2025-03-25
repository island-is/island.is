import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
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
          .allergiesAndIntolerancesSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .allergiesAndIntolerancesDescription,
      children: [
        buildCheckboxField({
          id: 'allergiesAndIntolerances.hasFoodAllergiesOrIntolerances',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .hasFoodAllergiesOrIntolerances,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.foodAllergiesOrIntolerances',
            title:
              newPrimarySchoolMessages.differentNeeds
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
              newPrimarySchoolMessages.differentNeeds
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
              label: newPrimarySchoolMessages.differentNeeds.hasOtherAllergies,
            },
          ],
        }),
        buildCustomField(
          {
            id: 'allergiesAndIntolerances.otherAllergies',
            title: newPrimarySchoolMessages.differentNeeds.typeOfOtherAllergies,
            component: 'FriggOptionsAsyncSelectField',
            condition: (answers) => {
              const { hasOtherAllergies } = getApplicationAnswers(answers)

              return hasOtherAllergies?.includes(YES)
            },
          },
          {
            optionsType: OptionsType.ALLERGY,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .typeOfOtherAllergiesPlaceholder,
            isMulti: true,
          },
        ),
        buildAlertMessageField({
          id: 'allergiesAndIntolerances.allergiesCertificateAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.differentNeeds
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
          title: newPrimarySchoolMessages.differentNeeds.usesEpiPen,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'uses-epi-pen',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-uses-epi-pen',
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
            newPrimarySchoolMessages.differentNeeds
              .hasConfirmedMedicalDiagnoses,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasConfirmedMedicalDiagnosesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-confirmed-medical-diagnoses',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-confirmed-medical-diagnoses',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'allergiesAndIntolerances.requestsMedicationAdministration',
          title:
            newPrimarySchoolMessages.differentNeeds
              .requestsMedicationAdministration,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'requests-medication-administration',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-requests-medication-administration',
              value: NO,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'allergiesAndIntolerances.schoolNurseAlertMessage',
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.differentNeeds.schoolNurseAlertMessage,
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
