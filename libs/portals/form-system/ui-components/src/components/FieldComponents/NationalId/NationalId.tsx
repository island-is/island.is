import {
  Input,
  Stack,
  GridColumn as Column,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { Dispatch } from 'react'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { useFormContext, Controller } from 'react-hook-form'
import { GET_NAME_BY_NATIONALID } from '@island.is/form-system/graphql'
import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
}

const nationalIdRegex = /^\d{6}-\d{4}$/

export const NationalId = ({ item, dispatch, hasError }: Props) => {
  const { formatMessage } = useIntl()
  const { control } = useFormContext()
  const name = getValue(item, 'name')
  const nationalId = getValue(item, 'nationalId')
  const shouldQuery =
    nationalIdRegex.test(nationalId) && (name === '' || name === undefined)

  const queryId =
    nationalId !== undefined ? nationalId.replace('-', '') : undefined

  const { data: nameData } = useQuery(GET_NAME_BY_NATIONALID, {
    variables: { input: queryId },
    fetchPolicy: 'cache-first',
    skip: !shouldQuery,
  })
  const [fetchedName, setFetchedName] = useState<string>('')

  useEffect(() => {
    if (shouldQuery && nameData?.formSystemNameByNationalId?.fulltNafn) {
      setFetchedName(nameData.formSystemNameByNationalId.fulltNafn)
    } else if (!shouldQuery) {
      setFetchedName('')
    }
  }, [shouldQuery, nameData, dispatch, item.id])

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Controller
            name={item.id}
            control={control}
            defaultValue={getValue(item, 'nationalId') ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
              pattern: {
                value: nationalIdRegex,
                message: formatMessage(m.InvalidNationalId),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.nationalId)}
                name="kennitala"
                required={item?.isRequired ?? false}
                backgroundColor="blue"
                value={field.value}
                onChange={(e) => {
                  const raw = e.target.value
                  let digits = raw.replace(/\D/g, '')
                  if (digits.length > 10) {
                    digits = digits.slice(0, 10)
                  }
                  const value =
                    digits.length > 6
                      ? digits.slice(0, 6) + '-' + digits.slice(6)
                      : digits
                  field.onChange(value)
                  if (dispatch) {
                    dispatch({
                      type: 'SET_NATIONAL_ID',
                      payload: {
                        id: item.id,
                        value: value,
                      },
                    })
                  }
                }}
                onBlur={field.onBlur}
                hasError={!!fieldState.error || !!hasError}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
      </Row>
      <Row>
        <Column span="10/10">
          <Input
            label={formatMessage(m.namePerson)}
            name="nafn"
            disabled
            value={fetchedName}
          />
        </Column>
      </Row>
    </Stack>
  )
}
