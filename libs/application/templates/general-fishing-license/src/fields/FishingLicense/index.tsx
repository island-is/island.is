import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { mockShips } from '../../mocks'
import { ShipInformation, Tag } from '../components'

export const FishingLicense: FC<FieldBaseProps> = ({ application }) => {
  const shipIndex = getValueViaPath(
    application.answers,
    'shipSelection',
    '0',
  ) as string
  const ship = mockShips[parseInt(shipIndex)]
  return (
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
          <Tag variant="purple">{ship.explanation}</Tag>
        </Box>
      </Box>
    </Box>
  )
}
