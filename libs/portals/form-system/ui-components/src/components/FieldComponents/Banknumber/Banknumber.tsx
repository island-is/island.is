import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { ApplicantTypesEnum } from '@island.is/form-system/enums'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { USER_PROFILE } from '@island.is/portals/my-pages/graphql'
import { Dispatch, useEffect, useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action, ApplicationState } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  valueIndex?: number
  state?: ApplicationState
}

export const Banknumber = ({
  item,
  dispatch,
  valueIndex = 0,
  state,
}: Props) => {
  const { lang } = useLocale()
  const inputRefs = [
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    useRef<HTMLInputElement | HTMLTextAreaElement>(null),
  ]
  const { formatMessage } = useIntl()
  const { control, watch, getValues, getFieldState, setValue } =
    useFormContext()
  const didHydrateFromProfile = useRef(false)

  const bankField = `${item.id}.${valueIndex}_bank`
  const ledgerField = `${item.id}.${valueIndex}_ledger`
  const accountField = `${item.id}.${valueIndex}_account`
  const savedBankAccount = getValue(item, 'bankAccount', valueIndex) ?? ''
  const bankAccountValue = savedBankAccount === '--' ? '' : savedBankAccount
  const hasDelegationApplicant =
    state?.screens.some((screen) =>
      screen.fields?.some((field) =>
        Object.values(ApplicantTypesEnum).some(
          (type) =>
            type !== ApplicantTypesEnum.INDIVIDUAL &&
            type === field?.fieldSettings?.applicantType,
        ),
      ),
    ) ?? false
  const { data: userProfileData, error: userProfileError } = useQuery(
    USER_PROFILE,
    {
      fetchPolicy: 'cache-first',
      skip: hasDelegationApplicant || !!bankAccountValue,
    },
  )

  useEffect(() => {
    didHydrateFromProfile.current = false
  }, [item.id, valueIndex])

  // Watch all three fields
  const bank = watch(bankField)
  const ledger = watch(ledgerField)
  const account = watch(accountField)

  // Combine and dispatch value on change
  useEffect(() => {
    const allUninitialized =
      bank === undefined && ledger === undefined && account === undefined
    if (allUninitialized) return

    const combinedValue =
      bank || ledger || account
        ? `${bank ?? ''}-${ledger ?? ''}-${account ?? ''}`
        : ''
    if (dispatch) {
      dispatch({
        type: 'SET_BANK_ACCOUNT',
        payload: { value: combinedValue, id: item.id, valueIndex },
      })
    }
  }, [bank, ledger, account, dispatch, item.id, valueIndex])

  useEffect(() => {
    if (hasDelegationApplicant) return
    if (didHydrateFromProfile.current) return

    const fields = [bankField, ledgerField, accountField]
    const hasExistingInput = fields.some((name) => {
      const { isDirty, isTouched } = getFieldState(name)
      return !!getValues(name) || isDirty || isTouched
    })

    if (bankAccountValue || hasExistingInput || userProfileError) {
      didHydrateFromProfile.current = true
      return
    }
    if (!userProfileData) return

    didHydrateFromProfile.current = true
    const bankInfo = userProfileData.getUserProfile?.bankInfo
    if (!bankInfo || !/^\d{1,4}-\d{1,2}-\d{1,6}$/.test(bankInfo)) return

    const parts = bankInfo.split('-')
    fields.forEach((name, index) => {
      setValue(name, parts[index], {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      })
    })
  }, [
    bank,
    ledger,
    account,
    bankField,
    ledgerField,
    accountField,
    bankAccountValue,
    hasDelegationApplicant,
    userProfileData,
    userProfileError,
    getValues,
    getFieldState,
    setValue,
  ])

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

  const [bankDefault, ledgerDefault, accountDefault] =
    bankAccountValue.split('-')
  return (
    <>
      <Row>
        <Text variant="h4">{item.name?.[lang]}</Text>
      </Row>
      <Row marginTop={1}>
        <Column span="4/12">
          <Controller
            key={`${item.id}-${valueIndex}-bank`}
            name={bankField}
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
            key={`${item.id}-${valueIndex}-ledger`}
            name={ledgerField}
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
            key={`${item.id}-${valueIndex}-account`}
            name={accountField}
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
