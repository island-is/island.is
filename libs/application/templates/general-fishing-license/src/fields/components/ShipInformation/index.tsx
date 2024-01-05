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
  isDisabled?: boolean
}

export const ShipInformation: FC<
  React.PropsWithChildren<ShipInformationProps>
> = ({ ship, seaworthinessHasColor = false, isDisabled = false }) => {
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
  const seaworthinessDate = seaworthiness.validTo
    ? format(parseISO(seaworthiness.validTo), 'dd.MM.yy', {
        locale: is,
      })
    : null

  const isExpired = seaworthiness.validTo
    ? new Date(seaworthiness.validTo).getTime() <= new Date().getTime()
    : null

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
        color={isDisabled ? 'dark300' : 'dark400'}
      >
        {name}
      </Text>
      {!!registrationNumber && (
        <ValueLine
          label={formatMessage(shipSelection.labels.shipNumber)}
          value={registrationNumber.toString()}
          disabled={isDisabled}
          color={isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!grossTons && (
        <ValueLine
          label={formatMessage(shipSelection.labels.grossTonn)}
          value={grossTons.toString()}
          disabled={isDisabled}
          color={isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!length && (
        <ValueLine
          label={formatMessage(shipSelection.labels.length)}
          value={`${length.toString()} ${formatMessage(
            shipSelection.labels.meters,
          )}`}
          disabled={isDisabled}
          color={isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!homePort && (
        <ValueLine
          label={formatMessage(shipSelection.labels.homePort)}
          value={homePort}
          disabled={isDisabled}
          color={isDisabled ? 'grey' : 'black'}
        />
      )}
      {!!seaworthiness && seaworthiness.validTo && (
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
