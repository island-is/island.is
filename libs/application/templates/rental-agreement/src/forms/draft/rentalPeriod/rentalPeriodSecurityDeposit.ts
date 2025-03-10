import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildDescriptionField,
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
  buildRadioField,
  getValueViaPath,
  buildDisplayField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
  Routes,
  AnswerOptions,
} from '../../../lib/constants'
import {
  getSecurityDepositTypeOptions,
  getSecurityAmountOptions,
} from '../../../lib/utils'
import { securityDeposit } from '../../../lib/messages'

export const RentalPeriodSecurityDeposit = buildSubSection({
  condition: (answers) => {
    const securityDeposit = getValueViaPath<Array<string>>(
      answers,
      'rentalAmount.isPaymentInsuranceRequired',
    )
    return securityDeposit?.includes(AnswerOptions.YES) || false
  },
  id: Routes.SECURITYDEPOSIT,
  title: securityDeposit.subSectionName,
  children: [
    buildMultiField({
      condition: (answers) => {
        const securityDeposit = getValueViaPath<Array<string>>(
          answers,
          'rentalAmount.isPaymentInsuranceRequired',
        )
        return securityDeposit?.includes(AnswerOptions.YES) || false
      },
      id: Routes.SECURITYDEPOSIT,
      title: securityDeposit.pageTitle,
      description: securityDeposit.pageDescription,
      children: [
        buildDescriptionField({
          id: 'securityDeposit.TypeHeader',
          title: securityDeposit.typeHeaderTitle,
          titleTooltip: securityDeposit.typeHeaderToolTip,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'securityDeposit.securityType',
          title: securityDeposit.typeSelectionTitle,
          options: getSecurityDepositTypeOptions,
          clearOnChange: [
            'securityDeposit.bankGuaranteeInfo',
            'securityDeposit.thirdPartyGuaranteeInfo',
            'securityDeposit.insuranceCompanyInfo',
            'securityDeposit.mutualFundInfo',
            'securityDeposit.otherInfo',
          ],
          placeholder: securityDeposit.typeSelectionPlaceholder,
        }),

        // Tegund tryggingar: Bankaábyrgð
        buildTextField({
          id: 'securityDeposit.bankGuaranteeInfo',
          title: securityDeposit.bankGuaranteeInfoTitle,
          placeholder: securityDeposit.bankGuaranteeInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.BANK_GUARANTEE
            )
          },
        }),

        // Tegund tryggingar: Tryggingarfé
        buildDescriptionField({
          id: 'securityDeposit.typeCapitalInfo',
          title: '',
          description: securityDeposit.capitalBulletPoints,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.CAPITAL
            )
          },
          space: 2,
        }),

        // Tegund tryggingar: Sjálfskuldarábyrgð þriðja aðila
        buildTextField({
          id: 'securityDeposit.thirdPartyGuaranteeInfo',
          title: securityDeposit.thirdPartyGuaranteeInfoTitle,
          placeholder: securityDeposit.thirdPartyGuaranteeInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE
            )
          },
        }),

        // Tegund tryggingar: Leigugreiðslu- og viðskilnaðartrygging
        buildTextField({
          id: 'securityDeposit.insuranceCompanyInfo',
          title: securityDeposit.insuranceCompanyInfoTitle,
          placeholder: securityDeposit.insuranceCompanyInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.INSURANCE_COMPANY
            )
          },
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildTextField({
          id: 'securityDeposit.mutualFundInfo',
          title: securityDeposit.mutualFundInfoTitle,
          placeholder: securityDeposit.mutualFundInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
            )
          },
        }),

        // Tegund tryggingar: annað
        buildTextField({
          id: 'securityDeposit.otherInfo',
          title: securityDeposit.otherInfoTitle,
          placeholder: securityDeposit.otherInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType === SecurityDepositTypeOptions.OTHER
            )
          },
        }),
        buildRadioField({
          id: 'securityDeposit.securityAmount',
          title: securityDeposit.amountRadioFieldTitle,
          options: getSecurityAmountOptions,
          clearOnChange: ['securityDeposit.securityAmountOther'],
          width: 'half',
          space: 3,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              !securityDeposit ||
              securityDeposit.securityType === undefined ||
              securityDeposit.securityType !==
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
            )
          },
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildAlertMessageField({
          id: 'securityDeposit.mutualFundAmountInfo',
          title: securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: securityDeposit.mutualFundAmountInfoMessage,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
            )
          },
        }),
        buildTextField({
          id: 'securityDeposit.securityAmountOther',
          title: securityDeposit.securityAmountOtherTitle,
          placeholder: securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue

            return (
              securityDeposit &&
              (securityDeposit.securityType ===
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND ||
                securityDeposit.securityAmount ===
                  SecurityDepositAmountOptions.OTHER)
            )
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'securityDeposit.rentalAmount',
          watchValue: 'rentalAmount.amount',
        }),
        buildDisplayField({
          id: 'securityDeposit.securityAmountCalculated',
          title: '',
          variant: 'currency',
          label: securityDeposit.securityAmountCalculatedLabel,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              securityDeposit.securityAmount !=
                SecurityDepositAmountOptions.OTHER &&
              securityDeposit &&
              securityDeposit.securityType !=
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
            )
          },
          value: (answers: FormValue) => {
            const rentalAmount = getValueViaPath<string>(
              answers,
              'securityDeposit.rentalAmount',
            )
            const securityAmount = getValueViaPath<string>(
              answers,
              'securityDeposit.securityAmount',
            )

            const monthMapping = {
              [SecurityDepositAmountOptions.ONE_MONTH]: 1,
              [SecurityDepositAmountOptions.TWO_MONTHS]: 2,
              [SecurityDepositAmountOptions.THREE_MONTHS]: 3,
            }

            const months = securityAmount
              ? monthMapping[securityAmount as keyof typeof monthMapping]
              : 0
            return (parseInt(rentalAmount ?? '0') * months).toString()
          },
        }),
      ],
    }),
  ],
})
