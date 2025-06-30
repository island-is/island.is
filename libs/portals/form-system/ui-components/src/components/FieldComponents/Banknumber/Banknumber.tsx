import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useRef } from 'react'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
}

export const Banknumber = ({
  item,
  dispatch,
  lang = 'is',
}: Props) => {
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
  ]
  const { formatMessage } = useIntl()
  const { control, watch } = useFormContext()

  // Watch all three fields
  const bank = watch('bank')
  const ledger = watch('ledger')
  const account = watch('account')

  // Combine and dispatch value on change
  useEffect(() => {
    const combinedValue = `${bank ?? ''}-${ledger ?? ''}-${account ?? ''}`
    if (dispatch) {
      dispatch({
        type: 'SET_BANK_ACCOUNT',
        payload: { value: combinedValue, id: item.id },
      })
    }
  }, [bank, ledger, account, dispatch, item.id])

  // Helper for leading zeros
  const addLeadingZeros = (originalNumber: string, max: number) => {
    const zerosToAdd = max - originalNumber.length
    if (zerosToAdd <= 0) {
      return originalNumber
    }
    if (originalNumber.length === 0) {
      return originalNumber
    }
    const leadingZeros = '0'.repeat(zerosToAdd)
    return leadingZeros + originalNumber
  }

const bankAccountValue = getValue(item, 'bankAccount') ?? ''
const [bankDefault, ledgerDefault, accountDefault] = bankAccountValue.split('-')
console.log('bankDefault', bankDefault)
console.log('ledgerDefault', ledgerDefault)
console.log('accountDefault', accountDefault)
  return (
    <>
      <Row>
        <Text variant="h4">{item.name?.[lang]}</Text>
      </Row>
      <Row marginTop={2}>
        <Column span="4/12">
          <Controller
            name="bank"
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: 'Þessi reitur má ekki vera tómur',
              },
              maxLength: {
                value: 4,
                message: 'Hámark 4 tölustafir leyfðir',
              }
            }}
              defaultValue={bankDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[0]}
                name={field.name}
                label={formatMessage(m.bank)}
                type="number"
                value={field.value ?? undefined}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                  if (value.length === 4) {
                    inputRefs[1].current?.focus()
                  }
                }}
                onBlur={(e) => {
                  const formatted = addLeadingZeros(e.target.value, 4)
                  field.onChange(formatted)
                  field.onBlur()
                }}
                required={item?.isRequired ?? false}
                backgroundColor="blue"
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
        <Column span="3/12">
          <Controller
            name="ledger"
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: 'Þessi reitur má ekki vera tómur',
              },
              maxLength: {
                value: 2,
                message: 'Hámark 4 tölustafir leyfðir',
              }
            }}
            defaultValue={ledgerDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[1]}
                name={field.name}
                label={formatMessage(m.ledger)}
                type="number"
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                  if (value.length === 2) {
                    inputRefs[2].current?.focus()
                  }
                }}
                onBlur={(e) => {
                  const formatted = addLeadingZeros(e.target.value, 2)
                  field.onChange(formatted)
                  field.onBlur()
                }}
                required={item?.isRequired ?? false}
                backgroundColor="blue"
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
        <Column span="4/12">
          <Controller
            name="account"
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: 'Þessi reitur má ekki vera tómur',
              },
            maxLength: {
                value: 6,
                message: 'Hámark 4 tölustafir leyfðir',
              }
            }}
            defaultValue={accountDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[2]}
                name={field.name}
                label={formatMessage(m.accountNumber)}
                type="number"
                value={field.value ?? ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                }}
                onBlur={(e) => {
                  const formatted = addLeadingZeros(e.target.value, 6)
                  field.onChange(formatted)
                  field.onBlur()
                }}
                required={item?.isRequired ?? false}
                backgroundColor="blue"
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
      </Row>
    </>
  )
}
