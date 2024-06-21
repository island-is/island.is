import { useLocale } from '@island.is/localization'
import { GetApplicationStatisticsQuery } from '../../queries/overview.generated'
import { Box, Table as T } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

type Props = {
  data?: GetApplicationStatisticsQuery
}

export default function StatisticsTable({ data }: Props) {
  const { formatMessage } = useLocale()

  if (data && !data?.applicationApplicationsAdminStatistics?.length) {
    return <Box marginTop={[3, 3, 6]}>{formatMessage(m.noData)}</Box>
  }

  return (
    <>
      {data && (
        <Box marginTop={[3, 3, 6]}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.tableHeaderType)}</T.HeadData>
                <T.HeadData>
                  {formatMessage(m.tableHeaderInProgress)}
                </T.HeadData>
                <T.HeadData>{formatMessage(m.tableHeaderCompleted)}</T.HeadData>
                <T.HeadData>{formatMessage(m.tableHeaderRejected)}</T.HeadData>
                <T.HeadData>{formatMessage(m.tableHeaderApproved)}</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data.applicationApplicationsAdminStatistics?.map((row, i) => (
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
      )}
    </>
  )
}
