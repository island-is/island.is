import { useFormContext, Controller } from 'react-hook-form'
import { format, InputMask } from '@react-input/mask'

import { AlertMessage, Box, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { bankTransfer } from '../../messages'
import { validateBankAccountNumber } from './BankTransferPayment.utils'

interface BankTransferPaymentInput {
  bankAccountNumber: string
}

const BANK_ACCOUNT_MASK = '____-__-______'
const MASK_REPLACEMENT = { _: /\d/ }

// The form stores unmasked digits; the input displays the masked value.
const toMaskedValue = (value: string | undefined) =>
  format((value ?? '').replace(/\D/g, ''), {
    mask: BANK_ACCOUNT_MASK,
    replacement: MASK_REPLACEMENT,
  })

/**
 * The body shown between the {@link PaymentSelector} and the submit button when the user has
 * selected the bank-transfer method.
 */
export const BankTransferPayment = () => {
  const { control, formState } = useFormContext<BankTransferPaymentInput>()
  const { formatMessage } = useLocale()

  return (
    <PaymentContainer>
      <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
        <AlertMessage
          type="info"
          message={formatMessage(bankTransfer.disclaimer)}
        />
        <Controller
          name="bankAccountNumber"
          control={control}
          rules={{
            required: formatMessage(bankTransfer.accountNumberRequired),
            validate: (value) =>
              validateBankAccountNumber(value, formatMessage),
          }}
          render={({ field }) => (
            <InputMask
              mask={BANK_ACCOUNT_MASK}
              replacement={MASK_REPLACEMENT}
              component={Input}
              {...field}
              value={toMaskedValue(field.value)}
              onChange={(e) =>
                // Strip dashes
                field.onChange(e.target.value.replace(/\D/g, ''))
              }
              inputMode="numeric"
              backgroundColor="blue"
              label={formatMessage(bankTransfer.accountNumber)}
              placeholder={formatMessage(bankTransfer.accountNumberPlaceholder)}
              size="sm"
              errorMessage={formState.errors.bankAccountNumber?.message}
            />
          )}
        />
      </Box>
    </PaymentContainer>
  )
}
