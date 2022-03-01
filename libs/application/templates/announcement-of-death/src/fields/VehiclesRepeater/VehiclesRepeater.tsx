import React, { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import {
  FieldBaseProps,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Vehicle, Property } from '../../types'

import * as styles from './VehiclesRepeater.css'

export const VehiclesRepeater: FC<FieldBaseProps> = ({
  application,
  errors,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Property>({ name: id })

  console.log('application', application)

  const handleAddVehicle = () =>
    append({
      propertyNumber: 'F2012397',
    })
  const handleRemoveVehicle = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard title="VU-U52" description="Alfa Romeo" heightFull />
        </GridColumn>
      </GridRow>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const vehicleNumberField = `${fieldIndex}.vehicleNumber`
        const addressField = `${fieldIndex}.address`

        return (
          <Box position="relative" key={field.id} marginTop={2}>
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
                  label="Bílnúmer"
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={addressField}
                  name={addressField}
                  label="Heimilisfang"
                  disabled
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
          Bæta við ökutæki
        </Button>
      </Box>
    </Box>
  )
}
