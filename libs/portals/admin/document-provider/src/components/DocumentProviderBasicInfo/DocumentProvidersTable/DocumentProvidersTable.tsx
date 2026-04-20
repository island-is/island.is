import { Box, Table as T, Text, Link } from '@island.is/island-ui/core'
import { ProviderStatisticsPaginationResponse } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { replaceParams } from '@island.is/react-spa/shared'
import { m } from '../../../lib/messages'
import { DocumentProviderPaths } from '../../../lib/paths'

type ProvidersTableProps = {
  providerStatistics: ProviderStatisticsPaginationResponse
}

export const ProvidersTable = ({ providerStatistics }: ProvidersTableProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.documentProvidersList)}</T.HeadData>
            <T.HeadData>
              {formatMessage(m.statisticsBoxPublishedDocuments)}
            </T.HeadData>
            <T.HeadData>{formatMessage(m.openedDocuments)}</T.HeadData>
            <T.HeadData>{formatMessage(m.links)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {providerStatistics?.items?.length ? (
            providerStatistics.items.map((item, idx) => (
              <T.Row key={idx}>
                <T.Data>{item.name}</T.Data>
                <T.Data>{item.statistics?.published}</T.Data>
                <T.Data>{item.statistics?.opened}</T.Data>
                <T.Data>
                  <Link
                    href={replaceParams({
                      href: DocumentProviderPaths.DocumentProviderDocumentProvidersSingle,
                      params: { providerId: item.providerId },
                    })}
                    underline="normal"
                  >
                    {formatMessage(
                      m.documentProvidersSearchResultsActionCardLabel,
                    )}
                  </Link>
                </T.Data>
              </T.Row>
            ))
          ) : (
            <T.Row>
              <T.Data colSpan={4}>
                <Text>{formatMessage(m.documentProvidersNoData)}</Text>
              </T.Data>
            </T.Row>
          )}
        </T.Body>
      </T.Table>
    </Box>
  )
}
