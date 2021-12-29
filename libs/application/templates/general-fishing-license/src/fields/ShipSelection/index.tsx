import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { mockShips, mockShipsWithFishingLicense } from '../../mocks'
import { ShipInformationType } from '../../types'
import { ShipInformation, Tag } from '../components'
import { RadioController } from '@island.is/shared/form-fields'
import format from 'date-fns/format'
import { shipSelection } from '../../lib/messages'
import is from 'date-fns/locale/is'

export const ShipSelection: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  return (
    <Box marginBottom={2}>
      <RadioController
        id={field.id}
        largeButtons
        backgroundColor="white"
        fullWidthLabel
        defaultValue={
          (getValueViaPath(application.answers, 'shipSelection') as string[]) ??
          undefined
        }
        options={mockShips.map((ship: ShipInformationType, index: number) => {
          const isExpired = ship.seaworthiness < new Date()
          const seaworthinessDate = format(ship.seaworthiness, 'dd.MM.yy', {
            locale: is,
          })
          return {
            value: `${index}`,
            label: (
              <>
                <Box
                  width="full"
                  display="flex"
                  justifyContent="spaceBetween"
                  key={index}
                >
                  <ShipInformation
                    ship={ship}
                    seaworthinessHasColor
                    isExpired={isExpired}
                  />
                  <Box>
                    <Tag variant="purple" disabled={isExpired}>
                      {ship.explanation}
                    </Tag>
                  </Box>
                </Box>
                {isExpired && (
                  <Box marginTop={3}>
                    <AlertMessage
                      type="warning"
                      title={formatMessage(shipSelection.labels.expired, {
                        date: seaworthinessDate,
                      })}
                      message="something whatnot"
                    />
                  </Box>
                )}
              </>
            ),
            disabled: isExpired,
          }
        })}
      />
      <Text variant="h4" paddingY={3}>
        {formatMessage(shipSelection.labels.withFishingLicenseTitle)}
      </Text>
      {mockShipsWithFishingLicense.map(
        (ship: ShipInformationType, index: number) => {
          return (
            <Box
              border="standard"
              borderRadius="large"
              padding={3}
              width="full"
              display="flex"
              justifyContent="spaceBetween"
              marginBottom={2}
              key={index}
            >
              <ShipInformation ship={ship} />
              <Box>
                <Tag variant="blue">{ship.explanation}</Tag>
              </Box>
            </Box>
          )
        },
      )}
    </Box>
  )
}
