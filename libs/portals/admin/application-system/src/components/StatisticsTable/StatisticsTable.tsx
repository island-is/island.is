import { GetApplicationStatisticsQuery } from '../../queries/overview.generated'
import { Box, Table as T } from '@island.is/island-ui/core'

type Props = {
  data?: GetApplicationStatisticsQuery
}

export default function StatisticsTable({ data }: Props) {
  return (
    <>
      {data && (
        <Box marginTop={[3, 3, 6]}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>Týpa</T.HeadData>
                <T.HeadData>Samtals</T.HeadData>
                <T.HeadData>Drög</T.HeadData>
                <T.HeadData>Í vinnslu</T.HeadData>
                <T.HeadData>Lokið</T.HeadData>
                <T.HeadData>Samþykkt</T.HeadData>
                <T.HeadData>Hafnað</T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {data.applicationApplicationsAdminStatistics?.map((row, i) => {
                return (
                  <T.Row key={i}>
                    <T.Data>{row.typeid}</T.Data>
                    <T.Data>{row.count}</T.Data>
                    <T.Data>{row.draft}</T.Data>
                    <T.Data>{row.inprogress}</T.Data>
                    <T.Data>{row.completed}</T.Data>
                    <T.Data>{row.rejected}</T.Data>
                    <T.Data>{row.approved}</T.Data>
                  </T.Row>
                )
              })}
            </T.Body>
          </T.Table>
        </Box>
      )}
    </>
  )
}
