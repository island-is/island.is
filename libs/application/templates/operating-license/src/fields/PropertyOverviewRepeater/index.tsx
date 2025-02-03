import React, { FC } from 'react'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Property, PropertyField } from '../../lib/constants'
import {
  formatTextWithLocale,
  getValueViaPath,
} from '@island.is/application/core'
import { Locale } from '@island.is/shared/types'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const PropertyOverviewRepeater: FC<
  React.PropsWithChildren<PropTypes>
> = ({ field, application }) => {
  const { formatMessage, lang: locale } = useLocale()
  const { title = '' } = field
  const { id } = field.props as { id: string }
  const fields = getValueViaPath(application.answers, id) as Property[]

  return (
    <Box>
      {fields?.map((item, index) => (
        <PropertyItem
          field={item}
          index={index}
          key={index + item.propertyNumber}
          title={formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      ))}
    </Box>
  )
}

const PropertyItem = ({
  field,
  index,
  title,
}: {
  field: PropertyField
  index: number
  title: string
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box position="relative" marginTop={2}>
      <Text variant="h4" as="h4" paddingBottom={2}>
        {`${title} ${index + 1}`}
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
