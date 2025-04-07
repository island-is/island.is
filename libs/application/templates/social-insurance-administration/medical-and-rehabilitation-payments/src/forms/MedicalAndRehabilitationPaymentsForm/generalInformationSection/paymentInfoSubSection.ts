import {
  buildAlertMessageField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { getBankIsk } from '@island.is/application/templates/social-insurance-administration-core/lib/socialInsuranceAdministrationUtils'
import { Application } from '@island.is/application/types'
import { getApplicationExternalData } from '../../../lib/medicalAndRehabilitationPaymentsUtils'

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
        buildTextField({
          id: 'paymentInfo.bank',
          title: socialInsuranceAdministrationMessage.payment.bank,
          format: '####-##-######',
          placeholder: '0000-00-000000',
          defaultValue: (application: Application) => {
            const { bankInfo } = getApplicationExternalData(
              application.externalData,
            )
            return getBankIsk(bankInfo)
          },
        }),
      ],
    }),
  ],
})
