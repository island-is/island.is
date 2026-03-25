import { FormSystemField } from '@island.is/api/schema'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  PhoneInput,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../lib'
import { getValue } from '../../lib/getValue'
import { m } from '../../lib/messages'
import { NationalIdField } from './components/nationalIdField'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/

interface Props {
  applicant: FormSystemField
  nationalId: string
  dispatch: Dispatch<Action>
}

export const IndividualApplicant = ({
  applicant,
  nationalId,
  dispatch,
}: Props) => {
  const { locale, formatMessage } = useIntl()
  const { lang } = useLocale()
  const { control, setValue, unregister } = useFormContext()

  const emailFromState = getValue(applicant, 'email') ?? ''
  const phoneNumberFromState = getValue(applicant, 'phoneNumber') ?? ''

  const isEmailRequired = !!applicant.fieldSettings?.isEmailRequired
  const isPhoneRequired = !!applicant.fieldSettings?.isPhoneRequired

  useEffect(() => {
    const key = `${applicant.id}.email`

    if (isEmailRequired) {
      if (emailFromState) {
        setValue(key, emailFromState, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: true,
        })
      }
    } else {
      unregister(key)
    }
  }, [isEmailRequired, emailFromState, applicant.id, setValue, unregister])

  useEffect(() => {
    const key = `${applicant.id}.phoneNumber`

    if (isPhoneRequired) {
      if (phoneNumberFromState) {
        setValue(key, phoneNumberFromState, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: true,
        })
      }
    } else {
      unregister(key)
    }
  }, [
    isPhoneRequired,
    phoneNumberFromState,
    applicant.id,
    setValue,
    unregister,
  ])

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicant?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <>
          <NationalIdField
            nationalId={nationalId}
            name={getValue(applicant, 'name')}
          />
          <GridRow>
            <GridColumn span={['12/12', '12/12', '8/12', '8/12']}>
              <Input
                label={formatMessage(m.address)}
                name="address"
                readOnly
                value={getValue(applicant, 'address') || ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '4/12', '4/12']}>
              <Box marginTop={[2, 2, 0, 0]}>
                <Input
                  label={formatMessage(m.postalCode)}
                  name="postalCode"
                  readOnly
                  value={getValue(applicant, 'postalCode') || ''}
                />
              </Box>
            </GridColumn>
          </GridRow>

          {applicant.fieldSettings?.isEmailRequired && (
            <Controller
              name={`${applicant.id}.email`}
              control={control}
              defaultValue={getValue(applicant, 'email') ?? ''}
              rules={{
                required: {
                  value: true,
                  message: formatMessage(m.required),
                },
                pattern: {
                  value: EMAIL_REGEX,
                  message: formatMessage(m.invalidEmail),
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  type="email"
                  name={field.name}
                  label={formatMessage(m.email)}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e)
                    if (dispatch) {
                      dispatch({
                        type: 'SET_EMAIL',
                        payload: {
                          id: applicant.id,
                          value: e.target.value,
                        },
                      })
                    }
                  }}
                  onBlur={field.onBlur}
                  errorMessage={fieldState.error?.message}
                  required={true}
                  backgroundColor="blue"
                />
              )}
            />
          )}
          {/* Phone number field */}
          {applicant.fieldSettings?.isPhoneRequired && (
            <Controller
              name={`${applicant.id}.phoneNumber`}
              control={control}
              defaultValue={getValue(applicant, 'phoneNumber') ?? ''}
              rules={{
                required: {
                  value: true,
                  message: formatMessage(m.required),
                },
                pattern: {
                  value: PHONE_REGEX,
                  message: formatMessage(m.invalidPhoneNumber),
                },
              }}
              render={({ field, fieldState }) => (
                <PhoneInput
                  label={formatMessage(m.phoneNumber)}
                  placeholder={formatMessage(m.phoneNumber)}
                  name={field.name}
                  locale={locale as Locale}
                  required={true}
                  backgroundColor="blue"
                  value={field.value}
                  onFormatValueChange={(formattedValue: string) => {
                    // This is the full value PhoneInput constructs (e.g. "+3545812345")
                    field.onChange(formattedValue)
                    dispatch?.({
                      type: 'SET_PHONE_NUMBER',
                      payload: {
                        id: applicant.id,
                        value: formattedValue,
                      },
                    })
                  }}
                  onBlur={field.onBlur}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />
          )}
        </>
      </Stack>
    </Box>
  )
}
