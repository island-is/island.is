import {
  buildAlertMessageField,
  buildDateField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildFileUploadField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import {
  GaldurDomainModelsSettingsIncomeTypesIncomeTypeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
} from '@island.is/clients/vmst-unemployment'

export const otherBenefitsSubSection = buildSubSection({
  id: 'otherBenefitsSubSection',
  title: payoutMessages.otherBenefits.sectionTitle,
  children: [
    buildMultiField({
      id: 'otherBenefitsSubSection',
      title: payoutMessages.otherBenefits.pageTitle,
      description: payoutMessages.otherBenefits.pageDescription,
      children: [
        buildDescriptionField({
          id: 'otherBenefits.paymentsFromInsuraceDescription',
          title: payoutMessages.otherBenefits.paymentsFromInsuraceDescription,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'otherBenefits.paymentsFromInsurace',
          title: payoutMessages.otherBenefits.paymentsFromInsurace,
          variant: 'currency',
        }),
        buildDescriptionField({
          id: 'otherBenefits.paymentsFromPensionDescription',
          title: payoutMessages.otherBenefits.paymentsFromPensionDescription,
          titleVariant: 'h5',
        }),
        buildFieldsRepeaterField({
          id: 'otherBenefits.paymentsFromPension',
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,
          fields: {
            typeOfPayment: {
              component: 'select',
              label: payoutMessages.otherBenefits.typeOfPayment,
              width: 'half',
              options: (application, _, locale) => {
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsIncomeTypesIncomeTypeDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.incomeTypes',
                  ) ?? []
                return incomeTypes?.map((incomeTypes) => ({
                  value: incomeTypes.id ?? '',
                  label:
                    (locale === 'is'
                      ? incomeTypes.name
                      : incomeTypes.english ?? incomeTypes.name) ?? '',
                }))
              },
            },
            paymentAmount: {
              component: 'input',
              label: payoutMessages.otherBenefits.paymentAmount,
              width: 'half',
              currency: true,
            },
          },
        }),
        buildDescriptionField({
          id: 'otherBenefits.paymentsFromSicknessAllowance',
          title: payoutMessages.otherBenefits.paymentsFromSicknessAllowance,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'otherBenefits.paymentsFromSicknessAllowance.union',
          title: payoutMessages.otherBenefits.union,
          options: (application, _, locale) => {
            const unions =
              getValueViaPath<GaldurDomainModelsSettingsUnionsUnionDTO[]>(
                application.externalData,
                'unemploymentApplication.data.supportData.unions',
              ) ?? []
            return unions.map((union) => ({
              value: union.id ?? '',
              label:
                (locale === 'is' ? union.name : union.english ?? union.name) ??
                '',
            }))
          },
        }),
        buildDateField({
          id: 'otherBenefits.paymentsFromSicknessAllowance.dateFrom',
          title: payoutMessages.otherBenefits.dateFrom,
          width: 'half',
        }),
        buildDateField({
          id: 'otherBenefits.paymentsFromSicknessAllowance.dateTo',
          title: payoutMessages.otherBenefits.dateTo,
          width: 'half',
        }),
        buildFileUploadField({
          id: 'otherBenefits.paymentsFromSicknessAllowance.file',
          uploadHeader: payoutMessages.otherBenefits.fileHeader,
          uploadDescription: payoutMessages.otherBenefits.fileDescription,
          uploadAccept: '.pdf, .docx, .rtf',
        }),
        buildDescriptionField({
          id: 'otherBenefits.payedFromPrivatePensionFundQuestion',
          title:
            payoutMessages.otherBenefits.payedFromPrivatePensionFundQuestion,
          titleVariant: 'h5',
        }),
        buildAlertMessageField({
          id: 'otherBenefits.payedFromPrivatePensionFundAlertMessage',
          message:
            payoutMessages.otherBenefits
              .payedFromPrivatePensionFundAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginBottom: 0,
        }),
        buildRadioField({
          id: 'otherBenefits.payedFromPrivatePensionFund',
          width: 'half',
          space: 0,
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildFieldsRepeaterField({
          id: 'otherBenefits.payedFromPrivatePensionFundDetails',
          condition: (answers) =>
            getValueViaPath(
              answers,
              'otherBenefits.payedFromPrivatePensionFund',
            ) === YES,
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,
          fields: {
            privatePensionFund: {
              component: 'select',
              label:
                payoutMessages.otherBenefits.payedFromPrivatePensionFundLabel,
              width: 'half',
              options: (application) => {
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsPensionFundsPensionFundDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.privatePensionFunds',
                  ) ?? []
                return incomeTypes?.map((incomeTypes) => ({
                  value: incomeTypes.id ?? '',
                  label: incomeTypes.name ?? '',
                }))
              },
            },
            paymentAmount: {
              component: 'input',
              label: payoutMessages.otherBenefits.amountFromPrivatePensionFund,
              width: 'half',
              currency: true,
            },
          },
        }),
      ],
    }),
  ],
})
