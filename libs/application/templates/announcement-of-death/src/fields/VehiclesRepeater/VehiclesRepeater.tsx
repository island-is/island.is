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
import { Answers, Asset } from '../../types'

import * as styles from './VehiclesRepeater.css'
import { m } from '../../lib/messages'

export const VehiclesRepeater: FC<FieldBaseProps<Answers>> = ({ field }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Asset>({ name: id })

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
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const vehicleNumberField = `${fieldIndex}.assetNumber`
        const vehicleTypeField = `${fieldIndex}.description`

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
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
