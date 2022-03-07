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
import { Property, RelationEnum } from '../../types'

import * as styles from './RealEstateAndLandsRepeater.css'

export const RealEstateAndLandsRepeater: FC<FieldBaseProps> = ({
  application,
  errors,
  field,
}) => {
  const { id, title } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Property>({ name: id })

  const handleAddProperty = () =>
    append({
      propertyNumber: 'F2012397',
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            title="Mosagata 13, 210 Garðabær"
            description={['Fastanúmer: 16313', 'Eignarhluti: 50%']}
            heightFull
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            title="Bolholt 8, 105 Reykjavík"
            description={['Fastanúmer: 13871', 'Eignarhluti: 50%']}
            heightFull
          />
        </GridColumn>
      </GridRow>
      {fields.map((field, index) => {
        const fieldIndex = `${id}[${index}]`
        const propertyNumberField = `${fieldIndex}.propertyNumber`
        const addressField = `${fieldIndex}.address`

        return (
          <Box position="relative" key={field.id} marginTop={2}>
            <Box position="absolute" className={styles.removeFieldButton}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={handleRemoveProperty.bind(null, index)}
              />
            </Box>
            <GridRow>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={propertyNumberField}
                  name={propertyNumberField}
                  label="Fastanúmer"
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
          onClick={handleAddProperty}
          size="small"
        >
          Bæta við fasteign eða lóð
        </Button>
      </Box>
    </Box>
  )
}
