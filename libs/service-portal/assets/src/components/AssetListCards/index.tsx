import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Box, Button } from '@island.is/island-ui/core'
import { PropertyOverview } from '@island.is/api/schema'
import { ActionCard } from '@island.is/service-portal/core'
import { AssetsPaths } from '../../lib/paths'

interface Props {
  assets?: PropertyOverview
  paginate?: boolean
  paginateCallback?: () => void
}

const AssetListCards: FC<React.PropsWithChildren<Props>> = ({
  assets,
  paginateCallback,
}) => {
  const { formatMessage } = useLocale()
  const getMoreItems = () => {
    if (paginateCallback) {
      paginateCallback()
    }
  }

  return (
    <Box>
      {assets?.properties?.map((asset, i) => (
        <Box key={asset.propertyNumber} marginTop={i > 0 ? 2 : undefined}>
          <ActionCard
            heading={asset?.defaultAddress?.display || ''}
            text={asset.propertyNumber as string}
            cta={{
              label: formatMessage(m.viewDetail),
              variant: 'text',
              size: 'small',
              icon: 'arrowForward',
              url: AssetsPaths.AssetsRealEstateDetail.replace(
                ':id',
                asset.propertyNumber as string,
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
            {formatMessage(m.fetchMore)}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default AssetListCards
