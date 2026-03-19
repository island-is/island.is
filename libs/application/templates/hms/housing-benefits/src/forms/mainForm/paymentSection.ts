import {
  buildBankAccountField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { getLandlordOptionsForSelectedContract } from '../../utils/rentalAgreementUtils'
import {
  isLandlordSelected,
  isMeSelected,
  shouldShowLandlordSelection,
} from '../../utils/utils'

export const paymentSection = buildSection({
  id: 'paymentSection',
  title: m.draftMessages.paymentSection.title,
  children: [
    buildMultiField({
      id: 'paymentMultiField',
      title: m.draftMessages.paymentSection.multiFieldTitle,
      description: m.draftMessages.paymentSection.multiFieldDescription,
      children: [
        buildRadioField({
          condition: (answers) => {
            console.log('answers: ', answers)
            return true
          },
          id: 'payment.paymentRadio',
          title: m.draftMessages.paymentSection.paymentRadioTitle,
          titleVariant: 'h3',
          clearOnChange: [
            'payment.landlordSelection',
            'payment.landlordBankAccount',
          ],
          options: [
            {
              label: m.draftMessages.paymentSection.optionMe,
              value: 'me',
            },
            {
              label: m.draftMessages.paymentSection.optionLandlord,
              value: 'landlord',
            },
          ],
          marginBottom: 4,
        }),
        buildBankAccountField({
          id: 'payment.bankAccount',
          title: m.draftMessages.paymentSection.bankAccountTitle,
          condition: isMeSelected,
          required: true,
        }),
        buildRadioField({
          id: 'payment.landlordSelection',
          title: m.draftMessages.paymentSection.landlordSelectionTitle,
          titleVariant: 'h3',
          marginBottom: 4,
          condition: shouldShowLandlordSelection,
          options: (application) =>
            getLandlordOptionsForSelectedContract(application),
          required: true,
        }),
        buildBankAccountField({
          id: 'payment.landlordBankAccount',
          title: m.draftMessages.paymentSection.landlordBankAccountTitle,
          titleVariant: 'h3',
          condition: isLandlordSelected,
          required: true,
        }),
      ],
    }),
  ],
})
