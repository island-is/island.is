import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ArrayField,
} from 'react-hook-form'
import { Property } from '../../lib/constants'
import { getValueViaPath } from '@island.is/application/core'

export const PropertyOverviewRepeater: FC<FieldBaseProps> = ({
  application,
}) => {
  const fields = getValueViaPath(
    application.answers,
    'properties',
  ) as Property[]

  return (
    <Box>
      {fields.map((item, index) => (
        <PropertyItem field={item} index={index} />
      ))}
    </Box>
  )
}

const PropertyItem = ({
  field,
  index,
}: {
  field: Partial<ArrayField<Property, 'id'>>
  index: number
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box position="relative" marginTop={2}>
      <Text variant="h4" as="h4" paddingBottom={2}>
        Rými {index + 1}
      </Text>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.propertyNumber)}
          </Text>
          <Text>{field.propertyNumber}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.address)}
          </Text>
          <Text>{field.address}</Text>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.spaceNumber)}
          </Text>
          <Text>{field.spaceNumber}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.customerCount)}
          </Text>
          <Text>{field.customerCount}</Text>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
