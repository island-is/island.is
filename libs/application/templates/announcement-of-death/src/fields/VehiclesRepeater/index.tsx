import React, { FC, useEffect } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, Asset } from '../../types'

import { EstateAsset } from '@island.is/clients/syslumenn'

import * as styles from './styles.css'
import { m } from '../../lib/messages'

export const VehiclesRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers>>
> = ({ application, field, errors }) => {
  const error = (errors as any)?.vehicles?.vehicles
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray({
    name: `${id}.vehicles`,
  })
  const { control, setValue } = useFormContext()
  const externalData = application.externalData.syslumennOnEntry?.data as {
    estate: { vehicles: EstateAsset[] }
  }

  useEffect(() => {
    if (
      fields.length === 0 &&
      (!application.answers.vehicles ||
        !application.answers.vehicles?.encountered) &&
      externalData.estate.vehicles
    ) {
      append(externalData.estate.vehicles)
      setValue('vehicles.encountered', true)
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
        {fields.reduce((acc, asset: GenericFormField<Asset>, index) => {
          if (!asset.initial) {
            return acc
          }
          return [
            ...acc,
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
                      icon="trash"
                      size="small"
                      iconType="outline"
                      onClick={() => remove(index)}
                    >
                      {formatMessage(m.inheritanceRemoveMember)}
                    </Button>
                  </Box>,
                ]}
                heightFull
              />
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: GenericFormField<Asset>, index) => {
        const fieldIndex = `${id}.vehicles[${index}]`
        const vehicleNumberField = `${fieldIndex}.assetNumber`
        const vehicleTypeField = `${fieldIndex}.description`
        const initialField = `${fieldIndex}.initial`
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
              render={() => <input type="hidden" />}
            />
            <Controller
              name={dummyField}
              control={control}
              defaultValue={field.dummy || false}
              render={() => <input type="hidden" />}
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
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={vehicleTypeField}
                  name={vehicleTypeField}
                  label={formatMessage(m.vehicleTypeLabel)}
                  defaultValue={field.description}
                  placeholder={formatMessage(m.vehiclesPlaceholder)}
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
