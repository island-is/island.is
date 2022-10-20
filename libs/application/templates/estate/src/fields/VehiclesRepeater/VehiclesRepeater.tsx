import React, { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, Asset } from '../../types'

import { EstateAsset } from '@island.is/clients/syslumenn'

import * as styles from '../styles.css'
import { m } from '../../lib/messages'

export const VehiclesRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const error = (errors as any)?.estate?.vehicles
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Asset>({
    name: id,
  })
  const { control, setValue } = useFormContext()

  const externalData = application.externalData.syslumennOnEntry?.data as {
    estate: { vehicles: EstateAsset[] }
  }

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.vehicles) {
      append(externalData.estate.vehicles)
    }
  }, [])

  const handleAddVehicle = () =>
    append({
      assetNumber: '',
      description: '',
    })
  const handleRemoveVehicle = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset, index) => {
          if (!asset.initial) {
            return acc
          }
          return [
            <GridColumn
              key={asset.id}
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <ProfileCard
                title={asset.assetNumber}
                description={[
                  `${asset.description}`,
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={asset.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() =>
                        setValue(`${id}[${index}].enabled`, !asset.enabled)
                      }
                    >
                      {asset.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
                heightFull
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const vehicleNumberField = `${fieldIndex}.assetNumber`
        const vehicleTypeField = `${fieldIndex}.description`
        const initialField = `${fieldIndex}.initial`
        const enabledField = `${fieldIndex}.enabled`
        const dummyField = `${fieldIndex}.dummy`
        const fieldError = error && error[index] ? error[index] : null

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial || field?.dummy}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
            />
            <Controller
              name={enabledField}
              control={control}
              defaultValue={field.enabled || false}
            />
            <Controller
              name={dummyField}
              control={control}
              defaultValue={field.dummy || false}
            />

            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveVehicle.bind(null, index)}
              />
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={vehicleNumberField}
                  name={vehicleNumberField}
                  label={formatMessage(m.vehicleNumberLabel)}
                  backgroundColor="blue"
                  defaultValue={field.assetNumber}
                  error={fieldError?.assetNumber}
                  size="sm"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={vehicleTypeField}
                  name={vehicleTypeField}
                  label={formatMessage(m.vehicleTypeLabel)}
                  defaultValue={field.description}
                  placeholder={formatMessage(m.vehiclesPlaceholder)}
                  size="sm"
                  //Make readOnly again when Vehicle Registry query is available
                  //readOnly
                />
              </GridColumn>
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddVehicle}
          size="small"
        >
          {formatMessage(m.addVehicle)}
        </Button>
      </Box>
    </Box>
  )
}
