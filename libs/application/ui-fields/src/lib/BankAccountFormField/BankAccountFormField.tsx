import {
  buildFieldRequired,
  coreDefaultFieldMessages,
  coreErrorMessages,
  formatText,
  formatTextWithLocale,
  getErrorViaPath,
} from '@island.is/application/core'
import { BankAccountField, FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getDefaultValue } from '../../getDefaultValue'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

interface Props extends FieldBaseProps {
  field: BankAccountField
}
export const BankAccountFormField = ({
  field,
  application,
  errors,
  error,
}: Props) => {
  const { formatMessage, lang: locale } = useLocale()
  const {
    marginBottom,
    marginTop,
    title,
    titleVariant,
    id,
    clearOnChange,
    clearOnChangeDefaultValue,
    required,
  } = field
  const bankNumber = formatText(
    coreDefaultFieldMessages.defaultBankAccountBankNumber,
    application,
    formatMessage,
  )
  const ledger = formatText(
    coreDefaultFieldMessages.defaultBankAccountLedger,
    application,
    formatMessage,
  )
  const accountNumber = formatText(
    coreDefaultFieldMessages.defaultBankAccountAccountNumber,
    application,
    formatMessage,
  )
  const bankInfo = getDefaultValue(field, application, locale)

  // Extract errors for each bank account field part (individual field errors)
  const bankNumberError = getErrorViaPath(errors || {}, `${id}.bankNumber`)
  const ledgerError = getErrorViaPath(errors || {}, `${id}.ledger`)
  const accountNumberError = getErrorViaPath(
    errors || {},
    `${id}.accountNumber`,
  )

  // Ensure errors are strings, not objects
  const safeBankNumberError =
    typeof bankNumberError === 'string' ? bankNumberError : undefined
  const safeLedgerError =
    typeof ledgerError === 'string' ? ledgerError : undefined
  const safeAccountNumberError =
    typeof accountNumberError === 'string' ? accountNumberError : undefined

  const safeComponentError = typeof error === 'string' ? error : undefined

  // Local errors set on blur/focus change
  const [localBankError, setLocalBankError] = useState<string | undefined>(
    undefined,
  )
  const [localLedgerError, setLocalLedgerError] = useState<string | undefined>(
    undefined,
  )
  const [localAccountError, setLocalAccountError] = useState<
    string | undefined
  >(undefined)

  // Prefer RHF field errors first, then local (per-field) errors, then component-level errors
  const useBankNumberError =
    safeBankNumberError ?? localBankError ?? safeComponentError
  const useLedgerError =
    safeLedgerError ?? localLedgerError ?? safeComponentError
  const useAccountNumberError =
    safeAccountNumberError ?? localAccountError ?? safeComponentError

  const bankRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const ledgerRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const accountRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const BANK_LEN = 4
  const LEDGER_LEN = 2
  const ACCOUNT_LEN = 6

  const digits = (s: string) => s.replace(/\D/g, '')

  const selectIfHasValue = (
    ref: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    if (ref && /\d/.test(ref.value)) {
      requestAnimationFrame(() => ref.select())
    }
  }

  useEffect(() => {
    const inputs = [bankRef.current, ledgerRef.current, accountRef.current]
    const handler = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement
      if (target && /\d/.test(target.value)) {
        requestAnimationFrame(() => target.select())
      }
    }
    inputs.forEach((el) => el?.addEventListener('focus', handler))
    return () =>
      inputs.forEach((el) => el?.removeEventListener('focus', handler))
  }, [])

  // Validate on blur (deselect or focusing another field)
  useEffect(() => {
    const errMsg = formatMessage(coreErrorMessages.defaultError)

    const validateLength =
      (requiredLen: number, setErr: (v: string | undefined) => void) =>
      (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement
        const len = digits(target?.value || '').length
        // Only show error if something was entered but length is wrong
        setErr(len === 0 || len === requiredLen ? undefined : errMsg)
      }

    const b = bankRef.current
    const l = ledgerRef.current
    const a = accountRef.current

    const onBlurBank = validateLength(BANK_LEN, setLocalBankError)
    const onBlurLedger = validateLength(LEDGER_LEN, setLocalLedgerError)
    const onBlurAccount = validateLength(ACCOUNT_LEN, setLocalAccountError)

    b?.addEventListener('blur', onBlurBank)
    l?.addEventListener('blur', onBlurLedger)
    a?.addEventListener('blur', onBlurAccount)

    return () => {
      b?.removeEventListener('blur', onBlurBank)
      l?.removeEventListener('blur', onBlurLedger)
      a?.removeEventListener('blur', onBlurAccount)
    }
  }, [formatMessage])

  const handleBankChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLocalBankError(undefined)
    if (digits(e.target.value).length >= BANK_LEN) {
      ledgerRef.current?.focus()
      selectIfHasValue(ledgerRef.current)
    }
  }
  const handleLedgerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setLocalLedgerError(undefined)
    if (digits(e.target.value).length >= LEDGER_LEN) {
      accountRef.current?.focus()
      selectIfHasValue(accountRef.current)
    }
  }
  const handleAccountChange = () => {
    setLocalAccountError(undefined)
  }

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Box marginBottom={1}>
          <Text variant={titleVariant ?? 'h3'}>
            {formatTextWithLocale(title, application, locale, formatMessage)}
          </Text>
        </Box>
      )}
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
          <Box>
            <InputController
              id={`${id}.bankNumber`}
              defaultValue={String(bankInfo?.bankNumber || '')}
              label={bankNumber}
              placeholder="0000"
              format="####"
              backgroundColor="blue"
              autoFocus
              clearOnChange={clearOnChange}
              clearOnChangeDefaultValue={clearOnChangeDefaultValue}
              required={buildFieldRequired(application, required)}
              error={useBankNumberError}
              ref={bankRef}
              onChange={handleBankChange}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '3/12', '2/12']}>
          <Box>
            <InputController
              id={`${id}.ledger`}
              defaultValue={String(bankInfo?.ledger || '')}
              label={ledger}
              placeholder="00"
              format="##"
              backgroundColor="blue"
              clearOnChange={clearOnChange}
              clearOnChangeDefaultValue={clearOnChangeDefaultValue}
              required={buildFieldRequired(application, required)}
              error={useLedgerError}
              ref={ledgerRef}
              onChange={handleLedgerChange}
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12', '6/12']}>
          <Box>
            <InputController
              id={`${id}.accountNumber`}
              defaultValue={String(bankInfo?.accountNumber || '')}
              label={accountNumber}
              placeholder="000000"
              format="######"
              backgroundColor="blue"
              clearOnChange={clearOnChange}
              clearOnChangeDefaultValue={clearOnChangeDefaultValue}
              required={buildFieldRequired(application, required)}
              error={useAccountNumberError}
              ref={accountRef}
              onChange={handleAccountChange}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
