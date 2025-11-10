import { useEffect } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { AssetFormField } from '../../types'
import * as styles from '../styles.css'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { GET_VEHICLE_QUERY } from '../../graphql'
import { GetVehicleInput, Query } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'

export const AdditionalVehicle = ({
  field,
  index,
  remove,
  fieldName,
  error,
  calculateTotal,
}: {
  field: AssetFormField
  fieldName: string
  index: number
  remove: (index: number) => void
  error: Record<string, string>
  calculateTotal?: () => void
}) => {
  const fieldIndex = `${fieldName}[${index}]`
  const vehicleNumberField = `${fieldIndex}.assetNumber`
  const vehicleNumberInput = useWatch({
    name: vehicleNumberField,
    defaultValue: '',
  })
  const nameField = `${fieldIndex}.description`
  const name = useWatch({ name: nameField, defaultValue: '' })
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const shareField = `${fieldIndex}.share`
  const marketValueField = `${fieldIndex}.marketValue`

  const { control, setValue, clearErrors } = useFormContext()

  const { formatMessage } = useLocale()

  const [getProperty, { loading: queryLoading, error: _queryError }] =
    useLazyQuery<Query, { input: GetVehicleInput }>(GET_VEHICLE_QUERY, {
      onError: (_e) => {
        setValue(nameField, '')
      },
      onCompleted: (data) => {
        const carName =
          `${data?.syslumennGetVehicle?.manufacturer} ${data.syslumennGetVehicle?.modelName}`.trim()
        if (
          carName.length === 0 ||
          carName.startsWith('null') ||
          carName.endsWith('null')
        ) {
          setValue(nameField, '')
          return
        }
        clearErrors(nameField)
        setValue(nameField, carName)
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    if (vehicleNumberInput.trim().length > 0) {
      getProperty({
        variables: {
          input: {
            vehicleId: vehicleNumberInput.trim().toUpperCase(),
          },
        },
      })
    } else {
      setValue(nameField, '')
    }
  }, [getProperty, name, nameField, vehicleNumberInput, setValue])

  return (
    <Box position="relative" key={field.id} marginTop={2}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={shareField}
        control={control}
        defaultValue={field.share || ''}
        render={() => <input type="hidden" />}
      />
      <Text variant="h4">{formatMessage(m.vehicleRepeaterHeader)}</Text>
      <Box position="absolute" className={styles.removeFieldButton}>
        <Button
          variant="ghost"
          size="small"
          circle
          icon="remove"
          onClick={() => remove(index)}
        />
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
          <InputController
            id={vehicleNumberField}
            name={vehicleNumberField}
            label={formatMessage(m.propertyNumberVehicle)}
            backgroundColor="blue"
            defaultValue={field.assetNumber}
            error={error?.assetNumber}
            placeholder="JOL25"
            required
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
          <InputController
            id={nameField}
            name={nameField}
            label={formatMessage(m.vehicleNameLabel)}
            loading={queryLoading}
            readOnly
            defaultValue={field.description}
            error={
              error?.description
                ? error.description
                : queryLoading
                ? ''
                : undefined
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']}>
          <InputController
            id={marketValueField}
            name={marketValueField}
            label={formatMessage(m.vehicleMarketLabel)}
            defaultValue={field.marketValue}
            placeholder={'0 kr.'}
            error={error?.marketValue}
            currency
            size="sm"
            required
            onChange={() => calculateTotal?.()}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default AdditionalVehicle
