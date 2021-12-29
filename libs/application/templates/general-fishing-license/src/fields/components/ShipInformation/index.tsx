import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { shipSelection } from '../../../lib/messages'
import { ValueLine } from './ValueLine'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { ShipInformationType } from '../../../types'

interface ShipInformationProps {
  ship: ShipInformationType
  seaworthinessHasColor?: boolean
  isExpired?: boolean
}

export const ShipInformation: FC<ShipInformationProps> = ({
  ship,
  seaworthinessHasColor = false,
  isExpired = false,
}) => {
  const {
    shipName,
    shipNumber,
    grossTonn,
    length,
    homePort,
    seaworthiness,
  } = ship
  const { formatMessage } = useLocale()

  // If seaworhtiness date is before today it will get "expired" label and appear red
  // If today or later it will get "valid until" label and appear green
  const seaworthinessDate = format(seaworthiness, 'dd.MM.yy', { locale: is })
  const seaworthinessColor = seaworthinessHasColor
    ? isExpired
      ? 'red'
      : 'green'
    : 'black'
  const seaworthinessLabelValue = isExpired
    ? shipSelection.labels.expired
    : shipSelection.labels.validUntil

  return (
    <Box>
      <Text
        variant="h5"
        marginBottom="smallGutter"
        color={isExpired ? 'dark300' : 'dark400'}
      >
        {shipName}
      </Text>
      {shipNumber && (
        <ValueLine
          label={formatMessage(shipSelection.labels.shipNumber)}
          value={shipNumber}
          disabled={isExpired}
          color={isExpired ? 'grey' : 'black'}
        />
      )}
      {grossTonn && (
        <ValueLine
          label={formatMessage(shipSelection.labels.grossTonn)}
          value={grossTonn}
          disabled={isExpired}
          color={isExpired ? 'grey' : 'black'}
        />
      )}
      {length && (
        <ValueLine
          label={formatMessage(shipSelection.labels.length)}
          value={length}
          disabled={isExpired}
          color={isExpired ? 'grey' : 'black'}
        />
      )}
      {homePort && (
        <ValueLine
          label={formatMessage(shipSelection.labels.homePort)}
          value={homePort}
          disabled={isExpired}
          color={isExpired ? 'grey' : 'black'}
        />
      )}
      {seaworthiness && !isExpired && (
        <ValueLine
          label={formatMessage(shipSelection.labels.seaworthiness)}
          value={formatMessage(seaworthinessLabelValue, {
            date: seaworthinessDate,
          })}
          color={seaworthinessColor}
        />
      )}
    </Box>
  )
}
