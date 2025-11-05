import { FC, useEffect, useCallback, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
  Input,
} from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalVehicle } from './AdditionalVehicle'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication, valueToNumber } from '../../lib/utils'
import { formatCurrency } from '@island.is/application/ui-components'
import DoubleColumnRow from '../DoubleColumnRow'

export const VehicleRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  field,
  errors,
}) => {
  const error = (errors as ErrorValue)?.estate?.vehicles
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update, replace } = useFieldArray({
    name: id,
  })

  const { clearErrors, getValues } = useFormContext()
  const [total, setTotal] = useState(0)

  const estateData = getEstateDataFromApplication(application)

  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: AssetFormField) => {
      if (!current.enabled) return acc
      const currentValue = valueToNumber(current.marketValue ?? '0', ',')
      return Number(acc) + currentValue
    }, 0)

    setTotal(total)
  }, [getValues, id])

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.vehicles) {
      replace(estateData.estate.vehicles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    calculateTotal()
  }, [fields, calculateTotal])

  const handleAddProperty = () =>
    append({
      share: 1,
      assetNumber: undefined,
      description: undefined,
      marketValue: undefined,
      initial: false,
      enabled: true,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.length > 0 &&
          fields.map((vehicle: AssetFormField, index) => {
            const fieldError = error && error[index] ? error[index] : null
            if (!vehicle.initial) {
              return null
            }
            return (
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={3}
                key={vehicle.id}
              >
                <ProfileCard
                  disabled={!vehicle.enabled}
                  title={vehicle?.description ?? vehicle?.assetNumber ?? ''}
                  description={[
                    `${formatMessage(m.propertyNumberVehicle)}: ${
                      vehicle.assetNumber
                    }`,
                    <Box marginTop={1} as="span">
                      <Button
                        variant="text"
                        icon={vehicle.enabled ? 'remove' : 'add'}
                        size="small"
                        iconType="outline"
                        onClick={() => {
                          const updatedVehicle = {
                            ...vehicle,
                            enabled: !vehicle.enabled,
                          }
                          update(index, updatedVehicle)
                          clearErrors(`${id}[${index}].marketValue`)
                        }}
                      >
                        {vehicle.enabled
                          ? formatMessage(m.inheritanceDisableMember)
                          : formatMessage(m.inheritanceEnableMember)}
                      </Button>
                    </Box>,
                  ]}
                />
                <Box marginTop={2}>
                  <InputController
                    id={`${id}[${index}].marketValue`}
                    name={`${id}[${index}].marketValue`}
                    label={formatMessage(m.marketValueTitle)}
                    disabled={!vehicle.enabled}
                    backgroundColor="blue"
                    placeholder="0 kr."
                    defaultValue={vehicle.marketValue}
                    error={fieldError?.marketValue}
                    currency
                    size="sm"
                    required
                    onChange={() => calculateTotal()}
                  />
                </Box>
              </GridColumn>
            )
          })}
      </GridRow>
      {fields.map((field: AssetFormField, index: number) => (
        <Box key={field.id} hidden={field.initial}>
          <AdditionalVehicle
            field={field}
            fieldName={id}
            remove={handleRemoveProperty}
            index={index}
            error={error && error[index] ? error[index] : null}
            calculateTotal={calculateTotal}
          />
        </Box>
      ))}
      <Box marginTop={2}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="small"
        >
          {formatMessage(m.addVehicle)}
        </Button>
      </Box>
      {!!fields.length && (
        <Box marginTop={5}>
          <GridRow>
            <DoubleColumnRow
              right={
                <Input
                  id={`${id}.total`}
                  name={`${id}.total`}
                  value={formatCurrency(String(isNaN(total) ? 0 : total))}
                  label={formatMessage(m.total)}
                  backgroundColor="white"
                  readOnly
                />
              }
            />
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default VehicleRepeater
