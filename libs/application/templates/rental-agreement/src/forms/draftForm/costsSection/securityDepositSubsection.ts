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
import { onlyCharacters } from '../../../utils/utils'

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
          condition: securityDepositIsBankGuarantee,
          id: 'securityDeposit.bankGuaranteeInfo',
          title: m.securityDeposit.bankGuaranteeInfoTitle,
          placeholder: m.securityDeposit.bankGuaranteeInfoPlaceholder,
          maxLength: 50,
        }),

        // Tegund tryggingar: Tryggingarfé
        buildDescriptionField({
          condition: securityDepositIsCapital,
          id: 'securityDeposit.typeCapitalInfo',
          description: m.securityDeposit.capitalBulletPoints,
          space: 2,
        }),

        // Tegund tryggingar: Sjálfskuldarábyrgð þriðja aðila
        buildTextField({
          condition: securityDepositIsThirdPartyGuarantee,
          id: 'securityDeposit.thirdPartyGuaranteeInfo',
          title: m.securityDeposit.thirdPartyGuaranteeInfoTitle,
          placeholder: m.securityDeposit.thirdPartyGuaranteeInfoPlaceholder,
          maxLength: 50,
          setOnChange: (optionValue) =>
            onlyCharacters(
              optionValue,
              'securityDeposit.thirdPartyGuaranteeInfo',
            ),
        }),

        // Tegund tryggingar: Leigugreiðslu- og viðskilnaðartrygging
        buildTextField({
          condition: securityDepositIsInsuranceCompany,
          id: 'securityDeposit.insuranceCompanyInfo',
          title: m.securityDeposit.insuranceCompanyInfoTitle,
          placeholder: m.securityDeposit.insuranceCompanyInfoPlaceholder,
          maxLength: 50,
        }),

        // Tegund tryggingar: Gjald í samtryggingarsjóð leigusala
        buildTextField({
          condition: securityDepositIsLandlordsMutualFund,
          id: 'securityDeposit.mutualFundInfo',
          title: m.securityDeposit.mutualFundInfoTitle,
          placeholder: m.securityDeposit.mutualFundInfoPlaceholder,
          maxLength: 50,
        }),

        // Tegund tryggingar: annað
        buildTextField({
          condition: securityDepositIsOther,
          id: 'securityDeposit.otherInfo',
          title: m.securityDeposit.otherInfoTitle,
          placeholder: m.securityDeposit.otherInfoPlaceholder,
          maxLength: 50,
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
          condition: securityDepositIsLandlordsMutualFund,
          id: 'securityDeposit.mutualFundAmountInfo',
          title: m.securityDeposit.mutualFundAmountInfoTitle,
          alertType: 'info',
          message: m.securityDeposit.mutualFundAmountInfoMessage,
        }),
        buildTextField({
          condition: (answers) =>
            !!securityDepositIsLandlordsMutualFundOrOther(answers),
          id: 'securityDeposit.securityAmountOther',
          title: m.misc.amount,
          placeholder: m.securityDeposit.securityAmountOtherPlaceholder,
          variant: 'currency',
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
