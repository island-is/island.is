import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { shipSelection } from '../../../lib/messages'
import { ValueLine } from './ValueLine'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { FishingLicenseShip as Ship } from '@island.is/api/schema'
import parseISO from 'date-fns/parseISO'

interface ShipInformationProps {
  ship: Ship
  seaworthinessHasColor?: boolean
  isExpired?: boolean
  isDisabled?: boolean
}

export const ShipInformation: FC<ShipInformationProps> = ({
  ship,
  seaworthinessHasColor = false,
  isExpired = false,
  isDisabled = false,
}) => {
  const {
    name,
    registrationNumber,
    grossTons,
    length,
    homePort,
    seaworthiness,
  } = ship
  const { formatMessage } = useLocale()

  // If seaworhtiness date is before today it will get "expired" label and appear red
  // If today or later it will get "valid until" label and appear green
  const seaworthinessDate = format(
    parseISO(seaworthiness.validTo),
    'dd.MM.yy',
    {
      locale: is,
    },
  )
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
        color={isExpired || isDisabled ? 'dark300' : 'dark400'}
      >
        {name}
      </Text>
      {!!registrationNumber && (
        <ValueLine
          label={formatMessage(shipSelection.labels.shipNumber)}
          value={registrationNumber.toString()}
          disabled={isExpired || isDisabled}
          color={isExpired || isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!grossTons && (
        <ValueLine
          label={formatMessage(shipSelection.labels.grossTonn)}
          value={grossTons.toString()}
          disabled={isExpired || isDisabled}
          color={isExpired || isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!length && (
        <ValueLine
          label={formatMessage(shipSelection.labels.length)}
          value={`${length.toString()} ${formatMessage(
            shipSelection.labels.meters,
          )}`}
          disabled={isExpired || isDisabled}
          color={isExpired || isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!homePort && (
        <ValueLine
          label={formatMessage(shipSelection.labels.homePort)}
          value={homePort}
          disabled={isExpired || isDisabled}
          color={isExpired || isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!seaworthiness && !isExpired && (
        <ValueLine
          label={formatMessage(shipSelection.labels.seaworthiness)}
          value={formatMessage(seaworthinessLabelValue, {
            date: seaworthinessDate,
          })}
          disabled={isDisabled}
          color={seaworthinessColor}
        />
      )}
    </Box>
  )
}
