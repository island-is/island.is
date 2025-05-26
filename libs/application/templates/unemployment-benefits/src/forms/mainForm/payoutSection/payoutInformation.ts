import {
  buildTextField,
  buildMultiField,
  buildSubSection,
  buildSelectField,
  buildCheckboxField,
  getValueViaPath,
  coreMessages,
  YES,
  NO,
  buildRadioField,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import {
  GaldurDomainModelsSettingsUnionsUnionDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
} from '@island.is/clients/vmst-unemployment'

export const payoutInformationSubSection = buildSubSection({
  id: 'payoutInformationSubSection',
  title: payoutMessages.payoutInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'payoutInformationSubSection',
      title: payoutMessages.payoutInformation.pageTitle,
      children: [
        //TODO split into 3 fields
        buildTextField({
          title: payoutMessages.payoutInformation.accountBankNumber,
          id: 'payout.bankNumber',
          dataTestId: 'bank-account-number',
          readOnly: true,
          format: '####-##-######',
          placeholder: '0000-00-000000',
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                bankInfo?: string
              }
            )?.bankInfo,
        }),
        buildRadioField({
          id: 'payout.payToUnion',
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
        buildSelectField({
          id: 'payout.union',
          title: payoutMessages.payoutInformation.unionLabel,
          options: (application: Application) => {
            const unionOptions =
              getValueViaPath<Array<GaldurDomainModelsSettingsUnionsUnionDTO>>(
                application.externalData,
                'unemploymentApplication.data.supportData.unions',
                [],
              ) || []
            return unionOptions.map((option) => ({
              label: option.name || '',
              value: option.id || '',
            }))
          },
          condition: (answers) => {
            const payToUnion = getValueViaPath<string>(
              answers,
              'payout.payToUnion',
              NO,
            )
            return payToUnion === YES
          },
        }),

        buildSelectField({
          id: 'payout.pensionFund',
          title: payoutMessages.payoutInformation.pensionFundLabel,
          options: (application: Application) => {
            const pensionFundOptions =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.pensionFunds',
                [],
              ) || []
            return pensionFundOptions.map((option) => ({
              label: option.name || '',
              value: option.id || '',
            }))
          },
        }),

        buildSelectField({
          id: 'payout.privatePensionFund',
          title: payoutMessages.payoutInformation.pensionFundLabel,
          width: 'half',
          options: (application: Application) => {
            const pensionFundOptions =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsPensionFundsPensionFundDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.privatePensionFunds',
                [],
              ) || []
            return pensionFundOptions.map((option) => ({
              label: option.name || '',
              value: option.id || '',
            }))
          },
        }),
        buildSelectField({
          id: 'payout.privatePensionFundPercentage',
          title:
            payoutMessages.payoutInformation.privatePensionFundPercentageLabel,
          width: 'half',
          options: (application: Application) => {
            return [
              {
                label: '4%',
                value: '4',
              },
              {
                label: '2%',
                value: '2',
              },
            ]
          },
        }),
      ],
    }),
  ],
})
