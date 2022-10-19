import { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from './BankAccountsRepeater.css'
import { m } from '../../lib/messages'

export const BankAccountsRepeater: FC<FieldBaseProps<Answers>> = ({
  field,
  errors,
}) => {
  const error = (errors as any)?.bankAccounts
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

  const handleAddBankAccount = () =>
    append({
      accountNumber: '',
      balance: '',
    })

  useEffect(() => {
    if (fields.length === 0) {
      handleAddBankAccount()
    }
  }, [])

  return (
    <Box>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const accountNumber = `${fieldIndex}.accountNumber`
        const bankBalance = `${fieldIndex}.balance`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial || field?.dummy}
          >
            <Box position="absolute" className={styles.removeFieldButton}>
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={() => remove(index)}
                />
              )}
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={accountNumber}
                  name={accountNumber}
                  format={'#### - ## - ######'}
                  label={formatMessage(m.bankAccount)}
                  placeholder={formatMessage(m.bankAccountPlaceholder)}
                  backgroundColor="blue"
                  error={fieldError?.accountNumber}
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={bankBalance}
                  name={bankBalance}
                  label={formatMessage(m.bankAccountBalance)}
                  error={fieldError?.balance}
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
          {formatMessage(m.addBankAccount)}
        </Button>
      </Box>
    </Box>
  )
}
