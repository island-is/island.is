import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  friendlyFormatIBAN,
  friendlyFormatSWIFT,
  validIBAN,
  validSWIFT,
} from '@island.is/shared/utils'
import { m } from '../../lib/messages'

export interface ForeignBankAccountData {
  iban: string
  swift: string
  bankName: string
  bankAddress: string
  currency: string
}

interface ForeignBankAccountInputProps {
  id?: string
  title?: string
  iban?: string
  swift?: string
  bankName?: string
  bankAddress?: string
  currency?: string
  currencyOptions: Array<{ label: string; value: string }>
  currencyLoading?: boolean
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  onChange?: (value: ForeignBankAccountData) => void
}

export const ForeignBankAccountInput = ({
  id = 'foreignBankAccount',
  title,
  iban: initialIban = '',
  swift: initialSwift = '',
  bankName: initialBankName = '',
  bankAddress: initialBankAddress = '',
  currency: initialCurrency = '',
  currencyOptions,
  currencyLoading = false,
  required = true,
  disabled = false,
  readOnly = false,
  onChange,
}: ForeignBankAccountInputProps) => {
  const { formatMessage } = useLocale()

  const [iban, setIban] = useState(initialIban)
  const [swift, setSwift] = useState(initialSwift)
  const [bankName, setBankName] = useState(initialBankName)
  const [bankAddress, setBankAddress] = useState(initialBankAddress)
  const [currency, setCurrency] = useState(initialCurrency)

  const [ibanError, setIbanError] = useState<string | undefined>(undefined)
  const [swiftError, setSwiftError] = useState<string | undefined>(undefined)
  const [bankNameError, setBankNameError] = useState<string | undefined>(
    undefined,
  )
  const [bankAddressError, setBankAddressError] = useState<string | undefined>(
    undefined,
  )

  const dataRef = useRef<ForeignBankAccountData>({
    iban: initialIban,
    swift: initialSwift,
    bankName: initialBankName,
    bankAddress: initialBankAddress,
    currency: initialCurrency,
  })

  useEffect(() => {
    setIban(initialIban)
    setSwift(initialSwift)
    setBankName(initialBankName)
    setBankAddress(initialBankAddress)
    setCurrency(initialCurrency)
    dataRef.current = {
      iban: initialIban,
      swift: initialSwift,
      bankName: initialBankName,
      bankAddress: initialBankAddress,
      currency: initialCurrency,
    }
  }, [
    initialIban,
    initialSwift,
    initialBankName,
    initialBankAddress,
    initialCurrency,
  ])

  const emit = useCallback(
    (partial: Partial<ForeignBankAccountData>) => {
      if (!onChange) return
      const next: ForeignBankAccountData = {
        ...dataRef.current,
        ...partial,
      }
      const cleaned: ForeignBankAccountData = {
        ...next,
        iban: next.iban.replace(/\s/g, ''),
        swift: next.swift.replace(/\s/g, ''),
      }
      dataRef.current = next
      onChange(cleaned)
    },
    [onChange],
  )

  const handleIbanChange = (value: string) => {
    const formatted = friendlyFormatIBAN(value)
    setIban(formatted)
    setIbanError(undefined)
    emit({ iban: formatted })
  }

  const handleIbanBlur = () => {
    if (iban && !validIBAN(iban.replace(/\s/g, ''))) {
      setIbanError(formatMessage(m.invalidIban))
    }
  }

  const handleSwiftChange = (value: string) => {
    const formatted = friendlyFormatSWIFT(value)
    setSwift(formatted)
    setSwiftError(undefined)
    emit({ swift: formatted })
  }

  const handleSwiftBlur = () => {
    if (swift && !validSWIFT(swift.replace(/\s/g, ''))) {
      setSwiftError(formatMessage(m.invalidSwift))
    }
  }

  const handleBankNameChange = (value: string) => {
    setBankName(value)
    setBankNameError(undefined)
    emit({ bankName: value })
  }

  const handleBankNameBlur = () => {
    if (!bankName.trim()) {
      setBankNameError(formatMessage(m.fieldRequired))
    }
  }

  const handleBankAddressChange = (value: string) => {
    setBankAddress(value)
    setBankAddressError(undefined)
    emit({ bankAddress: value })
  }

  const handleBankAddressBlur = () => {
    if (!bankAddress.trim()) {
      setBankAddressError(formatMessage(m.fieldRequired))
    }
  }

  const handleCurrencyChange = (value: string) => {
    setCurrency(value)
    emit({ currency: value })
  }

  const isIbanValid = useMemo(
    () => !!iban && !ibanError && validIBAN(iban.replace(/\s/g, '')),
    [iban, ibanError],
  )

  const isSwiftValid = useMemo(
    () => !!swift && !swiftError && validSWIFT(swift.replace(/\s/g, '')),
    [swift, swiftError],
  )

  const isBankNameValid = useMemo(() => bankName.trim().length > 0, [bankName])
  const isBankAddressValid = useMemo(
    () => bankAddress.trim().length > 0,
    [bankAddress],
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
        <Input
          id={`${id}.iban`}
          name={`${id}.iban`}
          label={formatMessage(m.ibanLabel)}
          placeholder={formatMessage(m.ibanPlaceholder)}
          backgroundColor="blue"
          size="xs"
          value={iban}
          onChange={(e) => handleIbanChange(e.target.value)}
          onBlur={handleIbanBlur}
          hasError={!!ibanError}
          errorMessage={ibanError}
          icon={isIbanValid ? { name: 'checkmark' } : undefined}
          maxLength={42}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <Input
              id={`${id}.swift`}
              name={`${id}.swift`}
              label={formatMessage(m.swiftLabel)}
              placeholder={formatMessage(m.swiftPlaceholder)}
              backgroundColor="blue"
              size="xs"
              value={swift}
              onChange={(e) => handleSwiftChange(e.target.value)}
              onBlur={handleSwiftBlur}
              hasError={!!swiftError}
              errorMessage={swiftError}
              icon={isSwiftValid ? { name: 'checkmark' } : undefined}
              maxLength={14}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12']}>
            <Select
              id={`${id}.currency`}
              name={`${id}.currency`}
              label={formatMessage(m.currencyLabel)}
              placeholder={formatMessage(m.currencyPlaceholder)}
              backgroundColor="blue"
              size="xs"
              options={currencyOptions}
              value={
                currencyOptions.find((opt) => opt.value === currency) || null
              }
              onChange={(option) => handleCurrencyChange(option?.value || '')}
              isLoading={currencyLoading}
              isDisabled={disabled}
              required={required}
            />
          </GridColumn>
        </GridRow>
        <Input
          id={`${id}.bankName`}
          name={`${id}.bankName`}
          label={formatMessage(m.bankNameLabel)}
          backgroundColor="blue"
          size="xs"
          value={bankName}
          onChange={(e) => handleBankNameChange(e.target.value)}
          onBlur={handleBankNameBlur}
          hasError={!!bankNameError}
          errorMessage={bankNameError}
          icon={isBankNameValid ? { name: 'checkmark' } : undefined}
          maxLength={100}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
        <Input
          id={`${id}.bankAddress`}
          name={`${id}.bankAddress`}
          label={formatMessage(m.bankAddressLabel)}
          backgroundColor="blue"
          size="xs"
          value={bankAddress}
          onChange={(e) => handleBankAddressChange(e.target.value)}
          onBlur={handleBankAddressBlur}
          hasError={!!bankAddressError}
          errorMessage={bankAddressError}
          icon={isBankAddressValid ? { name: 'checkmark' } : undefined}
          maxLength={200}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
      </Stack>
    </Box>
  )
}
