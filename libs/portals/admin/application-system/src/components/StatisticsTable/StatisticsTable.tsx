import { useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { ApplicationStatistics } from '@island.is/api/schema'
import { Organization } from '@island.is/shared/types'

type SortKey =
  | 'institution'
  | 'name'
  | 'origin'
  | 'inprogress'
  | 'draft'
  | 'completed'
  | 'rejected'
  | 'approved'
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

const SortableHeader = ({
  colKey,
  label,
  sortKey,
  sortDirection,
  onSort,
}: {
  colKey: SortKey
  label: string
  sortKey: SortKey
  sortDirection: SortDirection
  onSort: (key: SortKey) => void
}) => (
  <T.HeadData
    aria-sort={
      sortKey === colKey
        ? sortDirection === 'asc'
          ? 'ascending'
          : 'descending'
        : undefined
    }
  >
    <Box
      component="button"
      type="button"
      display="flex"
      alignItems="center"
      style={sortableHeaderStyle}
      onClick={() => onSort(colKey)}
    >
      {label}
      <SortIcon
        colKey={colKey}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />
    </Box>
  </T.HeadData>
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
  const [sortKey, setSortKey] = useState<SortKey>('draft')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const getOriginLabel = (row: ApplicationStatistics) =>
    formatMessage(
      row.isFormSystem ? m.originFormSystem : m.originApplicationSystem,
    )

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
      case 'origin':
        return dir * getOriginLabel(a).localeCompare(getOriginLabel(b))
      case 'inprogress':
        return dir * (a.inprogress - b.inprogress)
      case 'draft':
        return dir * (a.draft - b.draft)
      case 'completed':
        return dir * (a.completed - b.completed)
      case 'rejected':
        return dir * (a.rejected - b.rejected)
      case 'approved':
        return dir * (a.approved - b.approved)
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
              <SortableHeader
                colKey="institution"
                label={formatMessage(m.tableHeaderInstitution)}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
            <SortableHeader
              colKey="name"
              label={formatMessage(m.tableHeaderType)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="origin"
              label={formatMessage(m.tableHeaderOrigin)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="draft"
              label={formatMessage(m.tableHeaderDraft)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="inprogress"
              label={formatMessage(m.tableHeaderInProgress)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="completed"
              label={formatMessage(m.tableHeaderCompleted)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="rejected"
              label={formatMessage(m.tableHeaderRejected)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <SortableHeader
              colKey="approved"
              label={formatMessage(m.tableHeaderApproved)}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </T.Row>
        </T.Head>
        <T.Body>
          {sortedRows.map((row, i) => {
            const contentfulOrg = organizations.find(
              (x) => x.slug === row.institutionContentfulSlug,
            )

            const institutionName =
              contentfulOrg?.title ?? row.institutionName ?? ''
            return (
              <T.Row key={`${row.typeid}-${i}`}>
                {isSuperAdmin && <T.Data>{institutionName}</T.Data>}
                <T.Data>
                  <Text variant="eyebrow" color="blue400">
                    {row.name || row.typeid}
                  </Text>
                </T.Data>
                <T.Data>{getOriginLabel(row)}</T.Data>
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
  )
}
