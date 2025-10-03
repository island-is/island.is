import {
  buildMultiField,
  buildSubSection,
  buildSelectField,
  getValueViaPath,
  coreMessages,
  YES,
  NO,
  buildRadioField,
  buildBankAccountField,
  buildAlertMessageField,
  buildDescriptionField,
  buildCustomField,
} from '@island.is/application/core'
import { payout as payoutMessages } from '../../../lib/messages'
import { Application } from '@island.is/application/types'
import {
  GaldurDomainModelsSettingsUnionsUnionDTO,
  GaldurDomainModelsSettingsPensionFundsPensionFundDTO,
} from '@island.is/clients/vmst-unemployment'
import {
  doesNotpayToUnion,
  payPrivatePensionFund,
  payToUnion,
} from '../../../utils'

export const payoutInformationSubSection = buildSubSection({
  id: 'payoutInformationSubSection',
  title: payoutMessages.payoutInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'payoutInformationSubSection',
      title: payoutMessages.payoutInformation.pageTitle,
      children: [
        buildBankAccountField({
          id: 'payout.bankAccount',
          title: payoutMessages.payoutInformation.accountLabel,
          titleVariant: 'h5',
          defaultValue: (application: Application) => {
            const bankInfo = getValueViaPath<string>(
              application.externalData,
              'userProfile.data.bankInfo',
              '',
            )
            return bankInfo
          },
        }),
        buildDescriptionField({
          id: 'payout.payToUnionDescription',
          title: payoutMessages.payoutInformation.unionQuestion,
          titleVariant: 'h5',
          space: 0,
        }),
        buildRadioField({
          id: 'payout.payToUnion',
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
        buildAlertMessageField({
          id: 'payout.unionAlert',
          title: payoutMessages.payoutInformation.unionAlertTitle,
          message: payoutMessages.payoutInformation.unionAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: doesNotpayToUnion,
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
          condition: payToUnion,
        }),
        buildDescriptionField({
          id: 'payout.pensionDescription',
          title: payoutMessages.payoutInformation.pensionFundLabel,
          titleVariant: 'h5',
          marginTop: 2,
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
        buildDescriptionField({
          id: 'payout.privatePensionFundDescription',
          title: payoutMessages.payoutInformation.privatePensionFundQuestion,
          titleVariant: 'h5',
          marginTop: 2,
        }),
        buildRadioField({
          id: 'payout.payPrivatePensionFund',
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
        buildSelectField({
          id: 'payout.privatePensionFund',
          title: payoutMessages.payoutInformation.privatePensionFundLabel,
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
          condition: payPrivatePensionFund,
        }),
        buildSelectField({
          id: 'payout.privatePensionFundPercentage',
          title:
            payoutMessages.payoutInformation.privatePensionFundPercentageLabel,
          width: 'half',
          options: (_application: Application) => {
            const privatePensionFundPercents =
              getValueViaPath<Array<number>>(
                _application.externalData,
                'unemploymentApplication.data.supportData.privatePensionFundPercents',
                [],
              ) ?? []
            return privatePensionFundPercents.map((percent) => ({
              value: percent.toString(),
              label: `${percent}%`,
            }))
          },
          condition: payPrivatePensionFund,
        }),
        buildAlertMessageField({
          id: 'payout.privatePensionFundAlert',
          title: payoutMessages.payoutInformation.unionAlertTitle,
          message:
            payoutMessages.payoutInformation
              .privatePensionFundPercentageAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: payPrivatePensionFund,
        }),

        buildCustomField({
          id: 'payout.validation',
          component: 'PaymentInformationValidation',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
