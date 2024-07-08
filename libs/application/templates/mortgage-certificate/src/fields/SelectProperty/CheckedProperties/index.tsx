import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { Controller, FieldArrayWithId, useFormContext } from 'react-hook-form'
import { MortgageCertificate } from '../../../lib/dataSchema'
import { overview } from '../../../lib/messages'

interface PropertyTypeProps {
  properties: FieldArrayWithId<
    MortgageCertificate,
    'selectedProperties.properties',
    'id'
  >[]
  handleRemoveProperty: (index: number) => void
}

export const CheckedProperties: FC<
  React.PropsWithChildren<FieldBaseProps & PropertyTypeProps>
> = ({ field, properties, handleRemoveProperty }) => {
  const { formatMessage } = useLocale()
  const { control } = useFormContext()

  return (
    <Box paddingTop={3}>
      <Text variant="h3" paddingBottom={1}>
        {formatMessage(overview.labels.chosenProperties)}
      </Text>
      {properties.map((property, index) => {
        return (
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            paddingBottom={1}
            key={property.id}
          >
            <Controller
              name={`${field.id}.properties[${index}].propertyNumber`}
              control={control}
              render={() => <input type="hidden" />}
            />
            <Box width="full" paddingRight={1}>
              <InputController
                id={`${field.id}.properties[${index}].propertyName`}
                label={formatMessage(overview.labels.chosenProperty)}
                readOnly
              />
            </Box>

            <Button
              onClick={() => handleRemoveProperty(index)}
              circle
              icon="close"
              title="Remove"
              variant="ghost"
            />
          </Box>
        )
      })}
    </Box>
  )
}
