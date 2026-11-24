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
          {registration.address}
        </Text>
        <Tag variant="blue" outlined>
          {registration.id}
        </Tag>
      </Box>
      <GridRow rowGap={1}>
        <GridColumn span={['12/12', '6/12']}>
          <Text variant="small">{registration.postalCode}</Text>
          {ownerName && <Text variant="small">{ownerName}</Text>}
          {registration.propertyNumber && (
            <Text variant="small">
              {formatMessage(m.propertyNumber, {
                number: registration.propertyNumber,
              })}
            </Text>
          )}
        </GridColumn>
        <GridColumn span={['12/12', '6/12']}>
          {registration.apartmentNumber && (
            <Text variant="small">
              {formatMessage(m.apartmentNumber, {
                number: registration.apartmentNumber,
              })}
            </Text>
          )}
          {registration.guests !== undefined && (
            <Text variant="small">
              {formatMessage(m.guests, {
                count: registration.guests,
              })}
            </Text>
          )}
          {registration.rooms !== undefined && (
            <Text variant="small">
              {formatMessage(m.rooms, {
                count: registration.rooms,
              })}
            </Text>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
