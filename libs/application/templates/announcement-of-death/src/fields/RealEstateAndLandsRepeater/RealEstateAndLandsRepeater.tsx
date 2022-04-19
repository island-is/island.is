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

import * as styles from './RealEstateAndLandsRepeater.css'
import { m } from '../../lib/messages'

export const RealEstateAndLandsRepeater: FC<FieldBaseProps> = ({ field }) => {
  const { id } = field
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
            // TODO: Get data
            title="Mosagata 13, 210 Garðabær"
            description={[
              'Fastanúmer: 16313',
              'Eignarhluti: 50%',
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
        <GridColumn span={['12/12', '12/12', '6/12']} paddingBottom={3}>
          <ProfileCard
            // TODO: Get data
            title="Bolholt 8, 105 Reykjavík"
            description={[
              'Fastanúmer: 13871',
              'Eignarhluti: 50%',
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
                  label={formatMessage(m.propertyNumber)}
                  backgroundColor="blue"
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={addressField}
                  name={addressField}
                  label={formatMessage(m.address)}
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
          onClick={handleAddProperty}
          size="small"
        >
          {formatMessage(m.addProperty)}
        </Button>
      </Box>
    </Box>
  )
}
