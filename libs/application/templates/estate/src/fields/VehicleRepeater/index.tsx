import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Button } from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalVehicle } from './AdditionalVehicle'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication } from '../../lib/utils'
import { RepeaterTotal } from '../RepeaterTotal'
import { useRepeaterTotal } from '../../hooks/useRepeaterTotal'

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

  const { clearErrors, getValues, control } = useFormContext()

  const { total, calculateTotal } = useRepeaterTotal(
    id,
    getValues,
    fields,
    (field: AssetFormField) => field.marketValue,
  )

  useEffect(() => {
    const estateData = getEstateDataFromApplication(application)
    if (fields.length === 0 && estateData.estate?.vehicles) {
      replace(estateData.estate.vehicles)
    }
  }, [application, fields.length, replace])

  const handleAddProperty = () =>
    append({
      share: 1,
      assetNumber: '',
      description: '',
      marketValue: '',
      initial: false,
      enabled: true,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  const handleToggleEnabled = (vehicle: AssetFormField, index: number) => {
    const updatedVehicle = {
      ...vehicle,
      enabled: !vehicle.enabled,
    }
    update(index, updatedVehicle)
    clearErrors(`${id}[${index}].marketValue`)
    calculateTotal()
  }

  return (
    <Box marginTop={2}>
      {fields.map((vehicle: AssetFormField, index) => {
        const fieldIndex = `${id}[${index}]`
        const fieldError = error && error[index] ? error[index] : null

        // Render additional (user-added) vehicles with the existing component
        if (!vehicle.initial) {
          return (
            <AdditionalVehicle
              key={vehicle.id}
              field={vehicle}
              fieldName={id}
              remove={handleRemoveProperty}
              index={index}
              error={fieldError}
              calculateTotal={calculateTotal}
            />
          )
        }

        // Render initial (prefilled) vehicles with the same layout style as inheritance-report
        return (
          <Box position="relative" key={vehicle.id} marginTop={4}>
            <Controller
              name={`${fieldIndex}.initial`}
              control={control}
              defaultValue={vehicle.initial}
              render={() => <input type="hidden" />}
            />
            <Controller
              name={`${fieldIndex}.enabled`}
              control={control}
              defaultValue={vehicle.enabled}
              render={() => <input type="hidden" />}
            />
            <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
              <Button
                variant="text"
                size="small"
                icon={vehicle.enabled ? 'remove' : 'add'}
                onClick={() => handleToggleEnabled(vehicle, index)}
              >
                {vehicle.enabled
                  ? formatMessage(m.disable)
                  : formatMessage(m.activate)}
              </Button>
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${fieldIndex}.assetNumber`}
                  name={`${fieldIndex}.assetNumber`}
                  label={formatMessage(m.propertyNumberVehicle)}
                  backgroundColor="blue"
                  defaultValue={vehicle.assetNumber}
                  readOnly
                  disabled={!vehicle.enabled}
                  error={fieldError?.assetNumber}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={`${fieldIndex}.description`}
                  name={`${fieldIndex}.description`}
                  label={formatMessage(m.vehicleNameLabel)}
                  defaultValue={vehicle.description}
                  readOnly
                  disabled={!vehicle.enabled}
                  error={fieldError?.description}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']}>
                <InputController
                  id={`${fieldIndex}.marketValue`}
                  name={`${fieldIndex}.marketValue`}
                  label={formatMessage(m.marketValueTitle)}
                  placeholder="0 kr."
                  defaultValue={vehicle.marketValue}
                  error={fieldError?.marketValue}
                  currency
                  backgroundColor="blue"
                  disabled={!vehicle.enabled}
                  required
                  onChange={() => calculateTotal()}
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
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
      <RepeaterTotal id={id} total={total} show={!!fields.length} />
    </Box>
  )
}

export default VehicleRepeater
