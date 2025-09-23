import { Box, Table as T, Text, Link } from '@island.is/island-ui/core'
import { ProviderStatisticsPaginationResponse } from '@island.is/api/schema'
import { DocumentProviderPaths } from '../../../lib/paths'

type ProvidersTableProps = {
  providerStatistics: ProviderStatisticsPaginationResponse
}

export const ProvidersTable = ({ providerStatistics }: ProvidersTableProps) => {
  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Skjalaveitendur</T.HeadData>
            <T.HeadData>Send skjöl</T.HeadData>
            <T.HeadData>Opnuð skjöl</T.HeadData>
            <T.HeadData>Links</T.HeadData>
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
                    href={DocumentProviderPaths.DocumentProviderDocumentProvidersSingle.replace(
                      ':providerId',
                      item.providerId,
                    )}
                    underline="normal"
                  >
                    Skoða nánar
                  </Link>
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
