import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Box, ActionCard, Button } from '@island.is/island-ui/core'
import { FasteignirResponse } from '../../types/RealEstateAssets.types'

interface Props {
  assets?: FasteignirResponse
  paginate?: boolean
  paginateCallback?: () => void
}

const AssetListCards: FC<Props> = ({ assets, paginateCallback }) => {
  const history = useHistory()
  const getMoreItems = () => {
    if (paginateCallback) {
      paginateCallback()
    }
  }

  return (
    <Box>
      {assets?.fasteignir?.map((asset, i) => (
        <Box key={asset.fasteignanumer} marginTop={i > 0 ? 4 : undefined}>
          <ActionCard
            heading={asset.sjalfgefidStadfang.birting}
            text={asset.fasteignanumer as string}
            cta={{
              label: 'Skoða nánar',
              variant: 'text',
              size: 'large',
              icon: 'arrowForward',
              onClick: () =>
                history.push(
                  ServicePortalPath.AssetsRealEstateDetail.replace(
                    ':id',
                    asset.fasteignanumer as string,
                  ),
                ),
            }}
          />
        </Box>
      ))}
      {assets?.paging?.hasNextPage && (
        <Box
          marginTop={3}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Button size="small" variant="text" onClick={getMoreItems}>
            Sækja meira
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default AssetListCards
