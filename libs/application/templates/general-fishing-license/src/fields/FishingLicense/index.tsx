import {
  FieldBaseProps,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { ShipInformation, Tag } from '../components'
import {
  FishingLicense as FishingLicenseSchema,
  Ship,
} from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { queryFishingLicense } from '../../graphql/queries'
import { RadioController } from '@island.is/shared/form-fields'
import { fishingLicense, shipSelection } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const FishingLicense: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()

  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]
  const shipIndex = getValueViaPath(
    application.answers,
    'shipSelection.ship',
    '0',
  ) as string
  const registrationNumber = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string

  const { data, loading } = useQuery(queryFishingLicense, {
    variables: {
      registrationNumber: parseInt(registrationNumber),
    },
  })

  const ship = ships[parseInt(shipIndex)]
  return (
    <>
      <Box marginBottom={3}>
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          width="full"
          display="flex"
          justifyContent="spaceBetween"
        >
          <ShipInformation ship={ship} seaworthinessHasColor />
          <Box>
            <Tag variant="purple">
              {formatMessage(shipSelection.tags.noFishingLicensesFound)}
            </Tag>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(fishingLicense.labels.radioButtonTitle)}
        </Text>
        {loading ? (
          <LoadingDots large color="gradient" />
        ) : (
          <RadioController
            id={field.id}
            largeButtons
            backgroundColor="blue"
            error={errors && getErrorViaPath(errors, field.id)}
            options={data?.fishingLicenses?.map(
              ({ fishingLicenseInfo, answer }: FishingLicenseSchema) => {
                return {
                  value: fishingLicenseInfo.code,
                  label:
                    formatMessage(
                      fishingLicense.labels[fishingLicenseInfo.code],
                    ) || fishingLicenseInfo.name,
                  tooltip: formatMessage(
                    fishingLicense.tooltips[fishingLicenseInfo.code],
                  ),
                  disabled: !answer,
                }
              },
            )}
          />
        )}
      </Box>
    </>
  )
}
