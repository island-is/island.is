import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { ProviderStatisticsBreakdownPaginationResponse } from '../../lib/types'
import { DOCUMENT_DELIVERY_PRICE_ISK } from '../../lib/constants'
import { formatNumber } from '../../lib/utils'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DocumentProvidersLoading } from '../DocumentProvidersLoading/DocumentProvidersLoading'

export const DocumentProviderStatisticsTable = ({
  statistics,
  loading,
}: {
  statistics: ProviderStatisticsBreakdownPaginationResponse
  loading: boolean
}) => {
  const { formatMessage } = useLocale()
  if (loading) {
    return <DocumentProvidersLoading />
  }
  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>
              {formatMessage(m.documentProvidersDateFromLabel)}
            </T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxPublishedDocuments)}
            </T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxOpenedDocuments)}
            </T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxFailures)}
            </T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxBenefit)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {statistics && statistics.items && statistics.items.length ? (
            statistics.items.map((item, idx) => (
              <T.Row key={idx}>
                <T.Data>
                  {format(
                    new Date(item.year, item.month - 1, 1),
                    'dd. MMMM yyyy',
                    { locale: is },
                  )}
                </T.Data>
                <T.Data align="right">{item.statistics?.published}</T.Data>
                <T.Data align="right">{item.statistics?.opened}</T.Data>
                <T.Data align="right">{item.statistics?.failures}</T.Data>
                <T.Data align="right">
                  {formatNumber(
                    (item.statistics?.published ?? 0) *
                      DOCUMENT_DELIVERY_PRICE_ISK,
                  )}
                </T.Data>
              </T.Row>
            ))
          ) : (
            <T.Row>
              <T.Data colSpan={5}>
                <Text>{formatMessage(m.documentProvidersNoData)}</Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
}
