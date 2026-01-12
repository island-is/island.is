import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
  YesOrNoEnum,
} from '@island.is/application/core'
import {
  payout as payoutMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import {
  GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
  GaldurDomainModelsSettingsUnionsUnionDTO,
} from '@island.is/clients/vmst-unemployment'
import { PaymentTypeIds } from '../../../shared/constants'

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
          id: 'otherBenefits.paymentsDescription',
          title: payoutMessages.otherBenefits.paymentsDescription,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'otherBenefits.receivingBenefits',
          width: 'half',
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
          id: 'otherBenefits.payments',
          minRows: 1,
          formTitleNumbering: 'none',
          marginTop: 0,
          condition: (answers) => {
            const receivingBenefits =
              getValueViaPath<string>(
                answers,
                'otherBenefits.receivingBenefits',
                '',
              ) ?? ''

            return receivingBenefits === YesOrNoEnum.YES
          },
          fields: {
            typeOfPayment: {
              component: 'select',
              label: payoutMessages.otherBenefits.typeOfPayment,
              required: true,
              options: (application, _, locale) => {
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.incomeTypeCategories',
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
            subType: {
              component: 'select',
              label: payoutMessages.otherBenefits.subTypeOfPayment,
              required: true,
              condition: (application, activeField, _) => {
                if (
                  !activeField ||
                  activeField.typeOfPayment ===
                    PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID
                ) {
                  return false
                }
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.incomeTypeCategories',
                  ) ?? []
                const subTypes = incomeTypes.find(
                  (x) => x.id === activeField.typeOfPayment,
                )?.incomeTypes

                return !!subTypes && subTypes.length > 0
              },
              options: (application, activeField, locale) => {
                if (!activeField) {
                  return []
                }
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsIncomeTypesIncomeTypeCategoryDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.incomeTypeCategories',
                  ) ?? []
                return (
                  incomeTypes
                    ?.find((x) => x.id === activeField.typeOfPayment)
                    ?.incomeTypes?.map((subType) => ({
                      value: subType.id ?? '',
                      label:
                        (locale === 'is'
                          ? subType.name
                          : subType.english ?? subType.name) ?? '',
                    })) ?? []
                )
              },
            },
            privatePensionFund: {
              component: 'select',
              label: payoutMessages.otherBenefits.privatePensionFundPayer,
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.SUPPLEMENTARY_FUND_TYPE_ID
                )
              },
              options: (application) => {
                const privatePensionFunds =
                  getValueViaPath<
                    GaldurDomainModelsSettingsPensionFundsPensionFundDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.privatePensionFunds',
                  ) ?? []

                return privatePensionFunds?.map((fund) => ({
                  value: fund.id ?? '',
                  label: fund.name ?? '',
                }))
              },
            },
            pensionFund: {
              component: 'select',
              label: payoutMessages.otherBenefits.pensionFundPayer,
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.PENSION_FUND_TYPE_ID
                )
              },
              options: (application) => {
                const pensionFunds =
                  getValueViaPath<
                    GaldurDomainModelsSettingsPensionFundsPensionFundDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.pensionFunds',
                  ) ?? []

                return pensionFunds
                  ?.filter((x) => x.visibleInIncomeEntryOnWeb)
                  .map((fund) => ({
                    value: fund.id ?? '',
                    label: fund.name ?? '',
                  }))
              },
            },
            union: {
              component: 'select',
              label: payoutMessages.otherBenefits.unionPayer,
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID
                )
              },
              options: (application) => {
                const unions =
                  getValueViaPath<GaldurDomainModelsSettingsUnionsUnionDTO[]>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.unions',
                  ) ?? []

                return unions?.map((union) => ({
                  value: union.id ?? '',
                  label: union.name ?? '',
                }))
              },
            },
            privatePensionAlert: {
              component: 'alertMessage',
              alertType: 'info',
              message:
                payoutMessages.otherBenefits
                  .payedFromPrivatePensionFundAlertMessage,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.SUPPLEMENTARY_FUND_TYPE_ID
                )
              },
            },
            paymentAmount: {
              component: 'input',
              label: payoutMessages.otherBenefits.paymentAmount,
              currency: true,
              type: 'number',
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment !==
                    PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID &&
                  activeField.subType !== PaymentTypeIds.REHAB_PENSION_ID &&
                  activeField.subType !== PaymentTypeIds.SPOUSE_PENSION
                )
              },
            },
            dateFrom: {
              component: 'date',
              required: true,
              label: payoutMessages.otherBenefits.dateFrom,
              width: 'half',
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                    PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID ||
                  activeField.subType === PaymentTypeIds.REHAB_PENSION_ID
                )
              },
            },
            dateTo: {
              component: 'date',
              required: true,
              label: payoutMessages.otherBenefits.dateTo,
              width: 'half',
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                    PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID ||
                  activeField.subType === PaymentTypeIds.REHAB_PENSION_ID
                )
              },
            },
            sicknessAllowanceFile: {
              component: 'fileUpload',
              required: true,
              uploadHeader:
                payoutMessages.otherBenefits.sickessAllowanceFileHeader,
              uploadDescription: applicationMessages.fileUploadAcceptFiles,
              uploadMultiple: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.SICKNESS_PAYMENTS_TYPE_ID
                )
              },
            },
            paymentPlanFile: {
              component: 'fileUpload',
              required: true,
              uploadHeader: payoutMessages.otherBenefits.paymentPlanFileHeader,
              uploadDescription: applicationMessages.fileUploadAcceptFiles,
              uploadMultiple: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment ===
                  PaymentTypeIds.INSURANCE_PAYMENTS_TYPE_ID
                )
              },
            },
          },
        }),
      ],
    }),
  ],
})
