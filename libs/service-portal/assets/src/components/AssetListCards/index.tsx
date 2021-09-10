import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Box, ActionCard, Table as T } from '@island.is/island-ui/core'

interface Props {
  assets?: any[]
}

const AssetListCards: FC<Props> = ({ assets }) => {
  const history = useHistory()
  return (
    <Box>
      <Box>
        <ActionCard
          heading="Kjartansgata 2, Reykjavíkurborg "
          text="F2012089"
          cta={{
            label: 'Skoða nánar',
            variant: 'text',
            onClick: () =>
              history.push(
                ServicePortalPath.AssetsRealEstateDetail.replace(
                  ':id',
                  'fasteign-1',
                ),
              ),
          }}
        />
      </Box>
      <Box marginTop={4}>
        <ActionCard
          heading="Einimelur 24, Reykjavíkurborg"
          text="F2013002"
          cta={{
            label: 'Skoða nánar',
            variant: 'text',
            onClick: () =>
              history.push(
                ServicePortalPath.AssetsRealEstateDetail.replace(
                  ':id',
                  'fasteign-2',
                ),
              ),
          }}
        />
      </Box>
    </Box>
  )
}

export default AssetListCards
