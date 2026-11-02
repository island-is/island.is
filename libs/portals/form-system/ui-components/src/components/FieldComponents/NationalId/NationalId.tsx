import { useQuery } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import {
  GET_COMPANY,
  IDENTITY_QUERY,
  removeTypename,
} from '@island.is/form-system/graphql'
import {
  Box,
  GridColumn as Column,
  Input,
  LoadingDots,
  GridRow as Row,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
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
  valueIndex?: number
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

export const NationalId = ({
  item,
  dispatch,
  hasError,
  valueIndex = 0,
}: Props) => {
  const { formatMessage } = useIntl()
  const { lang } = useLocale()
  const { control, setValue, clearErrors, setError, trigger } = useFormContext()
  const [lookupError, setLookupError] = useState<{
    nationalId: string
    message: string
  } | null>(null)
  const nationalIdField = `${item.id}.${valueIndex}`

  const watchedValue = useWatch({
    control,
    name: nationalIdField,
    defaultValue: getValue(item, 'nationalId', valueIndex) ?? '',
  }) as string

  const showAddress = item.fieldSettings?.showAddress ?? false

  const nationalId = (watchedValue ?? '').trim()
  const normalizedId = nationalId.replace(/\D/g, '')
  const queryId = normalizedId ? normalizedId : undefined
  const isCompleteNationalId = normalizedId.length === 10
  const isValidFormat = nationalIdRegex.test(nationalId)
  const isValidNationalId =
    isValidFormat &&
    (isIndividualNationalId(normalizedId) || isCompanyNationalId(normalizedId))

  const lastQueriedRef = useRef<string | undefined>(undefined)

  const shouldQueryBase =
    isCompleteNationalId &&
    isValidFormat &&
    queryId !== undefined &&
    lastQueriedRef.current !== queryId

  const shouldQueryIndividual =
    shouldQueryBase && isIndividualNationalId(queryId || '')

  const shouldQueryCompany =
    shouldQueryBase && isCompanyNationalId(queryId || '')

  const nameField = `${item.id}.${valueIndex}_name`
  const addressField = `${item.id}.${valueIndex}_address`
  const postalCodeField = `${item.id}.${valueIndex}_postalCode`
  const municipalityField = `${item.id}.${valueIndex}_municipality`

  // Keep RHF in sync with external "item" value (since Controller defaultValue won't update)
  useEffect(() => {
    setValue(nameField, getValue(item, 'name', valueIndex) ?? '')
    setValue(addressField, getValue(item, 'address', valueIndex) ?? '')
    setValue(postalCodeField, getValue(item, 'postalCode', valueIndex) ?? '')
    setValue(
      municipalityField,
      getValue(item, 'municipality', valueIndex) ?? '',
    )
  }, [
    item,
    nameField,
    addressField,
    postalCodeField,
    municipalityField,
    setValue,
    valueIndex,
  ])

  const handleLookupResult = (name: string) => {
    setValue(nameField, name, { shouldDirty: true, shouldValidate: !!name })
    if (!name) {
      const message = formatMessage(m.nationalIdLookupFailed)
      setLookupError({ nationalId, message })
      setError(nationalIdField, { type: 'validate', message })
    } else {
      setLookupError(null)
      clearErrors(nationalIdField)
      lastQueriedRef.current = queryId
    }
    dispatch?.({
      type: 'SET_NAME',
      payload: { id: item.id, value: name, valueIndex },
    })
  }

  const { loading: individualLoading } = useQuery(IDENTITY_QUERY, {
    variables: { input: { nationalId: queryId } },
    fetchPolicy: 'cache-first',
    skip: !shouldQueryIndividual,
    onCompleted: (nameData) => {
      if (!shouldQueryIndividual) return

      handleLookupResult(removeTypename(nameData?.identity?.name) ?? '')

      if (showAddress && nameData?.identity?.address) {
        const address = nameData.identity.address.streetAddress ?? ''
        const postalCode = nameData.identity.address.postalCode ?? ''
        const municipality = nameData.identity.address.city ?? ''

        setValue(addressField, address, {
          shouldDirty: true,
          shouldValidate: !!address,
        })
        setValue(postalCodeField, postalCode, {
          shouldDirty: true,
          shouldValidate: true,
        })
        setValue(municipalityField, municipality, {
          shouldDirty: true,
          shouldValidate: true,
        })

        if (dispatch) {
          dispatch({
            type: 'SET_ADDRESS',
            payload: {
              id: item.id,
              valueIndex,
              address,
              postalCode,
              municipality,
            },
          })
        }
      }
    },
    onError: () => {
      if (!shouldQueryIndividual) return

      handleLookupResult('')
    },
  })

  const { loading: companyLoading } = useQuery(GET_COMPANY, {
    variables: { input: { nationalId: queryId } },
    fetchPolicy: 'cache-first',
    skip: !shouldQueryCompany,
    onCompleted: (companyData) => {
      if (!shouldQueryCompany) return

      handleLookupResult(companyData?.companyRegistryCompany?.name ?? '')
    },
    onError: () => {
      if (!shouldQueryCompany) return

      handleLookupResult('')
    },
  })

  useEffect(() => {
    if (!isValidNationalId) {
      lastQueriedRef.current = undefined

      if (isValidFormat) {
        setError(nationalIdField, {
          type: 'validate',
          message: formatMessage(m.nationalIdLookupFailed),
        })
      }

      setValue(nameField, '')
      setValue(addressField, '')
      setValue(postalCodeField, '')
      setValue(municipalityField, '')

      if (dispatch) {
        dispatch({
          type: 'SET_NAME',
          payload: { id: item.id, value: '', valueIndex },
        })
        dispatch({
          type: 'SET_ADDRESS',
          payload: {
            id: item.id,
            valueIndex,
            address: '',
            postalCode: '',
            municipality: '',
          },
        })
      }
    }
  }, [
    isValidFormat,
    isValidNationalId,
    nationalIdField,
    setError,
    formatMessage,
    dispatch,
    item.id,
    valueIndex,
    nameField,
    addressField,
    postalCodeField,
    municipalityField,
    setValue,
  ])

  return (
    <Stack space={2}>
      <Row>
        <Column span={['1/1', '1/1', '5/10']}>
          <Controller
            key={`${item.id}-${valueIndex}`}
            name={nationalIdField}
            control={control}
            defaultValue={getValue(item, 'nationalId', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
              validate: (value) => {
                if (!value) {
                  return true
                }
                if (value.replace(/\D/g, '').length < 10) {
                  return formatMessage(m.InvalidNationalId)
                }
                if (
                  !nationalIdRegex.test(value) ||
                  (!isIndividualNationalId(value) &&
                    !isCompanyNationalId(value))
                ) {
                  return formatMessage(m.nationalIdLookupFailed)
                }
                return (
                  !lookupError ||
                  value !== lookupError.nationalId ||
                  lookupError.message
                )
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={item.name[lang] ?? formatMessage(m.nationalId)}
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
                  if (value !== field.value) {
                    setLookupError(null)
                    lastQueriedRef.current = undefined
                    setValue(nameField, '')
                    setValue(addressField, '')
                    setValue(postalCodeField, '')
                    setValue(municipalityField, '')
                    clearErrors([
                      field.name,
                      nameField,
                      addressField,
                      postalCodeField,
                      municipalityField,
                    ])
                    dispatch?.({
                      type: 'SET_NAME',
                      payload: { id: item.id, value: '', valueIndex },
                    })
                    dispatch?.({
                      type: 'SET_ADDRESS',
                      payload: {
                        id: item.id,
                        valueIndex,
                        address: '',
                        postalCode: '',
                        municipality: '',
                      },
                    })
                  }
                  setValue(field.name, value, { shouldDirty: true })
                  if (dispatch) {
                    dispatch({
                      type: 'SET_NATIONAL_ID',
                      payload: { id: item.id, value, valueIndex },
                    })
                  }
                }}
                onBlur={() => {
                  field.onBlur()
                  void trigger(field.name)
                }}
                hasError={!!fieldState.error || !!hasError}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
          {(individualLoading || companyLoading) && (
            <Box
              paddingTop={1}
              role="status"
              aria-label={item.name[lang] ?? formatMessage(m.nationalId)}
            >
              <LoadingDots size="medium" />
            </Box>
          )}
        </Column>
      </Row>

      <Row>
        <Column span="10/10">
          <Controller
            key={`${item.id}-${valueIndex}_name`}
            name={nameField}
            control={control}
            defaultValue={getValue(item, 'name', valueIndex) ?? ''}
            rules={{
              required: {
                value: item?.isRequired ?? false,
                message: formatMessage(m.required),
              },
            }}
            render={({ field, fieldState }) => (
              <Input
                label={formatMessage(m.namePerson)}
                name="nafn"
                required={item?.isRequired ?? false}
                backgroundColor="blue"
                value={field.value}
                readOnly
                hasError={!!fieldState.error || !!hasError}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </Column>
      </Row>

      {showAddress && (
        <>
          <Row>
            <Column span="10/10">
              <Controller
                key={`${item.id}-${valueIndex}_address`}
                name={addressField}
                control={control}
                defaultValue={getValue(item, 'address', valueIndex) ?? ''}
                rules={{
                  required: {
                    value: item?.isRequired ?? false,
                    message: formatMessage(m.required),
                  },
                }}
                render={({ field, fieldState }) => (
                  <Input
                    label={formatMessage(m.address)}
                    name="address"
                    required={item?.isRequired ?? false}
                    backgroundColor="blue"
                    value={field.value}
                    readOnly
                    hasError={!!fieldState.error || !!hasError}
                    errorMessage={fieldState.error?.message}
                  />
                )}
              />
            </Column>
          </Row>
          <Row>
            <Column span="3/10">
              <Controller
                key={`${item.id}-${valueIndex}_postalCode`}
                name={postalCodeField}
                control={control}
                defaultValue={getValue(item, 'postalCode', valueIndex) ?? ''}
                render={({ field }) => (
                  <Input
                    label={formatMessage(m.postalCode)}
                    name="postalCode"
                    backgroundColor="blue"
                    value={field.value}
                    readOnly
                  />
                )}
              />
            </Column>

            <Column span="7/10">
              <Controller
                key={`${item.id}-${valueIndex}_municipality`}
                name={municipalityField}
                control={control}
                defaultValue={getValue(item, 'municipality', valueIndex) ?? ''}
                render={({ field }) => (
                  <Input
                    label={formatMessage(m.city)}
                    name="municipality"
                    backgroundColor="blue"
                    value={field.value}
                    readOnly
                  />
                )}
              />
            </Column>
          </Row>
        </>
      )}
    </Stack>
  )
}
