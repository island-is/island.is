import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildDescriptionField,
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
} from '@island.is/application/core'

import * as m from '../../lib/messages'
import { FormValue } from '@island.is/application/types'

const messages = m.prerequisites.intro

const securityDepositTypes = [
  {
    label: m.securityDeposit.typeSelectionBankGuaranteeTitle,
    value: 'bankGuarantee',
  },
  {
    label: m.securityDeposit.typeSelectionCapitalTitle,
    value: 'capital',
  },
  {
    label: m.securityDeposit.typeSelectionThirdPartyGuaranteeTitle,
    value: 'thirdPartyGuarantee',
  },
  {
    label: m.securityDeposit.typeSelectionInsuranceCompanyTitle,
    value: 'insuranceCompany',
  },
  {
    label: m.securityDeposit.typeSelectionMutualFundTitle,
    value: 'mutualFund',
  },
  {
    label: m.securityDeposit.typeSelectionOtherTitle,
    value: 'other',
  },
]

const rentalAmountDetails = [
  {
    label: m.securityDeposit.amountSelection1Month,
    value: '1 month',
  },
  {
    label: m.securityDeposit.amountSelection2Month,
    value: '2 months',
  },
  {
    label: m.securityDeposit.amountSelection3Month,
    value: '3 months',
  },
  {
    label: m.securityDeposit.amountSelectionOther,
    value: 'other',
  },
]

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
          options: securityDepositTypes,
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
              securityDeposit.securityType === 'bankGuarantee'
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
              securityDeposit.securityType === 'capital'
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
              securityDeposit.securityType === 'thirdPartyGuarantee'
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
              securityDeposit.securityType === 'insuranceCompany'
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
              securityDeposit.securityType === 'mutualFund'
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
              securityDeposit.securityType === 'other'
            )
          },
        }),
        buildDescriptionField({
          id: 'securityDeposit.amountTitle',
          title: m.securityDeposit.amountHeaderTitle,
          titleTooltip: m.securityDeposit.amountHeaderToolTip,
          titleVariant: 'h3',
          space: 5,
        }),
        buildSelectField({
          id: 'securityDeposit.securityAmount',
          title: m.securityDeposit.amountSelectionTitle,
          options: rentalAmountDetails,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              !securityDeposit ||
              securityDeposit.securityType === undefined ||
              securityDeposit.securityType !== 'mutualFund'
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
              securityDeposit.securityType === 'mutualFund'
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
              (securityDeposit.securityType === 'mutualFund' ||
                securityDeposit.securityAmount === 'other')
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
