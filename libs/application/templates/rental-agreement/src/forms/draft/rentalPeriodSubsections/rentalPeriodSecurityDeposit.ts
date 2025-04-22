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
} from '../../../utils/constants'
import {
  getSecurityDepositTypeOptions,
  getSecurityAmountOptions,
} from '../../../utils/utils'
import { securityDeposit } from '../../../lib/messages'
import {
  calculateSecurityDepositAmount,
  isPaymentInsuranceRequired,
  securityDepositIsBankGuarantee,
  securityDepositIsCapital,
  securityDepositIsInsuranceCompany,
  securityDepositIsLandlordsMutualFund,
  securityDepositIsLandlordsMutualFundOrOther,
  securityDepositIsNotLandlordsMutualFund,
  securityDepositIsOther,
  securityDepositIsThirdPartyGuarantee,
} from '../../../utils/rentalPeriodUtils'

export const RentalPeriodSecurityDeposit = buildSubSection({
  condition: isPaymentInsuranceRequired,
  id: Routes.SECURITYDEPOSIT,
  title: securityDeposit.subSectionName,
  children: [
    buildMultiField({
      condition: isPaymentInsuranceRequired,
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
          condition: securityDepositIsBankGuarantee,
        }),

        // Tegund tryggingar: Tryggingarfé
        buildDescriptionField({
          id: 'securityDeposit.typeCapitalInfo',
          description: securityDeposit.capitalBulletPoints,
          condition: securityDepositIsCapital,
          space: 2,
        }),

        // Tegund tryggingar: Sjálfskuldarábyrgð þriðja aðila
        buildTextField({
          id: 'securityDeposit.thirdPartyGuaranteeInfo',
          title: securityDeposit.thirdPartyGuaranteeInfoTitle,
          placeholder: securityDeposit.thirdPartyGuaranteeInfoPlaceholder,
          condition: securityDepositIsThirdPartyGuarantee,
        }),

        // Tegund tryggingar: Leigugreiðslu- og viðskilnaðartrygging
        buildTextField({
          id: 'securityDeposit.insuranceCompanyInfo',
          title: securityDeposit.insuranceCompanyInfoTitle,
          placeholder: securityDeposit.insuranceCompanyInfoPlaceholder,
          condition: securityDepositIsInsuranceCompany,
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildTextField({
          id: 'securityDeposit.mutualFundInfo',
          title: securityDeposit.mutualFundInfoTitle,
          placeholder: securityDeposit.mutualFundInfoPlaceholder,
          condition: securityDepositIsLandlordsMutualFund,
        }),

        // Tegund tryggingar: annað
        buildTextField({
          id: 'securityDeposit.otherInfo',
          title: securityDeposit.otherInfoTitle,
          placeholder: securityDeposit.otherInfoPlaceholder,
          condition: securityDepositIsOther,
        }),
        buildRadioField({
          id: 'securityDeposit.securityAmount',
          title: securityDeposit.amountRadioFieldTitle,
          options: getSecurityAmountOptions,
          clearOnChange: ['securityDeposit.securityAmountOther'],
          width: 'half',
          space: 3,
          condition: securityDepositIsNotLandlordsMutualFund,
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildAlertMessageField({
          id: 'securityDeposit.mutualFundAmountInfo',
          title: securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: securityDeposit.mutualFundAmountInfoMessage,
          condition: securityDepositIsLandlordsMutualFund,
        }),
        buildTextField({
          id: 'securityDeposit.securityAmountOther',
          title: securityDeposit.securityAmountOtherTitle,
          placeholder: securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
          condition: (answers) =>
            !!securityDepositIsLandlordsMutualFundOrOther(answers),
        }),
        buildHiddenInputWithWatchedValue({
          id: 'securityDeposit.rentalAmount',
          watchValue: 'rentalAmount.amount',
        }),
        buildDisplayField({
          id: 'securityDeposit.securityAmountCalculated',
          variant: 'currency',
          label: securityDeposit.securityAmountCalculatedLabel,
          condition: (answers) => {
            const securityDeposit = answers.securityDeposit as FormValue
            return (
              securityDeposit &&
              securityDeposit.securityAmount !==
                SecurityDepositAmountOptions.OTHER &&
              securityDeposit &&
              securityDeposit.securityType !==
                SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND
            )
          },
          value: calculateSecurityDepositAmount,
        }),
      ],
    }),
  ],
})
