import sortBy from 'lodash/sortBy'
import uniqBy from 'lodash/uniqBy'
import { ReactNode, useState } from 'react'

import { AlertMessage, Box, Select, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  ClientView,
  DelegationStatusFilter,
  DelegationView,
  filterDelegations,
} from '../lib/delegationView'
import { m } from '../lib/messages'
import { DelegationSection } from './DelegationSection'

interface DelegationsResultsProps {
  outgoing: DelegationView[]
  incoming: DelegationView[]
  clients?: ClientView[]
  renderRowActions?: (delegation: DelegationView) => ReactNode
}

export const DelegationsResults = ({
  outgoing,
  incoming,
  clients,
  renderRowActions,
}: DelegationsResultsProps) => {
  const { formatMessage } = useLocale()
  const [status, setStatus] = useState<DelegationStatusFilter>('all')
  const [clientId, setClientId] = useState<string>()
  const [domainName, setDomainName] = useState<string>()

  const statusOptions: { label: string; value: DelegationStatusFilter }[] = [
    { label: formatMessage(m.filterStatusAll), value: 'all' },
    { label: formatMessage(m.statusActive), value: 'active' },
    { label: formatMessage(m.statusExpired), value: 'expired' },
  ]
  const clientOptions = [
    { label: formatMessage(m.filterClientAll), value: '' },
    ...(clients ?? []).map((client) => ({
      label: client.clientName ?? client.clientId,
      value: client.clientId,
    })),
  ]
  const domainOptions = [
    { label: formatMessage(m.filterDomainAll), value: '' },
    ...sortBy(
      uniqBy(
        [...incoming, ...outgoing].flatMap((d) => (d.domain ? [d.domain] : [])),
        'name',
      ),
      'displayName',
    ).map((domain) => ({ label: domain.displayName, value: domain.name })),
  ]
  const filter = { status, clientId, domainName }

  return (
    <Stack space={6}>
      <Box display="flex" columnGap={2} flexWrap="wrap" rowGap={2}>
        {domainOptions.length > 1 && (
          <Box style={{ minWidth: 280 }}>
            <Select
              name="domain"
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.columnDomain)}
              options={domainOptions}
              value={domainOptions.find((o) => o.value === (domainName ?? ''))}
              onChange={(option) => setDomainName(option?.value || undefined)}
            />
          </Box>
        )}
        {clients && (
          <Box style={{ minWidth: 280 }}>
            <Select
              name="client"
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.filterClient)}
              options={clientOptions}
              value={clientOptions.find((o) => o.value === (clientId ?? ''))}
              onChange={(option) => setClientId(option?.value || undefined)}
            />
          </Box>
        )}
        <Box style={{ minWidth: 280 }}>
          <Select
            name="status"
            size="xs"
            backgroundColor="blue"
            label={formatMessage(m.filterStatus)}
            options={statusOptions}
            value={statusOptions.find((o) => o.value === status)}
            onChange={(option) => setStatus(option?.value ?? 'all')}
          />
        </Box>
      </Box>

      <AlertMessage type="info" message={formatMessage(m.indexNotice)} />

      <DelegationSection
        title={formatMessage(m.delegationTo)}
        emptyMessage={formatMessage(m.delegationToNotFound)}
        direction="incoming"
        delegations={filterDelegations(incoming, filter)}
        renderRowActions={renderRowActions}
      />
      <DelegationSection
        title={formatMessage(m.delegationFrom)}
        emptyMessage={formatMessage(m.delegationFromNotFound)}
        direction="outgoing"
        delegations={filterDelegations(outgoing, filter)}
        renderRowActions={renderRowActions}
      />
    </Stack>
  )
}
