import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'
import { GET_VEHICLE_QUERY } from '../../graphql'
import { GetVehicleInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldComponentProps } from './types'

export const VehicleLookup = ({
  fieldIndex,
  fieldName,
  error,
  setLoadingFieldName,
  ...props
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()
  const { setValue, clearErrors } = useFormContext()
  const descriptionFieldName = `${fieldIndex}.description`
  const vehicleNumberInput = useWatch({
    name: fieldName,
  })
  const isInitial = useWatch({
    name: `${fieldIndex}.initial`,
    defaultValue: false,
  })

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: GetVehicleInput }>(GET_VEHICLE_QUERY, {
      onError: (_e) => {
        if (!isInitial) {
          setValue(descriptionFieldName, '')
        }
      },
      onCompleted: (data) => {
        const carName =
          `${data?.syslumennGetVehicle?.manufacturer} ${data.syslumennGetVehicle?.modelName}`.trim()
        if (
          carName.length === 0 ||
          carName.startsWith('null') ||
          carName.endsWith('null')
        ) {
          if (!isInitial) {
            setValue(descriptionFieldName, '')
          }
          return
        }
        clearErrors(descriptionFieldName)
        setValue(descriptionFieldName, carName)
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    setLoadingFieldName?.(queryLoading ? descriptionFieldName : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading])

  useEffect(() => {
    if (vehicleNumberInput === undefined) {
      return
    }

    const value = String(vehicleNumberInput)
    if (value.trim().length > 0) {
      getProperty({
        variables: {
          input: {
            vehicleId: value.trim().toUpperCase(),
          },
        },
      })
    } else if (!isInitial) {
      setValue(descriptionFieldName, '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleNumberInput, isInitial])

  return (
    <InputController
      id={fieldName}
      name={fieldName}
      label={formatMessage(m.propertyNumber)}
      defaultValue={vehicleNumberInput}
      error={error}
      {...props}
    />
  )
}
