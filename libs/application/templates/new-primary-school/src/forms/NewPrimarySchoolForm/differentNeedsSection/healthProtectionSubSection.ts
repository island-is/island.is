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
import { differentNeedsMessages, sharedMessages } from '../../../lib/messages'
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
  title: differentNeedsMessages.healthProtection.subSectionTitle,
  children: [
    buildMultiField({
      id: 'healthProtection',
      title: differentNeedsMessages.healthProtection.subSectionTitle,
      description: differentNeedsMessages.healthProtection.description,
      children: [
        buildCheckboxField({
          id: 'healthProtection.hasFoodAllergiesOrIntolerances',
          title:
            differentNeedsMessages.healthProtection.allergiesAndIntolerances,
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.healthProtection
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
              differentNeedsMessages.healthProtection
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
              differentNeedsMessages.healthProtection
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
              label: differentNeedsMessages.healthProtection.hasOtherAllergies,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultAllergies(application.externalData) === YES ? [YES] : [],
        }),
        buildCustomField(
          {
            id: 'healthProtection.otherAllergies',
            title: differentNeedsMessages.healthProtection.typeOfOtherAllergies,
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
              differentNeedsMessages.healthProtection
                .typeOfOtherAllergiesPlaceholder,
            isMulti: true,
          },
        ),
        buildAlertMessageField({
          id: 'healthProtection.allergiesCertificateAlertMessage',
          title: sharedMessages.alertTitle,
          message:
            differentNeedsMessages.healthProtection
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
          title: differentNeedsMessages.healthProtection.usesEpiPen,
          width: 'half',
          required: true,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'uses-epi-pen',
              value: YES,
            },
            {
              label: sharedMessages.no,
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
            differentNeedsMessages.healthProtection
              .hasConfirmedMedicalDiagnoses,
          description:
            differentNeedsMessages.healthProtection
              .hasConfirmedMedicalDiagnosesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: sharedMessages.yes,
              dataTestId: 'has-confirmed-medical-diagnoses',
              value: YES,
            },
            {
              label: sharedMessages.no,
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
            differentNeedsMessages.healthProtection
              .requestsMedicationAdministration,
          titleVariant: 'h4',
          titleTooltip:
            differentNeedsMessages.healthProtection
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
              label: sharedMessages.yes,
              dataTestId: 'requests-medication-administration',
              value: YES,
            },
            {
              label: sharedMessages.no,
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
          title: sharedMessages.alertTitle,
          message:
            differentNeedsMessages.healthProtection.schoolNurseAlertMessage,
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
