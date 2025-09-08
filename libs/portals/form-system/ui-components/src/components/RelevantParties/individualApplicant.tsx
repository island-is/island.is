import { FormSystemField } from '@island.is/api/schema'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
  Text,
  PhoneInput,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m, webMessages } from '../../lib/messages'
import { NationalIdField } from './components/nationalIdField'
import {
  GET_NAME_BY_NATIONALID,
  GET_ADDRESS_BY_NATIONALID,
} from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { User } from './types'
import { ApplicationLoading } from '../ApplicationsLoading/ApplicationLoading'
import { Dispatch, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { Action } from '../../lib'
import { getValue } from '../../lib/getValue'
import { removeTypename } from '@island.is/form-system/graphql'
import { useFormContext, Controller } from 'react-hook-form'
import { Locale } from '@island.is/shared/types'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^[0-9+\-() ]{7,20}$/

interface Props {
  applicant: FormSystemField
  actor: string
  dispatch: Dispatch<Action>
  user?: User
}

export const IndividualApplicant = ({
  applicant,
  user,
  actor,
  dispatch,
}: Props) => {
  const { locale, formatMessage } = useIntl()
  const { lang } = useLocale()
  const nationalId = actor !== '' ? actor : user?.nationalId ?? ''
  const shouldQuery = !!nationalId
  const { control } = useFormContext()
  const { data: nameData, loading: nameLoading } = useQuery(
    GET_NAME_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
      onCompleted: (data) => {
        dispatch({
          type: 'SET_NAME',
          payload: {
            id: applicant.id,
            value: removeTypename(data.formSystemNameByNationalId.fulltNafn),
          },
        })
      },
    },
  )

  const { data: addressData, loading: addressLoading } = useQuery(
    GET_ADDRESS_BY_NATIONALID,
    {
      variables: { input: nationalId },
      fetchPolicy: 'cache-first',
      skip: !shouldQuery,
      onCompleted: (data) => {
        const home = removeTypename(
          data.formSystemHomeByNationalId.heimilisfang,
        )
        dispatch({
          type: 'SET_ADDRESS',
          payload: {
            id: applicant.id,
            address: home.husHeiti,
            postalCode: home.postnumer,
          },
        })
      },
    },
  )

  const address = addressData?.formSystemHomeByNationalId?.heimilisfang
  const isLoading = shouldQuery && (nameLoading || addressLoading)

  useEffect(() => {
    dispatch({
      type: 'SET_NATIONAL_ID',
      payload: { id: applicant.id, value: nationalId },
    })
  }, [dispatch, applicant.id, nationalId])

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicant?.name?.[lang]}
      </Text>
      <Stack space={2}>
        {isLoading ? (
          <ApplicationLoading />
        ) : (
          <>
            <NationalIdField
              disabled
              nationalId={nationalId}
              name={nameData?.formSystemNameByNationalId?.fulltNafn}
            />
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Input
                  label={formatMessage(m.address)}
                  name="address"
                  placeholder={formatMessage(m.address)}
                  disabled
                  value={address?.husHeiti ?? ''}
                />
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                <Box marginTop={[2, 2, 0, 0]}>
                  <Input
                    label={formatMessage(webMessages.postalCode)}
                    name="postalCode"
                    placeholder={formatMessage(webMessages.postalCode)}
                    disabled
                    value={address?.postnumer ?? ''}
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
                  value: applicant?.isRequired ?? false,
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
                  required={applicant?.isRequired ?? false}
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
        )}
      </Stack>
    </Box>
  )
}
