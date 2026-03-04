import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
}

export const Banknumber = ({ item, dispatch }: Props) => {
  const { lang } = useLocale()
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
  ]
  const { formatMessage } = useIntl()
  const { control, watch } = useFormContext()

  // Watch all three fields
  const bank = watch(`${item.id}.bank`)
  const ledger = watch(`${item.id}.ledger`)
  const account = watch(`${item.id}.account`)

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
  const [bankDefault, ledgerDefault, accountDefault] =
    bankAccountValue.split('-')
  return (
    <>
      <Row>
        <Text variant="h4">{item.name?.[lang]}</Text>
      </Row>
      <Row marginTop={2}>
        <Column span="4/12">
          <Controller
            key={item.id}
            name={`${item.id}.bank`}
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
              maxLength: {
                value: m.maxBankNumbers.value,
                message: formatMessage(m.maxBankNumbers),
              },
            }}
            defaultValue={bankDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[0]}
                name={field.name}
                label={formatMessage(m.bank)}
                type="text"
                inputMode="numeric"
                maxLength={4}
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
            name={`${item.id}.ledger`}
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
              maxLength: {
                value: m.maxLedgerNumbers.value,
                message: formatMessage(m.maxLedgerNumbers),
              },
            }}
            defaultValue={ledgerDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[1]}
                name={field.name}
                label={formatMessage(m.ledger)}
                type="text"
                inputMode="numeric"
                maxLength={2}
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
            name={`${item.id}.account`}
            control={control}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
              maxLength: {
                value: m.maxAccountNumbers.value,
                message: formatMessage(m.maxAccountNumbers),
              },
            }}
            defaultValue={accountDefault ?? undefined}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[2]}
                name={field.name}
                label={formatMessage(m.accountNumber)}
                type="text"
                inputMode="numeric"
                maxLength={6}
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
