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
import { useFormContext, Controller } from 'react-hook-form'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  onErrorChange?: (fieldId: string, hasError: boolean) => void
}

export const Banknumber = ({
  item,
  dispatch,
  lang = 'is',
  onErrorChange,
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
              validate: (value) =>
                String(value).length <= 4 || 'Maximum 4 digits allowed',
            }}
            render={({ field, fieldState }) => (
              <Input
                ref={inputRefs[0]}
                name={field.name}
                label={formatMessage(m.bank)}
                type="number"
                value={field.value ?? ''}
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
                  if (onErrorChange) {
                    onErrorChange(item.id, !!fieldState.error)
                  }
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
              validate: (value) =>
                String(value).length <= 2 || 'Maximum 2 digits allowed',
            }}
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
                  if (onErrorChange) {
                    onErrorChange(item.id, !!fieldState.error)
                  }
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
              validate: (value) =>
                String(value).length <= 6 || 'Maximum 6 digits allowed',
            }}
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
                  if (onErrorChange) {
                    onErrorChange(item.id, !!fieldState.error)
                  }
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
