import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { ProviderStatisticsBreakdownPaginationResponse } from '../../lib/types'
import { DELIVERY_PRICE } from '../../lib/constants'
import { formatNumber } from '../../lib/utils'

export const DocumentProviderStatisticsTable = (
  statistics: ProviderStatisticsBreakdownPaginationResponse,
) => {
  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Dagsetning</T.HeadData>
            <T.HeadData align="right">Send</T.HeadData>
            <T.HeadData align="right">Opnuð</T.HeadData>
            <T.HeadData align="right">Villur</T.HeadData>
            <T.HeadData align="right">Ávinningur</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {statistics && statistics.items && statistics.items.length ? (
            statistics.items.map((item, idx) => (
              <T.Row key={idx}>
                <T.Data>
                  {new Date(item.year, item.month - 1, 1).toLocaleDateString(
                    'is-IS',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </T.Data>
                <T.Data align="right">{item.statistics?.published}</T.Data>
                <T.Data align="right">{item.statistics?.opened}</T.Data>
                <T.Data align="right">{item.statistics?.failures}</T.Data>
                <T.Data align="right">
                  {formatNumber(item.statistics?.published * DELIVERY_PRICE)}
                </T.Data>
              </T.Row>
            ))
          ) : (
            <T.Row>
              <T.Data colSpan={4}>
                <Text>Engin gögn...</Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
}
