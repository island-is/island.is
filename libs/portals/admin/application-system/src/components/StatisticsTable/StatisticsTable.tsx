import { useLocale } from '@island.is/localization'
import { Box, Table as T, Text, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationStatistics } from '@island.is/api/schema'
import * as styles from '../ApplicationsTable/ApplicationsTable.css'
import { getLogoFromContentfulSlug } from '../../shared/utils'

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
            <T.HeadData>{formatMessage(m.tableHeaderInstitution)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderType)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderInProgress)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderCompleted)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderRejected)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderApproved)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {dataRows?.map((row, i) => {
            //todoxy: get logo from contentful
            //todoxy: exclude logo when viewing as institutionadmin?
            // const logo = getLogoFromContentfulSlug(
            //   organizations,
            //   row.institutionContentfulSlug,
            // )
            const logo =
              'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'
            return (
              <T.Row key={`${row.typeid}-${i}`}>
                <T.Data>
                  <Box display="flex" alignItems="center">
                    <Tooltip text={row.institution}>
                      <img src={logo} alt="" className={styles.logo} />
                    </Tooltip>
                  </Box>
                </T.Data>
                <T.Data>{row.name || row.typeid}</T.Data>
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
  )
}
