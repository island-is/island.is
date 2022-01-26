import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
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

export const FishingLicense: FC<FieldBaseProps> = ({ application, field }) => {
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

  console.log(data?.fishingLicenses)

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
            <Tag variant="purple">Engin gild veiðileyfi fundust</Tag>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text variant="h4">Veiðileyfi í boði</Text>
        {loading ? (
          <LoadingDots large color="gradient" />
        ) : (
          <RadioController
            id={field.id}
            largeButtons
            backgroundColor="blue"
            options={data?.fishingLicenses?.map(
              ({ name, answer, reasons }: FishingLicenseSchema) => {
                console.log('hello')
                console.log(name, answer, reasons)
                return {
                  value: name,
                  label: 'hello',
                }
              },
            )}
          />
        )}
      </Box>
    </>
  )
}
