import {
  buildAsyncSelectField,
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  coreErrorMessages,
  YES,
} from '@island.is/application/core'
import { siaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { Query } from '@island.is/api/schema'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import {
  isFirstApplication,
  shouldShowUnionSickPayUnionAndEndDate,
} from '../../../utils/conditionUtils'
import {
  getApplicationAnswers,
  getYesNoNotApplicableOptions,
  hasNotUtilizedRights,
  hasUtilizedRights,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const unionSickPaySubSection = buildSubSection({
  id: 'unionSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .unionSickPaySubSectionTitle,
  condition: (_, externalData) => isFirstApplication(externalData),
  children: [
    buildMultiField({
      id: 'unionSickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayFromUnionTitle,
      condition: () => {
        // TODO: Here we need to check the data that we are getting from the API to know if we should show this field
        return false
      },
      children: [
        buildTextField({
          id: 'unionSickPay.unionName',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayFromUnionName,
          width: 'half',
          disabled: true,
          defaultValue: 'VR',
        }),
        buildDateField({
          id: 'unionSickPay.endDate',
          title: () => {
            //TODO: Here we need to check the date we are getting from the API to know what title to show
            return medicalAndRehabilitationPaymentsFormMessage.shared
              .sickPayDidEndDate
            return medicalAndRehabilitationPaymentsFormMessage.shared
              .sickPayDoesEndDate
          },
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          width: 'half',
          disabled: true,
          defaultValue: '', //Use the data from TR when the TR API is ready
        }),
      ],
    }),
    buildMultiField({
      id: 'unionSickPay',
      title:
        medicalAndRehabilitationPaymentsFormMessage.generalInformation
          .unionSickPayTitle,
      condition: () => {
        // TODO: Here we need to check the data that we are getting from the API to know if we should show this field
        return true
      },
      children: [
        buildRadioField({
          id: 'unionSickPay.hasUtilizedUnionSickPayRights',
          options: getYesNoNotApplicableOptions(),
          required: true,
        }),
        buildDescriptionField({
          id: 'unionSickPay.unionInfo.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionDescriptionTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) =>
            shouldShowUnionSickPayUnionAndEndDate(answers),
        }),
        buildAsyncSelectField({
          id: 'unionSickPay.unionInfo',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectPlaceholder,
          required: true,
          loadingError: coreErrorMessages.failedDataProvider,
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<Query>({
              query: siaUnionsQuery,
            })

            return (
              data?.socialInsuranceGeneral?.unions
                ?.map(({ name, nationalId }) => ({
                  value: `${nationalId}::${name}` || '',
                  label: name || '',
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) =>
            shouldShowUnionSickPayUnionAndEndDate(answers),
        }),
        buildDescriptionField({
          id: 'unionSickPay.endDate.description',
          title: (application) => {
            const { hasUtilizedUnionSickPayRights } = getApplicationAnswers(
              application.answers,
            )

            if (hasUtilizedUnionSickPayRights === YES) {
              return medicalAndRehabilitationPaymentsFormMessage
                .generalInformation.unionSickPayDidEndDate
            }

            return medicalAndRehabilitationPaymentsFormMessage
              .generalInformation.unionSickPayDoesEndDate
          },
          titleVariant: 'h4',
          space: 4,
          condition: (answers) =>
            shouldShowUnionSickPayUnionAndEndDate(answers),
        }),
        buildDateField({
          id: 'unionSickPay.endDate',
          minDate: (application) => {
            const { hasUtilizedUnionSickPayRights } = getApplicationAnswers(
              application.answers,
            )
            return hasNotUtilizedRights(hasUtilizedUnionSickPayRights)
          },
          maxDate: (application) => {
            const { hasUtilizedUnionSickPayRights } = getApplicationAnswers(
              application.answers,
            )
            return hasUtilizedRights(hasUtilizedUnionSickPayRights)
          },
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) =>
            shouldShowUnionSickPayUnionAndEndDate(answers),
        }),
      ],
    }),
  ],
})
