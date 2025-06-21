import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'

const paymentInfoRoute = 'paymentInfoForm'

export const PaymentInfoSubSection =
    buildSubSection({
      id: 'paymentInfo',
      tabTitle: disabilityPensionFormMessage.basicInfo.paymentInfo,
      title: disabilityPensionFormMessage.basicInfo.paymentInfo,
      children: [
        buildMultiField({
          space: 'containerGutter',
          id: paymentInfoRoute,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.basicInfo.paymentInfo,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildAlertMessageField({
              id: `${paymentInfoRoute}.notice`,
              alertType: 'info',
              title: disabilityPensionFormMessage.paymentInfo.noticeTitle,
              message: disabilityPensionFormMessage.paymentInfo.notice,
            }),
            buildRadioField({
              id: `${paymentInfoRoute}.accountType`,
              title: disabilityPensionFormMessage.paymentInfo.accountType,
              width: 'half',
              largeButtons: false,
              required: true,
              backgroundColor: 'white',
              options: [
                {
                  value: 'domestic',
                  label: disabilityPensionFormMessage.paymentInfo.domesticAccount,
                },
                {
                  value: 'foreign',
                  label: disabilityPensionFormMessage.paymentInfo.foreignAccount,
                },
              ],
            }),
            buildTextField({
              id: `${paymentInfoRoute}.bank`,
              title: disabilityPensionFormMessage.paymentInfo.bank,
              backgroundColor: 'blue',
              required: true,
            }),
            buildRadioField({
              id: `${paymentInfoRoute}.useDiscount`,
              title: disabilityPensionFormMessage.paymentInfo.useDiscount,
              width: 'half',
              options: [
                {
                  value: 'yes',
                  label: disabilityPensionFormMessage.paymentInfo.yes,
                },
                {
                  value: 'no',
                  label: disabilityPensionFormMessage.paymentInfo.no,
                },
              ],
            }),
            buildRadioField({
              id: `${paymentInfoRoute}.taxationLevel`,
              title: disabilityPensionFormMessage.paymentInfo.taxationLevel,
              width: 'full',
              options: [
                {
                  value: 'taxationLevelOne',
                  label: disabilityPensionFormMessage.paymentInfo.taxationLevelOptionOne,
                },
                {
                  value: 'taxationLevelTwo',
                  label: disabilityPensionFormMessage.paymentInfo.taxationLevelOptionTwo,
                },
                {
                  value: 'taxationLevelThree',
                  label: disabilityPensionFormMessage.paymentInfo.taxationLevelOptionThree,
                },
              ],
            }),
          ],
        }),
      ],
    })
