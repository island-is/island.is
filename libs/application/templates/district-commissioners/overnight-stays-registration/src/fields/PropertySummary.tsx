import React, { FC } from 'react'
import { Box, GridColumn, GridRow, Tag, Text } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { applicationMessages as m } from '../lib/messages'
import { getSelectedHomeLodging } from '../utils/homeLodgings'

export const PropertySummary: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const registration = getSelectedHomeLodging(
    application.answers,
    application.externalData,
  )
  const ownerName = getValueViaPath<string>(
    application.externalData,
    'nationalRegistry.data.fullName',
  )

  if (!registration) {
    return <Text color="red600">{formatMessage(m.propertyNotFound)}</Text>
  }

  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="large"
      padding={3}
      marginBottom={3}
    >
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={3}
      >
        <Text variant="h4" color="blue400">
          {registration.name}
        </Text>
        <Tag variant="blue" outlined>
          {registration.id}
        </Tag>
      </Box>
      <GridRow rowGap={1}>
        <GridColumn span={['12/12', '6/12']}>
          <Text variant="small">
            {registration.address}, {registration.postalCode}{' '}
            {registration.city}
          </Text>
          {ownerName && <Text variant="small">{ownerName}</Text>}
          <Text variant="small">
            {formatMessage(m.propertyNumber, {
              number: registration.propertyNumber,
            })}
          </Text>
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          <Text variant="small">
            {formatMessage(m.unitNumber, {
              number: registration.unitNumber,
            })}
          </Text>
          <Text variant="small">
            {formatMessage(m.guestCount, {
              count: registration.guestCount,
            })}
          </Text>
          <Text variant="small">
            {formatMessage(m.roomCount, {
              count: registration.roomCount,
            })}
          </Text>
        </GridColumn>
      </GridRow>
    </Box>
  )
}
