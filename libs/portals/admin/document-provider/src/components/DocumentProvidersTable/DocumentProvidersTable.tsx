import {
  Box,
  Table as T,
  Text,
  Button,
} from '@island.is/island-ui/core'
import { useNavigate } from 'react-router-dom'
import { ProviderInfo } from '../../lib/types'
import { formatNumber } from '../../lib/utils'

interface Props {
  providers: Array<ProviderInfo>
}

export const ProvidersTable = ({ providers }: Props) => {
  const navigate = useNavigate()
  return (
    <Box paddingTop={6}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Skjalaveitendur</T.HeadData>
            <T.HeadData align="right">Send skjöl</T.HeadData>
            <T.HeadData align="right">Opnuð skjöl</T.HeadData>
            <T.HeadData>Links</T.HeadData>
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
                    aria-label={`Skoða nánar: ${item.name}`}
                    onClick={() => navigate(`/skjalaveitur/yfirlit/${item.providerId}`)}
                  >
                    Skoða nánar
                  </Button>
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
