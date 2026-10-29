import sortBy from 'lodash/sortBy'
import { ReactNode, useMemo, useState } from 'react'
import * as kennitala from 'kennitala'

import {
  Box,
  Button,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  ExpandableRow,
  IdentityInfo,
} from '@island.is/portals/shared-modules/delegations'

import {
  DelegationView,
  delegationTypeMessage,
  formatDate,
  isDateExpired,
  isIndexOnlyType,
} from '../lib/delegationView'
import { m } from '../lib/messages'
import { DelegationStatusTag } from './DelegationStatusTag'

type SortKey = 'name' | 'validTo'

interface DelegationTableProps {
  delegations: DelegationView[]
  direction: 'incoming' | 'outgoing'
  renderRowActions?: (delegation: DelegationView) => ReactNode
}

const otherParty = (
  delegation: DelegationView,
  direction: DelegationTableProps['direction'],
) => (direction === 'outgoing' ? delegation.to : delegation.from)

export const DelegationTable = ({
  delegations,
  direction,
  renderRowActions,
}: DelegationTableProps) => {
  const { formatMessage } = useLocale()
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({
    key: 'name',
    descending: false,
  })

  const showDomain = delegations.some((d) => d.domain)

  const sorted = useMemo(() => {
    const result = sortBy(delegations, (d) =>
      sort.key === 'name'
        ? otherParty(d, direction).name
        : // Delegations without an end date sort last.
        d.validTo
        ? new Date(d.validTo).getTime()
        : Number.MAX_SAFE_INTEGER,
    )
    return sort.descending ? result.reverse() : result
  }, [delegations, direction, sort])

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      descending: current.key === key ? !current.descending : false,
    }))

  const sortableHeader = (key: SortKey, label: string) => {
    const isSorted = sort.key === key

    return (
      <T.HeadData
        aria-sort={
          isSorted ? (sort.descending ? 'descending' : 'ascending') : 'none'
        }
      >
        <Button
          variant="text"
          size="small"
          icon={isSorted && sort.descending ? 'caretUp' : 'caretDown'}
          iconType="filled"
          onClick={() => toggleSort(key)}
        >
          {label}
        </Button>
      </T.HeadData>
    )
  }

  return (
    <Box overflow="auto">
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData />
            {sortableHeader('name', formatMessage(m.columnName))}
            {showDomain && (
              <T.HeadData>{formatMessage(m.columnDomain)}</T.HeadData>
            )}
            <T.HeadData>{formatMessage(m.columnType)}</T.HeadData>
            <T.HeadData>{formatMessage(m.columnScopes)}</T.HeadData>
            {sortableHeader('validTo', formatMessage(m.columnValidTo))}
            <T.HeadData>{formatMessage(m.columnStatus)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {sorted.map((delegation) => {
            const identity = otherParty(delegation, direction)

            return (
              <ExpandableRow
                key={delegation.id}
                backgroundColor="white"
                data={[
                  {
                    value: (
                      <IdentityInfo
                        identity={identity}
                        isExpanded={false}
                        icon={
                          kennitala.isCompany(identity.nationalId)
                            ? 'business'
                            : undefined
                        }
                      />
                    ),
                  },
                  ...(showDomain
                    ? [{ value: <DomainCell domain={delegation.domain} /> }]
                    : []),
                  { value: <DelegationTypeCell delegation={delegation} /> },
                  { value: delegation.scopes.length || '-' },
                  {
                    value: delegation.validTo
                      ? formatDate(delegation.validTo)
                      : formatMessage(m.noValidTo),
                  },
                  {
                    value: (
                      <DelegationStatusTag isActive={delegation.isActive} />
                    ),
                  },
                ]}
              >
                <Stack space={2}>
                  <DelegationScopesTable delegation={delegation} />
                  {renderRowActions?.(delegation)}
                </Stack>
              </ExpandableRow>
            )
          })}
        </T.Body>
      </T.Table>
    </Box>
  )
}

const DelegationTypeCell = ({ delegation }: { delegation: DelegationView }) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" alignItems="center" columnGap={1}>
      <Text variant="medium" as="span">
        {formatMessage(delegationTypeMessage(delegation.type))}
      </Text>
      {isIndexOnlyType(delegation.type) && (
        <Tooltip
          placement="top"
          text={
            delegation.indexedAt
              ? formatMessage(m.indexedAt, {
                  date: formatDate(delegation.indexedAt),
                })
              : formatMessage(m.indexedNever)
          }
        />
      )}
    </Box>
  )
}

const DomainCell = ({ domain }: { domain?: DelegationView['domain'] }) =>
  domain ? (
    <Box display="flex" alignItems="center" columnGap={1}>
      {domain.organisationLogoUrl && (
        <img src={domain.organisationLogoUrl} width="16" alt="" aria-hidden />
      )}
      <Text variant="medium" as="span">
        {domain.displayName}
      </Text>
    </Box>
  ) : (
    <Text variant="medium" as="span">
      -
    </Text>
  )

const DelegationScopesTable = ({
  delegation,
}: {
  delegation: DelegationView
}) => {
  const { formatMessage } = useLocale()

  if (delegation.scopes.length === 0) {
    return null
  }

  return (
    <Box overflow="auto">
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.columnScopes)}</T.HeadData>
            <T.HeadData>{formatMessage(m.columnRegistered)}</T.HeadData>
            <T.HeadData>{formatMessage(m.columnValidTo)}</T.HeadData>
            <T.HeadData>{formatMessage(m.columnStatus)}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {delegation.scopes.map((scope) => (
            <T.Row key={scope.name}>
              <T.Data>{scope.displayName}</T.Data>
              <T.Data>
                {scope.validFrom ? formatDate(scope.validFrom) : '-'}
              </T.Data>
              <T.Data>
                {scope.validTo
                  ? formatDate(scope.validTo)
                  : formatMessage(m.noValidTo)}
              </T.Data>
              <T.Data>
                <DelegationStatusTag isActive={!isDateExpired(scope.validTo)} />
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
