import {
  buildFieldRequired,
  coreDefaultFieldMessages,
  formatText,
  formatTextWithLocale,
  getErrorViaPath,
} from '@island.is/application/core'
import { BankAccountField, FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getDefaultValue } from '../../getDefaultValue'

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

  const bankInfo = getDefaultValue(field, application)

  // Debug bankInfo to see if it's causing the issue
  console.log('🏦 BankInfo debug:', {
    bankInfo,
    bankInfoType: typeof bankInfo,
    bankNumber: bankInfo?.bankNumber,
    ledger: bankInfo?.ledger,
    accountNumber: bankInfo?.accountNumber,
  })

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

  // Ensure component-level error is also a string
  const safeComponentError = typeof error === 'string' ? error : undefined

  // Use component-level error if present, otherwise use individual field errors
  const useBankNumberError = safeComponentError || safeBankNumberError
  const useLedgerError = safeComponentError || safeLedgerError
  const useAccountNumberError = safeComponentError || safeAccountNumberError

  // Debug: Remove this after testing
  if (
    safeBankNumberError ||
    safeLedgerError ||
    safeAccountNumberError ||
    error
  ) {
    console.log('🏦 BankAccount errors found:', {
      id,
      safeBankNumberError,
      safeLedgerError,
      safeAccountNumberError,
      safeComponentError,
      rawComponentError: error,
      rawErrors: { bankNumberError, ledgerError, accountNumberError },
      finalErrorsUsed: {
        useBankNumberError,
        useLedgerError,
        useAccountNumberError,
      },
    })
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
              required={buildFieldRequired(application, required)}
              error={useBankNumberError}
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
              required={buildFieldRequired(application, required)}
              error={useLedgerError}
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
              required={buildFieldRequired(application, required)}
              error={useAccountNumberError}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
