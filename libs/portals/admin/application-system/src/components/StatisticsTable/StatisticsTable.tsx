import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Icon, Table as T, Text, Tooltip } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationStatistics } from '@island.is/api/schema'
import * as styles from '../ApplicationsTable/ApplicationsTable.css'
import { getLogoFromContentfulSlug } from '../../shared/utils'
import { Organization } from '@island.is/shared/types'

type SortKey =
  | 'institution'
  | 'name'
  | 'inprogress'
  | 'completed'
  | 'rejected'
  | 'approved'
  | 'count'
type SortDirection = 'asc' | 'desc'

const sortableHeaderStyle: React.CSSProperties = {
  cursor: 'pointer',
  userSelect: 'none',
}

const SortIcon = ({
  colKey,
  sortKey,
  sortDirection,
}: {
  colKey: SortKey
  sortKey: SortKey
  sortDirection: SortDirection
}) => (
  <Box marginLeft={1} display="flex" alignItems="center">
    <Icon
      icon={
        sortKey === colKey && sortDirection === 'asc' ? 'caretUp' : 'caretDown'
      }
      size="small"
      color={sortKey === colKey ? 'blue400' : 'dark200'}
    />
  </Box>
)

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
  const [sortKey, setSortKey] = useState<SortKey>('count')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedRows = [...(dataRows ?? [])].sort((a, b) => {
    const dir = sortDirection === 'asc' ? 1 : -1
    switch (sortKey) {
      case 'institution':
        return (
          dir *
          (a.institutionContentfulSlug ?? '').localeCompare(
            b.institutionContentfulSlug ?? '',
          )
        )
      case 'name':
        return dir * (a.name || a.typeid).localeCompare(b.name || b.typeid)
      case 'inprogress':
        return dir * (a.inprogress - b.inprogress)
      case 'completed':
        return dir * (a.completed - b.completed)
      case 'rejected':
        return dir * (a.rejected - b.rejected)
      case 'approved':
        return dir * (a.approved - b.approved)
      case 'count':
        return dir * (a.count - b.count)
      default:
        return 0
    }
  })

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
              <T.HeadData
                style={sortableHeaderStyle}
                onClick={() => handleSort('institution')}
              >
                <Box display="flex" alignItems="center">
                  {formatMessage(m.tableHeaderInstitution)}
                  <SortIcon
                    colKey="institution"
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                  />
                </Box>
              </T.HeadData>
            )}
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('name')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderType)}
                <SortIcon
                  colKey="name"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('inprogress')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderInProgress)}
                <SortIcon
                  colKey="inprogress"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('completed')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderCompleted)}
                <SortIcon
                  colKey="completed"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('rejected')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderRejected)}
                <SortIcon
                  colKey="rejected"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('approved')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderApproved)}
                <SortIcon
                  colKey="approved"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
            <T.HeadData
              style={sortableHeaderStyle}
              onClick={() => handleSort('count')}
            >
              <Box display="flex" alignItems="center">
                {formatMessage(m.tableHeaderTotal)}
                <SortIcon
                  colKey="count"
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                />
              </Box>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {sortedRows.map((row, i) => {
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
                <T.Data>
                  <Text fontWeight="semiBold">{row.count}</Text>
                </T.Data>
              </T.Row>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}
