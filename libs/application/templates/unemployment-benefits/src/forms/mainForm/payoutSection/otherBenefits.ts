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
} from '@island.is/clients/vmst-unemployment'
import {
  SICKNESS_PAYMENTS_TYPE_ID,
  SUPPLEMENTARY_FUND_TYPE_ID,
  INSURANCE_PAYMENTS_TYPE_ID,
} from '../../../shared/constants'

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
                console.log('incomeTypes', incomeTypes)
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
              label: payoutMessages.otherBenefits.typeOfPayment,
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
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
            payer: {
              component: 'select',
              label: payoutMessages.otherBenefits.payer,
              required: true,
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return (
                  activeField.typeOfPayment === SUPPLEMENTARY_FUND_TYPE_ID ||
                  activeField.typeOfPayment === SICKNESS_PAYMENTS_TYPE_ID
                )
              },
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

                return activeField.typeOfPayment === SUPPLEMENTARY_FUND_TYPE_ID
              },
            },
            paymentAmount: {
              component: 'input',
              label: payoutMessages.otherBenefits.paymentAmount,
              currency: true,
              type: 'number',
              required: true,
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

                return activeField.typeOfPayment === SICKNESS_PAYMENTS_TYPE_ID
              },
            },
            dateTo: {
              component: 'date',
              required: true,
              label: payoutMessages.otherBenefits.dateFrom,
              width: 'half',
              condition: (application, activeField, _) => {
                if (!activeField) {
                  return false
                }

                return activeField.typeOfPayment === SICKNESS_PAYMENTS_TYPE_ID
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

                return activeField.typeOfPayment === SICKNESS_PAYMENTS_TYPE_ID
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

                return activeField.typeOfPayment === INSURANCE_PAYMENTS_TYPE_ID
              },
            },
          },
        }),
      ],
    }),
  ],
})
