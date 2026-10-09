import { useQuery } from '@apollo/client'
import {
  FormSystemField,
  GetRegistryPersonInput,
  Query,
} from '@island.is/api/schema'
import { DECEASED_IDENTITY_QUERY } from '@island.is/form-system/graphql'
import {
  GridColumn as Column,
  GridRow as Row,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Dispatch, useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  valueIndex?: number
  dispatch?: Dispatch<Action>
}

const nationalIdRegex = /^\d{6}-\d{4}$/

export const Estate = ({ item, valueIndex = 0, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { control, setValue } = useFormContext()
  const nationalIdField = `${item.id}.${valueIndex}`
  const nameField = `${item.id}.${valueIndex}_name`
  const watchedNationalId = useWatch({
    control,
    name: nationalIdField,
    defaultValue: getValue(item, 'nationalId', valueIndex) ?? '',
  }) as string
  const nationalId = watchedNationalId?.trim() ?? ''
  const queryId = nationalId.replace(/\D/g, '')
  const isValidFormat = nationalIdRegex.test(nationalId)

  useEffect(() => {
    setValue(nameField, getValue(item, 'name', valueIndex) ?? '')
  }, [item, nameField, setValue, valueIndex])

  const { loading } = useQuery<Query, { input: GetRegistryPersonInput }>(
    DECEASED_IDENTITY_QUERY,
    {
      variables: { input: { nationalId: queryId } },
      fetchPolicy: 'network-only',
      skip: !isValidFormat,
      onCompleted: (data) => {
        const name = data?.syslumennGetRegistryPerson?.name ?? ''

        setValue(nameField, name, { shouldDirty: true, shouldValidate: true })
        dispatch?.({
          type: 'SET_NAME',
          payload: { id: item.id, value: name, valueIndex },
        })
      },
    },
  )

  return (
    <Stack space={2}>
      <Row>
        <Column span={['1/1', '1/1', '5/10']}>
          <Controller
            name={nationalIdField}
            control={control}
            defaultValue={getValue(item, 'nationalId', valueIndex) ?? ''}
            rules={{
              required: {
                value: item.isRequired ?? false,
                message: formatMessage(m.required),
              },
              pattern: {
                value: nationalIdRegex,
                message: formatMessage(m.InvalidNationalId),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={item.name?.[lang] ?? formatMessage(m.nationalId)}
                name="estateNationalId"
                required={item.isRequired ?? false}
                backgroundColor="blue"
                value={field.value}
                onChange={(event) => {
                  const digits = event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 10)
                  const value =
                    digits.length > 6
                      ? `${digits.slice(0, 6)}-${digits.slice(6)}`
                      : digits

                  field.onChange(value)
                  dispatch?.({
                    type: 'SET_NATIONAL_ID',
                    payload: { id: item.id, value, valueIndex },
                  })
                  if (value !== field.value) {
                    setValue(nameField, '')
                    dispatch?.({
                      type: 'SET_NAME',
                      payload: { id: item.id, value: '', valueIndex },
                    })
                  }
                }}
                onBlur={field.onBlur}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Controller
            name={nameField}
            control={control}
            defaultValue={getValue(item, 'name', valueIndex) ?? ''}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.namePerson)}
                name="estateName"
                backgroundColor="blue"
                value={field.value}
                readOnly
                loading={loading}
                hasError={Boolean(fieldState.error)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
      </Row>
    </Stack>
  )
}
