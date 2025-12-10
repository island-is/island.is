import {
  YES,
  buildAlertMessageField,
  buildBankAccountField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { TaxLevelOptions } from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  getTaxOptions,
  getYesNoOptions,
} from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { shouldShowSpouseFields } from '../../../utils/conditionUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'

export const paymentInfoSubSection = buildSubSection({
  id: 'paymentInfoSubSection',
  title: socialInsuranceAdministrationMessage.payment.title,
  children: [
    buildMultiField({
      id: 'paymentInfo',
      title: socialInsuranceAdministrationMessage.payment.title,
      children: [
        buildAlertMessageField({
          id: 'paymentInfo.alertMessage',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message: socialInsuranceAdministrationMessage.payment.alertMessage,
          doesNotRequireAnswer: true,
          alertType: 'info',
        }),
        buildBankAccountField({
          id: 'paymentInfo.bank',
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return { ...bankInfo, bankNumber: bankInfo?.bank }
          },
        }),
        buildRadioField({
          id: 'paymentInfo.personalAllowance',
          title: socialInsuranceAdministrationMessage.payment.personalAllowance,
          options: getYesNoOptions(),
          width: 'half',
          largeButtons: true,
          required: true,
          space: 'containerGutter',
        }),
        buildTextField({
          id: 'paymentInfo.personalAllowanceUsage',
          title:
            socialInsuranceAdministrationMessage.payment
              .personalAllowancePercentage,
          suffix: '%',
          dataTestId: 'personal-allowance-usage',
          condition: (answers) => {
            const { personalAllowance } = getApplicationAnswers(answers)
            return personalAllowance === YES
          },
          placeholder: '1%',
          defaultValue: '100',
          variant: 'number',
          width: 'half',
          maxLength: 4,
        }),
        buildAlertMessageField({
          id: 'paymentInfo.spouseAllowanceAlert',
          title: socialInsuranceAdministrationMessage.shared.alertTitle,
          message:
            socialInsuranceAdministrationMessage.payment.alertSpouseAllowance,
          doesNotRequireAnswer: true,
          alertType: 'info',
          condition: (_, externalData) => shouldShowSpouseFields(externalData),
        }),
        buildRadioField({
          id: 'paymentInfo.taxLevel',
          title: socialInsuranceAdministrationMessage.payment.taxLevel,
          options: getTaxOptions(),
          width: 'full',
          largeButtons: true,
          space: 'containerGutter',
          defaultValue: TaxLevelOptions.INCOME,
        }),
      ],
    }),
  ],
})
