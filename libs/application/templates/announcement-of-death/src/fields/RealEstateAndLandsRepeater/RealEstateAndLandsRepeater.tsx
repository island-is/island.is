import React, { FC } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
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

import * as styles from './RealEstateAndLandsRepeater.css'
import { m } from '../../lib/messages'

export const RealEstateAndLandsRepeater: FC<FieldBaseProps<Answers>> = ({
  field,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove } = useFieldArray<Asset>({ name: id })
  const { control } = useFormContext()

  const handleAddProperty = () =>
    append({
      assetNumber: '',
      description: '',
      initial: false,
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset, index) => {
          if (!asset.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
              key={asset.id}
            >
              <ProfileCard
                title={asset.description}
                description={[
                  `${formatMessage(m.propertyNumber)}: ${asset.assetNumber}`,
                  asset.share
                    ? `${formatMessage(m.propertyShare)}: ${asset.share * 100}%`
                    : '',
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
        console.log('mapper', field)
        const fieldIndex = `${id}[${index}]`
        const propertyNumberField = `${fieldIndex}.assetNumber`
        const addressField = `${fieldIndex}.description`
        const initialField = `${fieldIndex}.initial`

        return (
          <Box
            position="relative"
            key={field.id}
            marginTop={2}
            hidden={field.initial}
          >
            <Controller
              name={initialField}
              control={control}
              defaultValue={field.initial || false}
            />
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
                  defaultValue={field.assetNumber}
                />
              </GridColumn>
              <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
                <InputController
                  id={addressField}
                  name={addressField}
                  label={formatMessage(m.address)}
                  readOnly
                  defaultValue={field.description}
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
