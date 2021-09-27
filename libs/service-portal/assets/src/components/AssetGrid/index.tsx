import React, { FC } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { NotkunareiningWrapper } from '@island.is/clients/assets'
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

interface Props {
  units: NotkunareiningWrapper | undefined
  title?: string
  assetId?: string | number | null
}

const AssetGrid: FC<Props> = ({ title, units, assetId }) => {
  const { formatMessage } = useLocale()
  const [getUnitsOfUseQuery, { fetchMore, data }] = useLazyQuery(
    GET_UNITS_OF_USE_QUERY,
  )
  const eigendurPaginationData: NotkunareiningWrapper =
    data?.getNotkunareiningar

  const paginateData = eigendurPaginationData?.notkunareiningar || []
  const paginate = () => {
    const paginateData = eigendurPaginationData?.notkunareiningar || []
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
          fetchMoreResult.getNotkunareiningar.notkunareiningar = [
            ...prevResult.getNotkunareiningar.notkunareiningar,
            ...fetchMoreResult.getNotkunareiningar.notkunareiningar,
          ]
          return fetchMoreResult
        },
      })
    } else {
      getUnitsOfUseQuery(variableObject)
    }
  }

  const unitData = units?.notkunareiningar || []
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
