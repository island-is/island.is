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
import { Dispatch } from 'react'
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
  const { control } = useFormContext()

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicant?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <>
          <NationalIdField
            disabled
            nationalId={nationalId}
            name={getValue(applicant, 'name')}
          />
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
              <Input
                label={formatMessage(m.address)}
                name="address"
                placeholder={formatMessage(m.address)}
                disabled
                value={getValue(applicant, 'address') || ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
              <Box marginTop={[2, 2, 0, 0]}>
                <Input
                  label={formatMessage(m.postalCode)}
                  name="postalCode"
                  placeholder={formatMessage(m.postalCode)}
                  disabled
                  value={getValue(applicant, 'postalCode') || ''}
                />
              </Box>
            </GridColumn>
          </GridRow>
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
          {/* Phone number field */}
          <Controller
            name={`${applicant.id}.phoneNumber`}
            control={control}
            defaultValue={getValue(applicant, 'phoneNumber') ?? ''}
            rules={{
              required: {
                value: applicant.isRequired ?? false,
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
                required={applicant.isRequired ?? false}
                backgroundColor="blue"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e)
                  if (dispatch) {
                    dispatch({
                      type: 'SET_PHONE_NUMBER',
                      payload: {
                        id: applicant.id,
                        value: e.target.value,
                      },
                    })
                  }
                }}
                onBlur={field.onBlur}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </>
      </Stack>
    </Box>
  )
}
