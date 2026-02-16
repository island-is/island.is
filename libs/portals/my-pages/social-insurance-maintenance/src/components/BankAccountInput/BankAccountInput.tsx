import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
  Input,
} from '@island.is/island-ui/core'
import { useRef, useState, useEffect, useMemo, useCallback } from 'react'

export interface DomesticBankAccountData {
  bankNumber: string
  ledger: string
  accountNumber: string
}

interface BankAccountInputProps {
  id?: string
  title?: string
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  bankLabel: string
  ledgerLabel: string
  accountNumberLabel: string
  errorMessage: string
  onChange?: (value: DomesticBankAccountData) => void
}

export const BankAccountInput = ({
  id = 'bankAccount',
  title,
  bankNumber: initialBankNumber = '',
  ledger: initialLedger = '',
  accountNumber: initialAccountNumber = '',
  required = false,
  disabled = false,
  readOnly = false,
  bankLabel,
  ledgerLabel,
  accountNumberLabel,
  errorMessage,
  onChange,
}: BankAccountInputProps) => {
  const bankRef = useRef<HTMLInputElement>(null)
  const ledgerRef = useRef<HTMLInputElement>(null)
  const accountRef = useRef<HTMLInputElement>(null)

  const BANK_LEN = 4
  const LEDGER_LEN = 2
  const ACCOUNT_LEN = 6

  const digits = (s: string) => s.replace(/\D/g, '')

  const [localBank, setLocalBank] = useState(digits(initialBankNumber))
  const [localLedger, setLocalLedger] = useState(digits(initialLedger))
  const [localAccount, setLocalAccount] = useState(digits(initialAccountNumber))

  const dataRef = useRef({
    bankNumber: localBank,
    ledger: localLedger,
    accountNumber: localAccount,
  })

  useEffect(() => {
    const bank = digits(initialBankNumber)
    const ledger = digits(initialLedger)
    const account = digits(initialAccountNumber)
    setLocalBank(bank)
    setLocalLedger(ledger)
    setLocalAccount(account)
    dataRef.current = { bankNumber: bank, ledger, accountNumber: account }
  }, [initialBankNumber, initialLedger, initialAccountNumber])

  const [localBankError, setLocalBankError] = useState<string | undefined>(
    undefined,
  )
  const [localLedgerError, setLocalLedgerError] = useState<string | undefined>(
    undefined,
  )
  const [localAccountError, setLocalAccountError] = useState<
    string | undefined
  >(undefined)

  const selectIfHasValue = (ref: HTMLInputElement | null) => {
    if (ref?.value && /\d/.test(ref.value)) {
      requestAnimationFrame(() => ref.select())
    }
  }

  const emit = useCallback(
    (partial: Partial<DomesticBankAccountData>) => {
      if (!onChange) return
      const next: DomesticBankAccountData = {
        ...dataRef.current,
        ...partial,
      }
      dataRef.current = next
      onChange(next)
    },
    [onChange],
  )

  const handleBankChange = (value: string) => {
    const cleaned = digits(value)
    setLocalBank(cleaned)
    setLocalBankError(undefined)
    if (cleaned.length >= BANK_LEN) {
      ledgerRef.current?.focus()
      selectIfHasValue(ledgerRef.current)
    }
    emit({ bankNumber: cleaned })
  }

  const handleLedgerChange = (value: string) => {
    const cleaned = digits(value)
    setLocalLedger(cleaned)
    setLocalLedgerError(undefined)
    if (cleaned.length >= LEDGER_LEN) {
      accountRef.current?.focus()
      selectIfHasValue(accountRef.current)
    }
    emit({ ledger: cleaned })
  }

  const handleAccountChange = (value: string) => {
    const cleaned = digits(value)
    setLocalAccount(cleaned)
    setLocalAccountError(undefined)
    emit({ accountNumber: cleaned })
  }

  const handleBlur =
    (requiredLen: number, setErr: (v: string | undefined) => void) =>
    (value: string) => {
      const len = digits(value).length
      setErr(len === 0 || len === requiredLen ? undefined : errorMessage)
    }

  const isBankValid = useMemo(
    () => digits(localBank).length === BANK_LEN && !localBankError,
    [localBank, localBankError],
  )

  const isLedgerValid = useMemo(
    () => digits(localLedger).length === LEDGER_LEN && !localLedgerError,
    [localLedger, localLedgerError],
  )

  const isAccountValid = useMemo(
    () => digits(localAccount).length === ACCOUNT_LEN && !localAccountError,
    [localAccount, localAccountError],
  )

  const titleId = `${id}-title`

  return (
    <Box role="group" aria-labelledby={title ? titleId : undefined}>
      {title && (
        <Box marginBottom={1}>
          <Text variant="h5" id={titleId}>
            {title}
          </Text>
        </Box>
      )}
      <Stack space={2}>
        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
            <Input
              id={`${id}.bankNumber`}
              name={`${id}.bankNumber`}
              label={bankLabel}
              placeholder="0000"
              backgroundColor="blue"
              size="xs"
              inputMode="numeric"
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              hasError={!!localBankError}
              errorMessage={localBankError}
              value={localBank}
              onChange={(e) => handleBankChange(e.target.value)}
              onBlur={(e) =>
                handleBlur(BANK_LEN, setLocalBankError)(e.target.value)
              }
              maxLength={4}
              icon={isBankValid ? { name: 'checkmark' } : undefined}
              ref={bankRef}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '3/12']}>
            <Input
              id={`${id}.ledger`}
              name={`${id}.ledger`}
              label={ledgerLabel}
              placeholder="00"
              backgroundColor="blue"
              size="xs"
              inputMode="numeric"
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              hasError={!!localLedgerError}
              errorMessage={localLedgerError}
              value={localLedger}
              onChange={(e) => handleLedgerChange(e.target.value)}
              onBlur={(e) =>
                handleBlur(LEDGER_LEN, setLocalLedgerError)(e.target.value)
              }
              maxLength={2}
              icon={isLedgerValid ? { name: 'checkmark' } : undefined}
              ref={ledgerRef}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <Input
              id={`${id}.accountNumber`}
              name={`${id}.accountNumber`}
              label={accountNumberLabel}
              placeholder="000000"
              backgroundColor="blue"
              size="xs"
              inputMode="numeric"
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              hasError={!!localAccountError}
              errorMessage={localAccountError}
              value={localAccount}
              onChange={(e) => handleAccountChange(e.target.value)}
              onBlur={(e) =>
                handleBlur(ACCOUNT_LEN, setLocalAccountError)(e.target.value)
              }
              maxLength={6}
              icon={isAccountValid ? { name: 'checkmark' } : undefined}
              ref={accountRef}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </Box>
  )
}
