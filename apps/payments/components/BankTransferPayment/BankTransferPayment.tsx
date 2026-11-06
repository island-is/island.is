import { ReactNode, useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { MessageDescriptor } from 'react-intl'
import { InputMask } from '@react-input/mask'
import { format as formatKennitala } from 'kennitala'

import {
  AlertMessage,
  Box,
  Input,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { PaymentContainer } from '../PaymentContainer/PaymentContainer'
import { bankTransfer } from '../../messages'
import {
  BANK_ACCOUNT_PART_LENGTHS,
  BANK_ACCOUNT_PART_ORDER,
  BankAccountPart,
  padBankAccountPart,
  parsePastedBankAccount,
  validateActorNationalId,
  validateBank,
} from './BankTransferPayment.utils'
import * as styles from './BankTransferPayment.css'

type BankTransferPaymentInput = Record<BankAccountPart, string> & {
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

const NATIONAL_ID_MASK = '______-____'
const MASK_REPLACEMENT = { _: /\d/ }

const BANK_ACCOUNT_ERROR_ID = 'bank-account-error'

const BANK_ACCOUNT_PART_FIELDS: Record<
  BankAccountPart,
  { label: MessageDescriptor; className: string }
> = {
  bank: { label: bankTransfer.bank, className: styles.bankAccountPart },
  ledger: { label: bankTransfer.ledger, className: styles.bankAccountPart },
  account: {
    label: bankTransfer.account,
    className: styles.bankAccountNumberPart,
  },
}

// Where focus goes after a paste: a field, or the submit button.
type PasteFocusTarget = keyof BankTransferPaymentInput | 'submit'

/**
 * The body shown between the {@link PaymentSelector} and the submit button when the user has
 * selected the bank-transfer method.
 */
export const BankTransferPayment = ({
  companyPayer,
}: BankTransferPaymentProps) => {
  const {
    control,
    formState,
    setFocus,
    setValue,
    getValues,
    getFieldState,
    trigger,
  } = useFormContext<BankTransferPaymentInput>()
  const { formatMessage } = useLocale()

  // Move focus on from a paste only once its values have rendered. Moving it in the paste handler
  // blurs the pasted-into input while its DOM value is still the old one, and `onBlur` below writes
  // that stale value back.
  const [pendingFocus, setPendingFocus] = useState<{
    form: HTMLFormElement | null
    target: PasteFocusTarget
  } | null>(null)
  useEffect(() => {
    if (!pendingFocus) return
    setPendingFocus(null)

    if (pendingFocus.target === 'submit') {
      pendingFocus.form
        ?.querySelector<HTMLButtonElement>('button[type="submit"]')
        ?.focus()
    } else {
      setFocus(pendingFocus.target)
    }
  }, [pendingFocus, setFocus])

  // A pasted account number is assumed complete, so the next step is the submit button. A part the
  // paste got wrong or left empty, or the approver's national id a company payer has yet to enter,
  // comes first. Fields are validated only once the payer has reached them, so the approver's is not
  // flagged before they have had a chance to fill it in.
  const findPasteFocusTarget = async (
    pastedParts: BankAccountPart[],
  ): Promise<PasteFocusTarget> => {
    if (!(await trigger(pastedParts))) {
      return (
        pastedParts.find((part) => getFieldState(part).invalid) ??
        pastedParts[0]
      )
    }

    const emptyPart = BANK_ACCOUNT_PART_ORDER.find((part) => !getValues(part))
    if (emptyPart) return emptyPart

    if (companyPayer && !getValues('actorNationalId')) return 'actorNationalId'

    // Everything is filled in. Validating the whole form also settles `isValid`, which the submit
    // button is disabled on.
    if (await trigger()) return 'submit'

    return (
      (['actorNationalId', ...BANK_ACCOUNT_PART_ORDER] as const).find(
        (name) => getFieldState(name).invalid,
      ) ?? 'submit'
    )
  }

  // One message for the whole account number, under the three inputs.
  const bankAccountError =
    formState.errors.bank?.message ??
    formState.errors.ledger?.message ??
    formState.errors.account?.message

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
                  // Keyed: the rich text comes back as an array of children, and React warns
                  // about an unkeyed element in it.
                  b: (chunks: ReactNode) => (
                    <Text
                      key="companyName"
                      as="span"
                      variant="small"
                      fontWeight="semiBold"
                    >
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
                value={formatKennitala(companyPayer.nationalId)}
                size="sm"
                readOnly
              />
            </>
          )}
          <Box>
            <Box display="flex" columnGap={2}>
              {BANK_ACCOUNT_PART_ORDER.map((name, index) => {
                const { label, className } = BANK_ACCOUNT_PART_FIELDS[name]
                const length = BANK_ACCOUNT_PART_LENGTHS[name]
                // Focused once this part is full.
                const next = BANK_ACCOUNT_PART_ORDER[index + 1]

                return (
                  <Box key={name} className={className}>
                    <Controller
                      name={name}
                      control={control}
                      rules={{
                        required: formatMessage(
                          bankTransfer.accountNumberRequired,
                        ),
                        validate:
                          name === 'bank'
                            ? (value) => validateBank(value, formatMessage)
                            : undefined,
                      }}
                      render={({ field, fieldState }) => (
                        <Input
                          ref={field.ref}
                          id={`bank-account-${name}`}
                          name={field.name}
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, length)
                            field.onChange(value)

                            // Move on to the next part once this one is full, selecting anything
                            // already typed there so it is replaced.
                            if (next && value.length === length) {
                              setFocus(next, { shouldSelect: true })
                            }
                          }}
                          // Split a pasted whole account number across the inputs. Anything else
                          // falls through to the browser, and `onChange` above.
                          onPaste={(e) => {
                            const parsed = parsePastedBankAccount(
                              e.clipboardData.getData('text'),
                              name,
                            )
                            if (!parsed) return

                            e.preventDefault()
                            const form = e.currentTarget.form
                            const pastedParts: BankAccountPart[] = []
                            for (const part of BANK_ACCOUNT_PART_ORDER) {
                              const value = parsed[part]
                              if (value !== undefined) {
                                setValue(part, value, { shouldDirty: true })
                                pastedParts.push(part)
                              }
                            }
                            findPasteFocusTarget(pastedParts).then((target) =>
                              setPendingFocus({ form, target }),
                            )
                          }}
                          // Show the value as it will be sent: `123` becomes `0123`.
                          onBlur={(e) => {
                            field.onChange(
                              padBankAccountPart(e.target.value, name),
                            )
                            field.onBlur()
                          }}
                          inputMode="numeric"
                          maxLength={length}
                          backgroundColor="blue"
                          label={formatMessage(label)}
                          placeholder={'0'.repeat(length)}
                          size="sm"
                          // Not `hasError`: its warning icon covers the digits in the narrow inputs.
                          // The message under the row carries the error instead.
                          aria-invalid={fieldState.error ? true : undefined}
                          aria-describedby={
                            bankAccountError ? BANK_ACCOUNT_ERROR_ID : undefined
                          }
                        />
                      )}
                    />
                  </Box>
                )
              })}
            </Box>
            {bankAccountError && (
              <InputError
                id={BANK_ACCOUNT_ERROR_ID}
                errorMessage={bankAccountError}
              />
            )}
          </Box>
        </Box>
      </Box>
    </PaymentContainer>
  )
}
