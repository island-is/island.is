import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTableRepeaterField,
  coreErrorMessages,
  YES,
} from '@island.is/application/core'
import { siaCountriesQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { getYesNoOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Query } from '@island.is/api/schema'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { isFirstApplication } from '../../../utils/conditionUtils'
import { getApplicationAnswers } from '../../../utils/medicalAndRehabilitationPaymentsUtils'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const benefitsFromAnotherCountrySubSection = buildSubSection({
  id: 'benefitsFromAnotherCountrySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .benefitsFromAnotherCountrySubSectionTitle,
  condition: (_, externalData) => isFirstApplication(externalData),
  children: [
    buildMultiField({
      id: 'benefitsFromAnotherCountry',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .benefitsFromAnotherCountryTitle,
      children: [
        buildAlertMessageField({
          id: 'benefitsFromAnotherCountry.alertMessage',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .benefitsFromAnotherCountryDescription,
          doesNotRequireAnswer: true,
          alertType: 'warning',
        }),
        buildRadioField({
          id: 'benefitsFromAnotherCountry.isReceivingBenefitsFromAnotherCountry',
          options: getYesNoOptions(),
          width: 'half',
          required: true,
        }),
        buildTableRepeaterField({
          id: 'benefitsFromAnotherCountry.countries',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .countryRegistration,
          editField: true,
          condition: (answers) => {
            const { isReceivingBenefitsFromAnotherCountry } =
              getApplicationAnswers(answers)

            return isReceivingBenefitsFromAnotherCountry === YES
          },
          fields: {
            country: {
              component: 'selectAsync',
              label:
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .country,
              placeholder:
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .selectCountry,
              width: 'half',
              loadingError: coreErrorMessages.failedDataProvider,
              loadOptions: async ({ apolloClient }) => {
                const { data } = await apolloClient.query<Query>({
                  query: siaCountriesQuery,
                })

                // Piggyback the name as part of the value
                return (
                  data?.socialInsuranceGeneral?.countries
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
                  .countryIdNumber,
              width: 'half',
              backgroundColor: 'blue',
            },
          },
          table: {
            format: {
              country: (value) => value?.split('::')[1],
            },
            header: [
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .country,
              medicalAndRehabilitationPaymentsFormMessage.generalInformation
                .countryIdNumber,
            ],
          },
        }),
      ],
    }),
  ],
})
