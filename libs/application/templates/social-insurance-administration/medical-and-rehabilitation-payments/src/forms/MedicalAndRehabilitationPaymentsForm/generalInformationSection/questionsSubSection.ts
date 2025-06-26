import {
  buildAsyncSelectField,
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTableRepeaterField,
  coreErrorMessages,
  YES,
} from '@island.is/application/core'
import {
  siaCountriesQuery,
  siaEducationalInstitutionsQuery,
} from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import {
  SiaCountriesQuery,
  SiaEducationalInstitutionsQuery,
} from '@island.is/application/templates/social-insurance-administration-core/types/schema'
import { Application } from '@island.is/application/types'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  shouldShowCalculatedRemunerationDate,
  shouldShowIsStudyingFields,
} from '../../../utils/conditionUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const questionsSubSection = buildSubSection({
  id: 'questionsSubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .questionsSubSectionTitle,
  children: [
    buildMultiField({
      id: 'questions',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .questionsSubSectionTitle,
      children: [
        buildRadioField({
          id: 'questions.isSelfEmployed',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsSelfEmployed,
          description:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsSelfEmployedDescription,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildDescriptionField({
          id: 'questions.calculatedRemunerationDate.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsCalculatedRemunerationDate,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowCalculatedRemunerationDate(answers),
        }),
        buildDateField({
          id: 'questions.calculatedRemunerationDate',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => shouldShowCalculatedRemunerationDate(answers),
        }),
        buildRadioField({
          id: 'questions.isPartTimeEmployed',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsPartTimeEmployed,
          space: 4,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildRadioField({
          id: 'questions.isStudying',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsIsStudying,
          space: 4,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildDescriptionField({
          id: 'questions.educationalInstitution.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsSchoolRegistration,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowIsStudyingFields(answers),
        }),
        buildAsyncSelectField({
          id: 'questions.educationalInstitution',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsSchool,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsSelectSchool,
          required: true,
          width: 'half',
          loadingError: coreErrorMessages.failedDataProvider,
          loadOptions: async ({ apolloClient }) => {
            const { data } =
              await apolloClient.query<SiaEducationalInstitutionsQuery>({
                query: siaEducationalInstitutionsQuery,
              })

            return (
              data?.socialInsuranceEducationalInstitutions
                ?.map(({ name }) => ({
                  value: name || '', // Should send nationalId when Smári is ready
                  label: name || '',
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) => shouldShowIsStudyingFields(answers),
        }),
        buildSelectField({
          id: 'questions.ectsUnits',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsNumberOfCredits,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsSelectNumberOfCredits,
          width: 'half',
          options: (application: Application) => {
            const { ectsUnits } = getApplicationExternalData(
              application.externalData,
            )

            return ectsUnits.map(({ value, description }) => ({
              value: value,
              label: description,
            }))
          },
          condition: (answers) => shouldShowIsStudyingFields(answers),
        }),
        buildRadioField({
          id: 'questions.isReceivingPaymentsFromOtherCountry',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsBenefitsFromAnotherCountry,
          space: 4,
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildTableRepeaterField({
          id: 'questions.countries',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .questionsCountryRegistration,
          editField: true,
          condition: (answers) => {
            const { isReceivingPaymentsFromOtherCountry } =
              getApplicationAnswers(answers)

            return isReceivingPaymentsFromOtherCountry === YES
          },
          fields: {
            country: {
              component: 'selectAsync',
              label:
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsCountry,
              placeholder:
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsSelectCountry,
              width: 'half',
              loadingError: coreErrorMessages.failedDataProvider,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<SiaCountriesQuery>({
                  query: siaCountriesQuery,
                })

                // Piggyback the name as part of the value
                return (
                  data?.socialInsuranceCountries
                    ?.map(({ code, name }) => ({
                      value: `${code}::${name}`,
                      label: name || '',
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label)) ?? []
                )
              },
            },
            nationalId: {
              component: 'input',
              label:
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsCountryIDNumber,
              width: 'half',
              backgroundColor: 'blue',
              type: 'number',
            },
          },
          table: {
            format: {
              country: (value) => value?.split('::')[1],
            },
            header: [
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .questionsCountry,
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .questionsCountryIDNumber,
            ],
          },
        }),
      ],
    }),
  ],
})
