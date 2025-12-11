import { FC, useEffect, useState } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  InputController,
  CheckboxController,
} from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { ErrorValue } from '../../types'
import { YES } from '../../lib/constants'
import { getEstateDataFromApplication } from '../../lib/utils'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

interface BankAccountFormField {
  id: string
  accountNumber?: string
  balance?: string
  accruedInterest?: string
  accountTotal?: string
  foreignBankAccount?: string[]
  initial?: boolean
  enabled?: boolean
}

interface BankAccountsRepeaterProps {
  field: {
    props: {
      repeaterButtonText: MessageDescriptor
    }
  }
}

export const BankAccountsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & BankAccountsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id } = field
  const repeaterButtonText = field?.props?.repeaterButtonText
  const error = (errors as ErrorValue)?.estate?.bankAccounts
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })
  const { control, clearErrors, setValue, getValues } = useFormContext()
  const [foreignBankAccountIndexes, setForeignBankAccountIndexes] = useState<
    number[]
  >([])

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: BankAccountFormField) => field.accountTotal,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.bankAccounts) {
      replace(estateData.estate.bankAccounts)
    }

    // Always sync foreignBankAccountIndexes from form data on mount
    if (fields.length > 0) {
      const foreignIndexes = fields
        .map((field: BankAccountFormField, index) =>
          field.foreignBankAccount?.length ? index : -1,
        )
        .filter((index) => index !== -1)
      setForeignBankAccountIndexes(foreignIndexes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [application, fields.length, replace])

  // Calculate bank account total from balance + accruedInterest
  const updateBankAccountValue = (
    fieldIndex: string,
    skipTotalCalc = false,
  ) => {
    const bankAccountValues = getValues(fieldIndex)
    const balance =
      bankAccountValues?.balance?.replace(',', '.').replace(/[^\d.]/g, '') ||
      '0'
    const accruedInterest =
      bankAccountValues?.accruedInterest
        ?.replace(',', '.')
        .replace(/[^\d.]/g, '') || '0'

    const accountTotal = parseFloat(balance) + parseFloat(accruedInterest)
    setValue(`${fieldIndex}.accountTotal`, accountTotal.toString())

    if (accountTotal > 0) {
      clearErrors(`${fieldIndex}.balance`)
    }

    // Only recalculate total when called from onChange handlers, not during init loop
    if (!skipTotalCalc) {
      calculateTotal()
    }
  }

  const handleAddBankAccount = () =>
    append({
      accountNumber: '',
      balance: '',
      accruedInterest: '0',
      accountTotal: '',
      foreignBankAccount: [],
      initial: false,
      enabled: true,
    })

  const handleRemoveBankAccount = (index: number) => remove(index)

  // Calculate accountTotal for all fields when they are populated
  useEffect(() => {
    if (fields.length > 0) {
      fields.forEach((_, index) => {
        const fieldIndex = `${id}[${index}]`
        // Skip calculateTotal in loop; it will run once via the next useEffect
        updateBankAccountValue(fieldIndex, true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, fields])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  return (
    <Box marginTop={2}>
      {fields.map((field: BankAccountFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const accountNumberField = `${fieldIndex}.accountNumber`
        const balanceField = `${fieldIndex}.balance`
        const accruedInterestField = `${fieldIndex}.accruedInterest`
        const accountTotalField = `${fieldIndex}.accountTotal`
        const foreignBankAccountField = `${fieldIndex}.foreignBankAccount`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null
        const isForeignAccount = foreignBankAccountIndexes.includes(index)

        return (
          <Box position="relative" key={field.id} marginTop={4}>
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={field.enabled || true}
              render={() => <input type="hidden" />}
            />
            <Box display="flex" justifyContent="flexEnd">
              {field.initial && (
                <Button
                  variant="text"
                  icon={field.enabled ? 'remove' : 'add'}
                  size="small"
                  iconType="outline"
                  onClick={() => {
                    const updatedBankAccount = {
                      ...field,
                      enabled: !field.enabled,
                    }
                    update(index, updatedBankAccount)
                    clearErrors(`${id}[${index}].balance`)
                  }}
                >
                  {field.enabled
                    ? formatMessage(m.disable)
                    : formatMessage(m.activate)}
                </Button>
              )}
              {!field.initial && (
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={handleRemoveBankAccount.bind(null, index)}
                />
              )}
            </Box>
            <GridRow>
              <GridColumn
                span={['1/1', '1/1']}
                paddingBottom={0}
                paddingTop={2}
              >
                <CheckboxController
                  id={foreignBankAccountField}
                  name={foreignBankAccountField}
                  defaultValue={field.foreignBankAccount || []}
                  spacing={0}
                  disabled={field.initial && !field.enabled}
                  options={[
                    {
                      label: formatMessage(m.bankAccountForeign),
                      value: YES,
                    },
                  ]}
                  labelVariant="small"
                  onSelect={(val) => {
                    setValue(foreignBankAccountField, val)
                    setForeignBankAccountIndexes(
                      val.length
                        ? [...foreignBankAccountIndexes, index]
                        : foreignBankAccountIndexes.filter((i) => i !== index),
                    )
                    // Clear account number when toggling to prevent invalid format
                    setValue(accountNumberField, '')
                    clearErrors(accountNumberField)
                  }}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={accountNumberField}
                  name={accountNumberField}
                  label={formatMessage(m.bankAccount)}
                  backgroundColor="blue"
                  defaultValue={field.accountNumber}
                  type="text"
                  {...(!isForeignAccount && {
                    format: '####-##-######',
                    placeholder: '0000-00-000000',
                  })}
                  {...(isForeignAccount && {
                    placeholder: '',
                  })}
                  required
                  error={fieldError?.accountNumber}
                  size="sm"
                  disabled={field.initial && !field.enabled}
                  onChange={(e) => {
                    if (isForeignAccount) {
                      // Convert to uppercase for foreign bank accounts (IBAN format)
                      const upperValue = e.target.value.toUpperCase()
                      setValue(accountNumberField, upperValue)
                    }
                    updateBankAccountValue(fieldIndex)
                  }}
                />
              </GridColumn>
              <GridColumn
                span={['1/1', '1/2']}
                paddingBottom={2}
                paddingTop={2}
              >
                <InputController
                  id={balanceField}
                  name={balanceField}
                  label={formatMessage(m.bankAccountBalance)}
                  defaultValue={field.balance}
                  placeholder="0 kr."
                  required
                  error={fieldError?.balance}
                  currency
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateBankAccountValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={accruedInterestField}
                  name={accruedInterestField}
                  label={formatMessage(m.bankAccountInterestRate)}
                  defaultValue={field.accruedInterest}
                  placeholder="0 kr."
                  required
                  error={fieldError?.accruedInterest}
                  currency
                  size="sm"
                  backgroundColor="blue"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateBankAccountValue(fieldIndex)}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={accountTotalField}
                  name={accountTotalField}
                  label={formatMessage(m.total)}
                  defaultValue={field.accountTotal}
                  placeholder="0 kr."
                  error={fieldError?.accountTotal}
                  currency
                  size="sm"
                  backgroundColor="white"
                  disabled={field.initial && !field.enabled}
                  readOnly
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddBankAccount}
          size="small"
        >
          {formatMessage(repeaterButtonText)}
        </Button>
      </Box>
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default BankAccountsRepeater
