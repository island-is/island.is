import { useLocale } from '@island.is/localization'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationStatistics } from '@island.is/api/schema'

type Props = {
  dataRows?: ApplicationStatistics[] | null
}

export default function StatisticsTable({ dataRows }: Props) {
  const { formatMessage } = useLocale()

  if (!dataRows?.length) {
    return (
      <Box display="flex" justifyContent="center" marginTop={[3, 3, 6]}>
        <Text variant="h4">{formatMessage(m.noData)}</Text>
      </Box>
    )
  }

  return (
    <Box marginTop={[3, 3, 6]}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.tableHeaderType)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderInProgress)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderCompleted)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderRejected)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderApproved)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {dataRows?.map((row, i) => (
            <T.Row key={`${row.typeid}-${i}`}>
              <T.Data>{row.name || row.typeid}</T.Data>
              <T.Data>{row.inprogress}</T.Data>
              <T.Data>{row.completed}</T.Data>
              <T.Data>{row.rejected}</T.Data>
              <T.Data>{row.approved}</T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
