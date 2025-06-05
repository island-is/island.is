import {
  buildAsyncSelectField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { fileUploadSharedProps } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  getApplicationAnswers,
  getYesNoNotApplicableOptions,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

import { siaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/graphql/queries'
import { SiaUnionsQuery } from '@island.is/application/templates/social-insurance-administration-core/types/schema'

export const unionSickPaySubSection = buildSubSection({
  id: 'unionSickPaySubSection',
  title:
    medicalAndRehabilitationPaymentsFormMessage.generalInformation
      .unionSickPaySubSectionTitle,
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
          defaultValue: '2024-11-25',
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
          id: 'unionSickPay.unionNationalId.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionDescriptionTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedUnionSickPayRights === YES ||
              hasUtilizedUnionSickPayRights === NO
            )
          },
        }),
        buildAsyncSelectField({
          id: 'unionSickPay.unionNationalId',
          title:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectTitle,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.generalInformation
              .unionSickPayUnionSelectPlaceholder,
          required: true,
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedUnionSickPayRights === YES ||
              hasUtilizedUnionSickPayRights === NO
            )
          },
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<SiaUnionsQuery>({
              query: siaUnionsQuery,
            })

            return (
              data?.socialInsuranceUnions
                ?.map(({ name, nationalId }) => ({
                  value: nationalId || '',
                  label: name || '',
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
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
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedUnionSickPayRights === YES ||
              hasUtilizedUnionSickPayRights === NO
            )
          },
        }),
        buildDateField({
          id: 'unionSickPay.endDate',
          title: medicalAndRehabilitationPaymentsFormMessage.shared.date,
          placeholder:
            medicalAndRehabilitationPaymentsFormMessage.shared.datePlaceholder,
          required: true,
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return (
              hasUtilizedUnionSickPayRights === YES ||
              hasUtilizedUnionSickPayRights === NO
            )
          },
        }),
        buildDescriptionField({
          id: 'unionSickPay.fileupload.description',
          title:
            medicalAndRehabilitationPaymentsFormMessage.shared
              .uploadConfirmationDocument,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return hasUtilizedUnionSickPayRights === YES
          },
        }),
        buildFileUploadField({
          id: 'unionSickPay.fileupload',
          ...fileUploadSharedProps,
          condition: (answers) => {
            const { hasUtilizedUnionSickPayRights } =
              getApplicationAnswers(answers)
            return hasUtilizedUnionSickPayRights === YES
          },
        }),
      ],
    }),
  ],
})
