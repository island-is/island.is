import { FC, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { AssetFormField, ErrorValue } from '../../types'

import { m } from '../../lib/messages'
import { AdditionalVehicle } from './AdditionalVehicle'
import { InputController } from '@island.is/shared/form-fields'
import { getEstateDataFromApplication } from '../../lib/utils'

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

  const { clearErrors } = useFormContext()

  const estateData = getEstateDataFromApplication(application)

  useEffect(() => {
    if (fields.length === 0 && estateData.estate?.vehicles) {
      replace(estateData.estate.vehicles)
    }
  }, [])

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
                    `${formatMessage(m.propertyNumber)}: ${
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
          />
        </Box>
      ))}
      <Box marginTop={1}>
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
    </Box>
  )
}

export default VehicleRepeater
