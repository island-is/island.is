import { FC, useEffect } from 'react'
import { MessageDescriptor } from 'react-intl'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'

interface BankAccountFormField {
  id: string
  accountNumber?: string
  balance?: string
  accruedInterest?: string
  accountTotal?: string
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
  const estateData = getEstateDataFromApplication(application)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.bankAccounts) {
      replace(estateData.estate.bankAccounts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate bank account total from balance + accruedInterest
  const updateBankAccountValue = (fieldIndex: string) => {
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
  }

  const handleAddBankAccount = () =>
    append({
      accountNumber: '',
      balance: '',
      accruedInterest: '0',
      accountTotal: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveBankAccount = (index: number) => remove(index)

  // Calculate accountTotal for all fields when they are populated
  useEffect(() => {
    if (fields.length > 0) {
      fields.forEach((_, index) => {
        const fieldIndex = `${id}[${index}]`
        updateBankAccountValue(fieldIndex)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length, fields])

  return (
    <Box marginTop={2}>
      {fields.map((field: BankAccountFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const accountNumberField = `${fieldIndex}.accountNumber`
        const balanceField = `${fieldIndex}.balance`
        const accruedInterestField = `${fieldIndex}.accruedInterest`
        const accountTotalField = `${fieldIndex}.accountTotal`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box position="relative" key={field.id} marginTop={2}>
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
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              marginBottom={0}
            >
              <Text variant="h4" />
              <Box display="flex" alignItems="center" columnGap={2}>
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
                      ? formatMessage(m.inheritanceDisableMember)
                      : formatMessage(m.inheritanceEnableMember)}
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
            </Box>
            <GridRow>
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
                  required
                  error={fieldError?.accountNumber}
                  size="sm"
                  disabled={field.initial && !field.enabled}
                  onChange={() => updateBankAccountValue(fieldIndex)}
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
    </Box>
  )
}

export default BankAccountsRepeater
