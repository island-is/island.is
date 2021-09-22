import React, { FC } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
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
import { NotkunareiningarResponse } from '../../types/RealEstateAssets.types'

interface GridItem {
  title: string
  value: string | number
}

interface Props {
  units: NotkunareiningarResponse | undefined
  title?: string
}

const AssetGrid: FC<Props> = ({ title, units }) => {
  const { formatMessage } = useLocale()
  const [
    getUnitsOfUseQuery,
    { loading, error, fetchMore, data },
  ] = useLazyQuery(GET_UNITS_OF_USE_QUERY)
  const eigendurPaginationData: NotkunareiningarResponse =
    data?.getNotkunareiningar

  const paginateData = eigendurPaginationData?.data || []
  const paginate = () => {
    const paginateData = eigendurPaginationData?.data || []
    const variableObject = {
      variables: {
        input: {
          assetId: '82936',
          cursor: Math.ceil(paginateData.length / 10).toString(),
        },
      },
    }

    if (fetchMore) {
      fetchMore({
        ...variableObject,
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.getNotkunareiningar.data = [
            ...prevResult.getNotkunareiningar.data,
            ...fetchMoreResult.getNotkunareiningar.data,
          ]
          return fetchMoreResult
        },
      })
    } else {
      getUnitsOfUseQuery(variableObject)
    }
  }

  console.log('eigendurPaginationData', paginateData)

  console.log('unitsunitsunitsunits', units)
  const unitData = units?.data || []
  const tableArray = [...unitData, ...paginateData]
  const tables = unitsArray(tableArray, formatMessage)

  const loadMoreButton =
    data?.getNotkunareiningar.paging?.hasNextPage ||
    (units?.paging?.hasNextPage && !data?.getNotkunareiningar?.paging)
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
              <T.HeadData colSpan={4}>
                <Text variant="eyebrow" as="span">
                  {table?.header?.title}
                </Text>{' '}
                <Text variant="small" as="span">
                  {table.header.value}
                </Text>
              </T.HeadData>
            </T.Row>
          </T.Head>
          <T.Body>
            {table.rows.map((row, ii) => (
              <T.Row key={`row-${ii}`}>
                {row.map((rowitem, iii) => (
                  <T.Data key={`rowitem-${iii}`} colSpan={2}>
                    <Columns collapseBelow="md" space={2}>
                      <Column>
                        <Text variant="eyebrow" as="span">
                          {rowitem.title}
                        </Text>
                      </Column>
                      <Column>{rowitem.value}</Column>
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
          <Button size="small" variant="text" onClick={paginate}>
            Sækja meira
          </Button>
        </Box>
      )}
    </>
  )
}

export default AssetGrid
