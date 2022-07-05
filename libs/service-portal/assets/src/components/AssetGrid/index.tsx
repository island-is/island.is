import React, { FC } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Query, UnitsOfUseModel, PropertyLocation } from '@island.is/api/schema'
import {
  Text,
  Table as T,
  Column,
  Columns,
  Box,
  Button,
} from '@island.is/island-ui/core'
import { unitsArray } from '../../utils/createUnits'
import { GET_UNITS_OF_USE_QUERY } from '../../lib/queries'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'
import { tableStyles } from '@island.is/service-portal/core'
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
        <T.Table
          key={`table-${i}`}
          box={i > 0 ? { marginTop: 'containerGutter' } : undefined}
        >
          <T.Head>
            <T.Row>
              <T.HeadData colSpan={4} style={tableStyles}>
                <Text variant="medium" fontWeight="semiBold" as="span">
                  {table?.header?.title}
                </Text>{' '}
                <Text variant="medium" as="span">
                  {table.header.value}
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row, ii) => (
              <T.Row key={`row-${ii}`}>
                {row.map((rowitem, iii) => (
                  <T.Data
                    key={`rowitem-${iii}`}
                    colSpan={2}
                    style={tableStyles}
                  >
                    <Columns collapseBelow="md" space={2}>
                      <Column>
                        <Text
                          title={rowitem.detail}
                          variant="medium"
                          fontWeight="semiBold"
                          as="span"
                        >
                          {rowitem.title}
                        </Text>
                      </Column>
                      <Column>
                        <Text variant="medium" title={rowitem.detail}>
                          {rowitem.value}
                        </Text>
                      </Column>
                    </Columns>
                  </T.Data>
                ))}
              </T.Row>
            ))}
          </T.Body>
        </T.Table>
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
