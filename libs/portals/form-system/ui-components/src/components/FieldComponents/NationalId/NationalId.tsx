import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import {
  GET_COMPANY,
  IDENTITY_QUERY,
  removeTypename,
} from '@island.is/form-system/graphql'
import {
  GridColumn as Column,
  Input,
  GridRow as Row,
  Stack,
} from '@island.is/island-ui/core'
import { Dispatch, useEffect, useRef, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { Action } from '../../../lib'
import { getValue } from '../../../lib/getValue'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  dispatch?: Dispatch<Action>
  hasError?: boolean
}

const nationalIdRegex = /^\d{6}-\d{4}$/

const isIndividualNationalId = (id: string) => {
  // first two digits = 01 - 31
  const day = parseInt(id.substring(0, 2), 10)
  if (day < 1 || day > 31) return false
  return true
}

const isCompanyNationalId = (id: string) => {
  // first two digits = 41 - 71
  const day = parseInt(id.substring(0, 2), 10)
  if (day < 41 || day > 71) return false
  return true
}

// companyData.companyRegistryCompany.name

export const NationalId = ({ item, dispatch, hasError }: Props) => {
  const { formatMessage } = useIntl()
  const { control } = useFormContext()

  const [name, setName] = useState(getValue(item, 'name') ?? '')

  const watchedValue = useWatch({
    control,
    name: item.id,
    defaultValue: getValue(item, 'nationalId') ?? '',
  }) as string

  const nationalId = (watchedValue ?? '').trim()
  const normalizedId = nationalId.replace(/\D/g, '')
  const queryId = normalizedId ? normalizedId : undefined
  const isValidFormat = nationalIdRegex.test(nationalId)

  const lastQueriedRef = useRef<string | undefined>(undefined)

  const shouldQueryBase =
    isValidFormat && queryId !== undefined && lastQueriedRef.current !== queryId

  const shouldQueryIndividual =
    shouldQueryBase && isIndividualNationalId(queryId || '')

  const shouldQueryCompany =
    shouldQueryBase && isCompanyNationalId(queryId || '')

  const { data: _nameData } = useQuery(IDENTITY_QUERY, {
    variables: { input: { nationalId: queryId } },
    fetchPolicy: 'cache-first',
    skip: !shouldQueryIndividual,
    onCompleted: (nameData) => {
      const newName = removeTypename(nameData?.identity?.name)
      if (newName) {
        if (dispatch) {
          dispatch({
            type: 'SET_NAME',
            payload: { id: item.id, value: newName },
          })
        }
        setName(newName)
        lastQueriedRef.current = queryId
      }
    },
  })

  const { data: _companyData } = useQuery(GET_COMPANY, {
    variables: { input: { nationalId: queryId } },
    fetchPolicy: 'cache-first',
    skip: !shouldQueryCompany,
    onCompleted: (companyData) => {
      const fetched = companyData?.companyRegistryCompany?.name
      if (fetched) {
        if (dispatch) {
          dispatch({
            type: 'SET_NAME',
            payload: { id: item.id, value: fetched },
          })
        }
        setName(fetched)
        lastQueriedRef.current = queryId
      }
    },
  })

  useEffect(() => {
    if (!isValidFormat) {
      lastQueriedRef.current = undefined
      setName('')
      if (dispatch) {
        dispatch({
          type: 'SET_NAME',
          payload: { id: item.id, value: '' },
        })
      }
    }
  }, [isValidFormat, dispatch, item.id])

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
                  if (digits.length > 10) digits = digits.slice(0, 10)
                  const value =
                    digits.length > 6
                      ? digits.slice(0, 6) + '-' + digits.slice(6)
                      : digits
                  field.onChange(value)
                  if (dispatch) {
                    dispatch({
                      type: 'SET_NATIONAL_ID',
                      payload: { id: item.id, value },
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
            value={name}
          />
        </Column>
      </Row>
    </Stack>
  )
}
