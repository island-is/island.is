import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { OptionsType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultYESNOValue,
  hasDefaultAllergies,
  hasDefaultFoodAllergiesOrIntolerances,
} from '../../../utils/newPrimarySchoolUtils'

export const healthProtectionSubSection = buildSubSection({
  id: 'healthProtectionSubSection',
  title:
    newPrimarySchoolMessages.differentNeeds.healthProtectionSubSectionTitle,
  children: [
    buildMultiField({
      id: 'healthProtection',
      title:
        newPrimarySchoolMessages.differentNeeds.healthProtectionSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .healthProtectionSubSectionDescription,

      children: [
        buildCheckboxField({
          id: 'healthProtection.hasFoodAllergiesOrIntolerances',
          title:
            newPrimarySchoolMessages.differentNeeds.allergiesAndIntolerances,
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .hasFoodAllergiesOrIntolerances,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultFoodAllergiesOrIntolerances(application.externalData) ===
            YES
              ? [YES]
              : [],
        }),
        buildCustomField(
          {
            id: 'healthProtection.foodAllergiesOrIntolerances',
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
            defaultValue: (application: Application) => {
              const { healthProfile } = getApplicationExternalData(
                application.externalData,
              )
              return healthProfile?.foodAllergiesOrIntolerances ?? []
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
          id: 'healthProtection.hasOtherAllergies',
          spacing: 0,
          options: [
            {
              value: YES,
              label: newPrimarySchoolMessages.differentNeeds.hasOtherAllergies,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultAllergies(application.externalData) === YES ? [YES] : [],
        }),
        buildCustomField(
          {
            id: 'healthProtection.otherAllergies',
            title: newPrimarySchoolMessages.differentNeeds.typeOfOtherAllergies,
            component: 'FriggOptionsAsyncSelectField',
            condition: (answers) => {
              const { hasOtherAllergies } = getApplicationAnswers(answers)

              return hasOtherAllergies?.includes(YES)
            },
            defaultValue: (application: Application) => {
              const { healthProfile } = getApplicationExternalData(
                application.externalData,
              )
              return healthProfile?.allergies ?? []
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
          id: 'healthProtection.allergiesCertificateAlertMessage',
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
          id: 'healthProtection.usesEpiPen',
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
          defaultValue: (application: Application) => {
            const { healthProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(healthProfile?.usesEpipen)
          },
        }),
        buildRadioField({
          id: 'healthProtection.hasConfirmedMedicalDiagnoses',
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
          defaultValue: (application: Application) => {
            const { healthProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(
              healthProfile?.hasConfirmedMedicalDiagnoses,
            )
          },
        }),
        buildDescriptionField({
          id: 'healthProtection.requestsMedicationAdministrationDescription',
          title:
            newPrimarySchoolMessages.differentNeeds
              .requestsMedicationAdministration,
          titleVariant: 'h4',
          titleTooltip:
            newPrimarySchoolMessages.differentNeeds
              .requestsMedicationAdministrationTooltip,
          space: 4,
        }),
        buildRadioField({
          id: 'healthProtection.requestsMedicationAdministration',
          width: 'half',
          space: 0,
          required: true,
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
          defaultValue: (application: Application) => {
            const { healthProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(
              healthProfile?.requestsMedicationAdministration,
            )
          },
        }),
        buildAlertMessageField({
          id: 'healthProtection.schoolNurseAlertMessage',
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
        buildHiddenInput({
          id: 'healthProtection.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
