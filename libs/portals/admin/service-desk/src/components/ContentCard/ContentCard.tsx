import React from 'react'

import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { replaceParams } from '@island.is/react-spa/shared'
import { useLocale } from '@island.is/localization'

import { ServiceDeskPaths } from '../../lib/paths'
import { m } from '../../lib/messages'
import { useNavigate } from 'react-router-dom'
import { formatNationalId } from '@island.is/portals/core'

interface ContentCardProps {
  name: string
  nationalId: string
  withNavigation?: boolean
}

const ContentCard = ({
  name,
  nationalId,
  withNavigation = false,
}: ContentCardProps) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  return (
    <Box
      display="flex"
      borderRadius="large"
      border="standard"
      width="full"
      paddingX={4}
      paddingY={3}
      justifyContent="spaceBetween"
      alignItems="center"
    >
      <Stack space={1}>
        <Text variant="h3">{name}</Text>
        <Text variant="default">{formatNationalId(nationalId)}</Text>
      </Stack>
      {withNavigation && (
        <Box
          id={'test'}
          height="full"
          display="flex"
          style={{ alignSelf: 'flex-end' }}
        >
          <Button
            variant="text"
            icon="arrowForward"
            size={'small'}
            onClick={() =>
              navigate(
                replaceParams({
                  href: ServiceDeskPaths.Procurers,
                  params: {
                    nationalId: nationalId,
                  },
                }),
              )
            }
          >
            {formatMessage(m.viewProcures)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ContentCard
