import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
  Input,
} from '@island.is/island-ui/core'
import { useRef, useState, useEffect, useMemo } from 'react'

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

  const [localBank, setLocalBank] = useState(initialBankNumber)
  const [localLedger, setLocalLedger] = useState(initialLedger)
  const [localAccount, setLocalAccount] = useState(initialAccountNumber)

  useEffect(() => {
    setLocalBank(initialBankNumber)
    setLocalLedger(initialLedger)
    setLocalAccount(initialAccountNumber)
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

  const emit = (partial: Partial<DomesticBankAccountData>) => {
    if (!onChange) return
    const next: DomesticBankAccountData = {
      bankNumber: partial.bankNumber ?? localBank,
      ledger: partial.ledger ?? localLedger,
      accountNumber: partial.accountNumber ?? localAccount,
    }
    onChange(next)
  }

  const handleBankChange = (value: string) => {
    setLocalBank(value)
    setLocalBankError(undefined)
    if (digits(value).length >= BANK_LEN) {
      ledgerRef.current?.focus()
      selectIfHasValue(ledgerRef.current)
    }
    emit({ bankNumber: value })
  }

  const handleLedgerChange = (value: string) => {
    setLocalLedger(value)
    setLocalLedgerError(undefined)
    if (digits(value).length >= LEDGER_LEN) {
      accountRef.current?.focus()
      selectIfHasValue(accountRef.current)
    }
    emit({ ledger: value })
  }

  const handleAccountChange = (value: string) => {
    setLocalAccount(value)
    setLocalAccountError(undefined)
    emit({ accountNumber: value })
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

  return (
    <Box>
      {title && (
        <Box marginBottom={1}>
          <Text variant="h5">{title}</Text>
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
            autoFocus
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
        <GridColumn span={['12/12', '12/12', '12/12', '3/12', '2/12']}>
          <Input
            id={`${id}.ledger`}
            name={`${id}.ledger`}
            label={ledgerLabel}
            placeholder="00"
            backgroundColor="blue"
            size="xs"
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
        <GridColumn span={['12/12', '12/12', '12/12', '5/12', '6/12']}>
          <Input
            id={`${id}.accountNumber`}
            name={`${id}.accountNumber`}
            label={accountNumberLabel}
            placeholder="000000"
            backgroundColor="blue"
            size="xs"
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
