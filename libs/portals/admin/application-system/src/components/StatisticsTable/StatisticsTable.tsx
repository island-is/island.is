import { useLocale } from '@island.is/localization'
import { Box, Table as T, Text, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationStatistics } from '@island.is/api/schema'
import * as styles from '../ApplicationsTable/ApplicationsTable.css'
import { getLogoFromContentfulSlug } from '../../shared/utils'
import { Organization } from '@island.is/shared/types'

type Props = {
  isSuperAdmin: boolean
  dataRows?: ApplicationStatistics[] | null
  organizations: Organization[]
}

export default function StatisticsTable({
  isSuperAdmin,
  dataRows,
  organizations,
}: Props) {
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
            {isSuperAdmin && (
              <T.HeadData>{formatMessage(m.tableHeaderInstitution)}</T.HeadData>
            )}
            <T.HeadData>{formatMessage(m.tableHeaderType)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderInProgress)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderCompleted)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderRejected)}</T.HeadData>
            <T.HeadData>{formatMessage(m.tableHeaderApproved)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {dataRows?.map((row, i) => {
            const contentfulOrg = organizations.find(
              (x) => x.slug === row.institutionContentfulSlug,
            )

            const logo = getLogoFromContentfulSlug(
              contentfulOrg ? [contentfulOrg] : [],
              row.institutionContentfulSlug ?? '',
            )
            return (
              <T.Row key={`${row.typeid}-${i}`}>
                {isSuperAdmin && (
                  <T.Data>
                    <Box display="flex" alignItems="center">
                      <Tooltip
                        text={contentfulOrg?.title ?? row.institutionName ?? ''}
                      >
                        <img src={logo} alt="" className={styles.logo} />
                      </Tooltip>
                    </Box>
                  </T.Data>
                )}
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
