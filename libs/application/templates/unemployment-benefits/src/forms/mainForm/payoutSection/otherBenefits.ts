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
import { payout as payoutMessages } from '../../../lib/messages'
import {
  GaldurDomainModelsSettingsIncomeTypesIncomeTypeDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
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
            payer: {
              component: 'select',
              label: payoutMessages.otherBenefits.payer,
              options: (application) => {
                const incomeTypes =
                  getValueViaPath<
                    GaldurDomainModelsSettingsPensionFundsPensionFundDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.privatePensionFunds',
                  ) ?? []

                // TODO get other payment types and mix together in one list
                return incomeTypes?.map((incomeTypes) => ({
                  value: incomeTypes.id ?? '',
                  label: incomeTypes.name ?? '',
                }))
              },
            },
            paymentAmount: {
              component: 'input',
              label: payoutMessages.otherBenefits.paymentAmount,
              currency: true,
              type: 'number',
            },
          },
        }),

        //TODO move this into repeater field when api is ready
        // buildDateField({
        //   id: 'otherBenefits.paymentsFromSicknessAllowance.dateFrom',
        //   title: payoutMessages.otherBenefits.dateFrom,
        //   width: 'half',
        // }),
        // buildDateField({
        //   id: 'otherBenefits.paymentsFromSicknessAllowance.dateTo',
        //   title: payoutMessages.otherBenefits.dateTo,
        //   width: 'half',
        // }),
        // buildFileUploadField({
        //   id: 'otherBenefits.paymentsFromSicknessAllowance.file',
        //   uploadHeader: payoutMessages.otherBenefits.fileHeader,
        //   uploadDescription: payoutMessages.otherBenefits.fileDescription,
        //   uploadAccept: UPLOAD_ACCEPT,
        //   maxSize: FILE_SIZE_LIMIT,
        // }),
        // buildAlertMessageField({
        //   id: 'otherBenefits.payedFromPrivatePensionFundAlertMessage',
        //   message:
        //     payoutMessages.otherBenefits
        //       .payedFromPrivatePensionFundAlertMessage,
        //   alertType: 'info',
        //   doesNotRequireAnswer: true,
        //   marginBottom: 0,
        // }),
      ],
    }),
  ],
})
