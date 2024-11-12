import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildDescriptionField,
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
  buildRadioField,
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
          placeholder: m.securityDeposit.typeSelectionPlaceholder,
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
                SecurityDepositTypeOptions.BANK_GUARANTEE
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
                SecurityDepositTypeOptions.CAPITAL
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
                SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE
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
                SecurityDepositTypeOptions.INSURANCE_COMPANY
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
                SecurityDepositTypeOptions.MUTUAL_FUND
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
              securityDeposit.securityType === SecurityDepositTypeOptions.OTHER
            )
          },
        }),
        buildRadioField({
          id: 'securityDeposit.securityAmount',
          title: m.securityDeposit.amountRadioFieldTitle,
          options: getSecurityAmountOptions,
          width: 'half',
          space: 3,
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
          title: m.securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: m.securityDeposit.mutualFundAmountInfoMessage,
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
          title: m.securityDeposit.securityAmountOtherTitle,
          placeholder: m.securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue

            return (
              securityDeposit &&
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
