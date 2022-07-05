import React, { FC } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { m, TableGrid } from '@island.is/service-portal/core'
import { Query, UnitsOfUseModel, PropertyLocation } from '@island.is/api/schema'
import { Text, Box, Button } from '@island.is/island-ui/core'
import { unitsArray } from '../../utils/createUnits'
import { GET_UNITS_OF_USE_QUERY } from '../../lib/queries'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

interface Props {
  units: UnitsOfUseModel
  locationData?: PropertyLocation | null
  title?: string
  assetId?: string | number | null
}

const AssetGrid: FC<Props> = ({ title, units, assetId, locationData }) => {
  const { formatMessage } = useLocale()
  const [getUnitsOfUseQuery, { fetchMore, data }] = useLazyQuery<Query>(
    GET_UNITS_OF_USE_QUERY,
  )
  const eigendurPaginationData = data?.assetsUnitsOfUse

  const paginateData = eigendurPaginationData?.unitsOfUse || []
  const paginate = () => {
    const paginateData = eigendurPaginationData?.unitsOfUse || []
    const variableObject = {
      variables: {
        input: {
          assetId: assetId,
          cursor: Math.ceil(
            paginateData.length / DEFAULT_PAGING_ITEMS + 1,
          ).toString(),
        },
      },
    }

    if (fetchMore) {
      fetchMore({
        ...variableObject,
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult

          if (
            fetchMoreResult?.assetsUnitsOfUse?.unitsOfUse &&
            prevResult?.assetsUnitsOfUse?.unitsOfUse
          ) {
            fetchMoreResult.assetsUnitsOfUse.unitsOfUse = [
              ...(prevResult.assetsUnitsOfUse?.unitsOfUse ?? []),
              ...(fetchMoreResult.assetsUnitsOfUse?.unitsOfUse ?? []),
            ]
          }
          return fetchMoreResult
        },
      })
    } else {
      getUnitsOfUseQuery(variableObject)
    }
  }

  const unitData = units?.unitsOfUse || []
  const tableArray = [...unitData, ...paginateData]
  const tables = unitsArray(tableArray, locationData, formatMessage)

  const loadMoreButton =
    data?.assetsUnitsOfUse?.paging?.hasNextPage ||
    (units?.paging?.hasNextPage && !data?.assetsUnitsOfUse?.paging)
  return (
    <>
      <Text variant="h3" as="h2" marginBottom={4}>
        {title}
      </Text>
      {tables?.map((table, i) => (
        <TableGrid
          key={`table-${i}`}
          dataArray={table.rows}
          title={table?.header?.title}
          subtitle={table?.header.value}
          mt={i > 0}
        />
      ))}
      {loadMoreButton && (
        <Box
          marginTop={3}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          <Button variant="text" onClick={paginate}>
            {formatMessage(m.fetchMore)}
          </Button>
        </Box>
      )}
    </>
  )
}

export default AssetGrid
