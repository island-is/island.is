import React, { FC } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Property } from '../../types'

import * as styles from './VehiclesRepeater.css'
import { m } from '../../lib/messages'

export const VehiclesRepeater: FC<FieldBaseProps> = ({ field }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Property>({ name: id })

  const handleAddVehicle = () =>
    append({
      propertyNumber: 'F2012397',
    })
  const handleRemoveVehicle = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            // TODO: Get data
            title="VU-U52"
            description={[
              'Alfa Romeo',
              <Box marginTop={1} as="span">
                <Button
                  variant="text"
                  icon="trash"
                  size="small"
                  iconType="outline"
                >
                  {formatMessage(m.inheritanceRemoveMember)}
                </Button>
              </Box>,
            ]}
            heightFull
          />
        </GridColumn>
      </GridRow>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const vehicleNumberField = `${fieldIndex}.vehicleNumber`
        const vehicleTypeField = `${fieldIndex}.vehicleType`

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
                  label={formatMessage(m.vehicleNumberLabel)}
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={vehicleTypeField}
                  name={vehicleTypeField}
                  label={formatMessage(m.vehicleTypeLabel)}
                  readOnly
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
