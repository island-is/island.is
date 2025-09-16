import {
  buildSubSection,
  buildMultiField,
  buildTextField,
  buildSelectField,
  buildDescriptionField,
  buildAlertMessageField,
  buildHiddenInputWithWatchedValue,
  buildRadioField,
  buildDisplayField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import {
  Routes,
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
} from '../../../utils/enums'
import {
  calculateSecurityDepositAmount,
  securityDepositRequired,
  securityDepositIsBankGuarantee,
  securityDepositIsCapital,
  securityDepositIsInsuranceCompany,
  securityDepositIsLandlordsMutualFund,
  securityDepositIsLandlordsMutualFundOrOther,
  securityDepositIsNotLandlordsMutualFund,
  securityDepositIsOther,
  securityDepositIsThirdPartyGuarantee,
} from '../../../utils/rentalPeriodUtils'
import {
  getSecurityAmountOptions,
  getSecurityDepositTypeOptions,
} from '../../../utils/options'
import * as m from '../../../lib/messages'

export const securityDepositSubsection = buildSubSection({
  condition: securityDepositRequired,
  id: Routes.SECURITYDEPOSIT,
  title: m.misc.securityDeposit,
  children: [
    buildMultiField({
      condition: securityDepositRequired,
      id: Routes.SECURITYDEPOSIT,
      title: m.misc.securityDeposit,
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
          clearOnChange: [
            'securityDeposit.bankGuaranteeInfo',
            'securityDeposit.thirdPartyGuaranteeInfo',
            'securityDeposit.insuranceCompanyInfo',
            'securityDeposit.mutualFundInfo',
            'securityDeposit.otherInfo',
            'securityDeposit.securityAmountOther',
          ],
          placeholder: m.securityDeposit.typeSelectionPlaceholder,
        }),

        // Tegund tryggingar: Bankaábyrgð
        buildTextField({
          id: 'securityDeposit.bankGuaranteeInfo',
          title: m.securityDeposit.bankGuaranteeInfoTitle,
          placeholder: m.securityDeposit.bankGuaranteeInfoPlaceholder,
          condition: securityDepositIsBankGuarantee,
        }),

        // Tegund tryggingar: Tryggingarfé
        buildDescriptionField({
          id: 'securityDeposit.typeCapitalInfo',
          description: m.securityDeposit.capitalBulletPoints,
          condition: securityDepositIsCapital,
          space: 2,
        }),

        // Tegund tryggingar: Sjálfskuldarábyrgð þriðja aðila
        buildTextField({
          id: 'securityDeposit.thirdPartyGuaranteeInfo',
          title: m.securityDeposit.thirdPartyGuaranteeInfoTitle,
          placeholder: m.securityDeposit.thirdPartyGuaranteeInfoPlaceholder,
          condition: securityDepositIsThirdPartyGuarantee,
        }),

        // Tegund tryggingar: Leigugreiðslu- og viðskilnaðartrygging
        buildTextField({
          id: 'securityDeposit.insuranceCompanyInfo',
          title: m.securityDeposit.insuranceCompanyInfoTitle,
          placeholder: m.securityDeposit.insuranceCompanyInfoPlaceholder,
          condition: securityDepositIsInsuranceCompany,
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildTextField({
          id: 'securityDeposit.mutualFundInfo',
          title: m.securityDeposit.mutualFundInfoTitle,
          placeholder: m.securityDeposit.mutualFundInfoPlaceholder,
          condition: securityDepositIsLandlordsMutualFund,
        }),

        // Tegund tryggingar: annað
        buildTextField({
          id: 'securityDeposit.otherInfo',
          title: m.securityDeposit.otherInfoTitle,
          placeholder: m.securityDeposit.otherInfoPlaceholder,
          condition: securityDepositIsOther,
        }),
        buildRadioField({
          id: 'securityDeposit.securityAmount',
          title: m.securityDeposit.amountRadioFieldTitle,
          options: getSecurityAmountOptions,
          clearOnChange: ['securityDeposit.securityAmountOther'],
          width: 'half',
          space: 3,
          condition: securityDepositIsNotLandlordsMutualFund,
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildAlertMessageField({
          id: 'securityDeposit.mutualFundAmountInfo',
          title: m.securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: m.securityDeposit.mutualFundAmountInfoMessage,
          condition: securityDepositIsLandlordsMutualFund,
        }),
        buildTextField({
          id: 'securityDeposit.securityAmountOther',
          title: m.misc.amount,
          placeholder: m.securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
          condition: (answers) =>
            !!securityDepositIsLandlordsMutualFundOrOther(answers),
          maxLength: 14, // 8 char number since the dots, spaces and "kr." counts to the limit
        }),
        buildHiddenInputWithWatchedValue({
          id: 'securityDeposit.rentalAmount',
          watchValue: 'rentalAmount.amount',
        }),
        buildDisplayField({
          id: 'securityDeposit.securityAmountCalculated',
          variant: 'currency',
          label: m.securityDeposit.securityAmountCalculatedLabel,
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
