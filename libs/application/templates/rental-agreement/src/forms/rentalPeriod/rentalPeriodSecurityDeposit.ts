import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildDescriptionField,
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
} from '../../lib/constants'
import {
  getSecurityDepositTypeOptions,
  getSecurityAmountOptions,
} from '../../lib/utils'
import { securityDeposit } from '../../lib/messages'

export const RentalPeriodSecurityDeposit = buildSubSection({
  id: 'securityDeposit.SecurityDeposit',
  title: securityDeposit.subSectionName,
  children: [
    buildMultiField({
      id: 'securityDeposit.Details',
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
                SecurityDepositTypeOptions.MUTUAL_FUND
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
        buildDescriptionField({
          id: 'securityDeposit.amountTitle',
          title: securityDeposit.amountHeaderTitle,
          titleVariant: 'h3',
          space: 5,
        }),
        buildSelectField({
          id: 'securityDeposit.securityAmount',
          title: securityDeposit.amountSelectionTitle,
          options: getSecurityAmountOptions,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              !securityDeposit ||
              securityDeposit.securityType === undefined ||
              securityDeposit.securityType !==
                SecurityDepositTypeOptions.MUTUAL_FUND
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
                SecurityDepositTypeOptions.MUTUAL_FUND
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
              Boolean(securityDeposit.securityType) &&
              (securityDeposit.securityType ===
                SecurityDepositTypeOptions.MUTUAL_FUND ||
                securityDeposit.securityAmount ===
                  SecurityDepositAmountOptions.OTHER)
            )
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'securityDeposit.rentalAmount',
          watchValue: 'rentalAmount.amount',
        }),
      ],
    }),
  ],
})
