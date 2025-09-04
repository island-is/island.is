import { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Text,
} from '@island.is/island-ui/core'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { getEstateDataFromApplication } from '../../lib/utils'
import { ErrorValue } from '../../types'

interface BankAccountFormField {
  id: string
  accountNumber?: string
  balance?: string
  exchangeRateOrInterest?: string
  initial?: boolean
  enabled?: boolean
}

interface BankAccountsRepeaterProps {
  field: {
    props: {
      repeaterButtonText: string
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
  const { control, clearErrors } = useFormContext()
  const estateData = getEstateDataFromApplication(application)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.bankAccounts) {
      replace(estateData.estate.bankAccounts)
    }
  }, [])

  const handleAddBankAccount = () =>
    append({
      accountNumber: '',
      balance: '',
      exchangeRateOrInterest: '',
      initial: false,
      enabled: true,
    })

  const handleRemoveBankAccount = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, bankAccount: BankAccountFormField, index) => {
          if (!bankAccount.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              key={bankAccount.id}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                disabled={!bankAccount.enabled}
                title={
                  bankAccount.accountNumber || formatMessage(m.bankAccount)
                }
                key={bankAccount.accountNumber}
                description={[
                  `${formatMessage(m.bankAccountBalance)}: ${
                    bankAccount.balance || '0'
                  } kr.`,
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={bankAccount.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedBankAccount = {
                          ...bankAccount,
                          enabled: !bankAccount.enabled,
                        }
                        update(index, updatedBankAccount)
                        clearErrors(`${id}[${index}].balance`)
                      }}
                    >
                      {bankAccount.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
              <Box marginTop={2}>
                <InputController
                  id={`${id}[${index}].balance`}
                  name={`${id}[${index}].balance`}
                  label={formatMessage(m.bankAccountBalance)}
                  disabled={!bankAccount.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={bankAccount.balance}
                  error={error && error[index]?.balance}
                  currency
                  size="sm"
                  required
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: BankAccountFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const accountNumberField = `${fieldIndex}.accountNumber`
        const balanceField = `${fieldIndex}.balance`
        const exchangeRateField = `${fieldIndex}.exchangeRateOrInterest`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={true}
              render={() => <input type="hidden" />}
            />
            <Text variant="h4">{formatMessage(m.bankAccount)}</Text>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveBankAccount.bind(null, index)}
              />
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
                  error={fieldError?.accountNumber}
                  size="sm"
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
                  error={fieldError?.balance}
                  currency
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={exchangeRateField}
                  name={exchangeRateField}
                  label={formatMessage(m.bankAccountInterestRate)}
                  defaultValue={field.exchangeRateOrInterest}
                  placeholder="0"
                  error={fieldError?.exchangeRateOrInterest}
                  size="sm"
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
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
