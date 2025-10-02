import { Box, Table as T, Text, Button } from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { ProviderInfo } from '../../lib/types'
import { formatNumber } from '../../lib/utils'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DocumentProvidersLoading } from '../DocumentProvidersLoading/DocumentProvidersLoading'

interface Props {
  loading?: boolean
  providers: Array<ProviderInfo>
  providerPath?: string
}

export const ProvidersTable = ({ providers, loading, providerPath }: Props) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()

  if (loading) {
    return <DocumentProvidersLoading />
  }

  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.documentProvidersTitle)}</T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxPublishedDocuments)}
            </T.HeadData>
            <T.HeadData align="right">
              {formatMessage(m.statisticsBoxOpenedDocuments)}
            </T.HeadData>
            <T.HeadData></T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {providers?.length ? (
            providers.map((item, idx) => (
              <T.Row key={idx}>
                <T.Data>{item.name}</T.Data>
                <T.Data align="right">
                  {formatNumber(item.statistics?.published)}
                </T.Data>
                <T.Data align="right">
                  {formatNumber(item.statistics?.opened)}
                </T.Data>
                <T.Data>
                  <Button
                    size="small"
                    icon="arrowForward"
                    variant="text"
                    aria-label={`${formatMessage(
                      m.documentProvidersSearchResultsActionCardLabel,
                    )}: ${item.name}`}
                    onClick={() =>
                      navigate(
                        providerPath?.replace(':providerId', item.providerId) ||
                          '',
                      )
                    }
                  >
                    {formatMessage(
                      m.documentProvidersSearchResultsActionCardLabel,
                    )}
                  </Button>
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
