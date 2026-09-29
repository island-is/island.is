import { ReactNode } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { InputMask } from '@react-input/mask'

import { AlertMessage, Box, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { bankTransfer } from '../../messages'
import { formatNationalId } from '../../utils'
import {
  validateActorNationalId,
  validateBankAccountNumber,
} from './BankTransferPayment.utils'

interface BankTransferPaymentInput {
  bankAccountNumber: string
  actorNationalId: string
}

export interface CompanyPayer {
  nationalId: string
  name: string
}

interface BankTransferPaymentProps {
  // Set when the payer is a company: the individual authorising the transfer is then entered here.
  companyPayer?: CompanyPayer
}

const BANK_ACCOUNT_MASK = '____-__-______'
const NATIONAL_ID_MASK = '______-____'
const MASK_REPLACEMENT = { _: /\d/ }

/**
 * The body shown between the {@link PaymentSelector} and the submit button when the user has
 * selected the bank-transfer method.
 */
export const BankTransferPayment = ({
  companyPayer,
}: BankTransferPaymentProps) => {
  const { control, formState } = useFormContext<BankTransferPaymentInput>()
  const { formatMessage } = useLocale()

  return (
    <PaymentContainer>
      <Box display="flex" flexDirection="column" rowGap={[2, 3]}>
        <AlertMessage
          type="info"
          message={
            companyPayer
              ? formatMessage(bankTransfer.companyPayerInfo, {
                  // The message adds the sentence's period, so names like "Aranja ehf." don't get two.
                  companyName: companyPayer.name.replace(/\.$/, ''),
                  b: (chunks: ReactNode) => (
                    <Text as="span" variant="small" fontWeight="semiBold">
                      {chunks}
                    </Text>
                  ),
                })
              : formatMessage(bankTransfer.disclaimer)
          }
        />
        <Box display="flex" flexDirection="column" rowGap={2}>
          {companyPayer && (
            <>
              <Controller
                name="actorNationalId"
                control={control}
                rules={{
                  required: formatMessage(bankTransfer.actorNationalIdRequired),
                  validate: (value) =>
                    validateActorNationalId(value, formatMessage),
                }}
                render={({ field }) => (
                  <InputMask
                    mask={NATIONAL_ID_MASK}
                    replacement={MASK_REPLACEMENT}
                    component={Input}
                    {...field}
                    inputMode="numeric"
                    backgroundColor="blue"
                    label={formatMessage(bankTransfer.actorNationalId)}
                    tooltip={formatMessage(bankTransfer.actorNationalIdTooltip)}
                    placeholder={formatMessage(
                      bankTransfer.actorNationalIdPlaceholder,
                    )}
                    size="sm"
                    errorMessage={formState.errors.actorNationalId?.message}
                  />
                )}
              />
              <Input
                name="companyNationalId"
                label={formatMessage(bankTransfer.companyNationalId, {
                  companyName: companyPayer.name,
                })}
                value={formatNationalId(companyPayer.nationalId)}
                size="sm"
                readOnly
              />
            </>
          )}
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
                inputMode="numeric"
                backgroundColor="blue"
                label={formatMessage(bankTransfer.accountNumber)}
                placeholder={formatMessage(
                  bankTransfer.accountNumberPlaceholder,
                )}
                size="sm"
                errorMessage={formState.errors.bankAccountNumber?.message}
              />
            )}
          />
        </Box>
      </Box>
    </PaymentContainer>
  )
}
