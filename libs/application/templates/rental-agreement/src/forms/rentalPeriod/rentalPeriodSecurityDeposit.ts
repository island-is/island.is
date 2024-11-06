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
  securityDepositTypeOptions,
  securityDepositAmountOptions,
} from '../../lib/constants'
import {
  getSecurityDepositTypeOptions,
  getSecurityAmountOptions,
} from '../../lib/utils'
import * as m from '../../lib/messages'

export const RentalPeriodSecurityDeposit = buildSubSection({
  id: 'securityDeposit.SecurityDeposit',
  title: m.securityDeposit.subSectionName,
  children: [
    buildMultiField({
      id: 'securityDeposit.Details',
      title: m.securityDeposit.pageTitle,
      description: m.securityDeposit.pageDescription,
      children: [
        buildDescriptionField({
          id: 'securityDeposit.TypeHeader',
          title: m.securityDeposit.typeHeaderTitle,
          titleTooltip: m.securityDeposit.typeHeaderToolTip,
          titleVariant: 'h3',
        }),
        buildSelectField({
          id: 'securityDeposit.securityType',
          title: m.securityDeposit.typeSelectionTitle,
          options: getSecurityDepositTypeOptions,
        }),

        // Tegund tryggingar: Bankaábyrgð
        buildTextField({
          id: 'securityDeposit.bankGuaranteeInfo',
          title: m.securityDeposit.bankGuaranteeInfoTitle,
          placeholder: m.securityDeposit.bankGuaranteeInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.BANK_GUARANTEE
            )
          },
        }),

        // Tegund tryggingar: Tryggingarfé
        buildDescriptionField({
          id: 'securityDeposit.typeCapitalInfo',
          title: '',
          description: m.securityDeposit.capitalBulletPoints,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.CAPITAL
            )
          },
          space: 2,
        }),

        // Tegund tryggingar: Sjálfskuldarábyrgð þriðja aðila
        buildTextField({
          id: 'securityDeposit.thirdPartyGuaranteeInfo',
          title: m.securityDeposit.thirdPartyGuaranteeInfoTitle,
          placeholder: m.securityDeposit.thirdPartyGuaranteeInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.THIRD_PARTY_GUARANTEE
            )
          },
        }),

        // Tegund tryggingar: Leigugreiðslu- og viðskilnaðartrygging
        buildTextField({
          id: 'securityDeposit.insuranceCompanyInfo',
          title: m.securityDeposit.insuranceCompanyInfoTitle,
          placeholder: m.securityDeposit.insuranceCompanyInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.INSURANCE_COMPANY
            )
          },
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildTextField({
          id: 'securityDeposit.mutualFundInfo',
          title: m.securityDeposit.mutualFundInfoTitle,
          placeholder: m.securityDeposit.mutualFundInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.MUTUAL_FUND
            )
          },
        }),

        // Tegund tryggingar: annað
        buildTextField({
          id: 'securityDeposit.otherInfo',
          title: m.securityDeposit.otherInfoTitle,
          placeholder: m.securityDeposit.otherInfoPlaceholder,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType === securityDepositTypeOptions.OTHER
            )
          },
        }),
        buildDescriptionField({
          id: 'securityDeposit.amountTitle',
          title: m.securityDeposit.amountHeaderTitle,
          titleVariant: 'h3',
          space: 5,
        }),
        buildSelectField({
          id: 'securityDeposit.securityAmount',
          title: m.securityDeposit.amountSelectionTitle,
          options: getSecurityAmountOptions,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              !securityDeposit ||
              securityDeposit.securityType === undefined ||
              securityDeposit.securityType !==
                securityDepositTypeOptions.MUTUAL_FUND
            )
          },
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildAlertMessageField({
          id: 'securityDeposit.mutualFundAmountInfo',
          title: m.securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: m.securityDeposit.mutualFundAmountInfoMessage,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              securityDeposit.securityType ===
                securityDepositTypeOptions.MUTUAL_FUND
            )
          },
        }),
        buildTextField({
          id: 'securityDeposit.securityAmountOther',
          title: m.securityDeposit.securityAmountOtherTitle,
          placeholder: m.securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue

            return (
              securityDeposit &&
              Boolean(securityDeposit.securityType) &&
              (securityDeposit.securityType ===
                securityDepositTypeOptions.MUTUAL_FUND ||
                securityDeposit.securityAmount ===
                  securityDepositAmountOptions.OTHER)
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
