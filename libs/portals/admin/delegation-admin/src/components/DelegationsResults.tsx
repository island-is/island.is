import sortBy from 'lodash/sortBy'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { ReactNode, useState } from 'react'

import { AuthDelegationType } from '@island.is/api/schema'

import {
  AlertMessage,
  GridColumn,
  GridColumnProps,
  GridRow,
  Select,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  ClientView,
  DelegationStatusFilter,
  DelegationView,
  delegationTypeGroup,
  delegationTypeMessage,
  filterDelegations,
} from '../lib/delegationView'
import { m } from '../lib/messages'
import { DelegationSection } from './DelegationSection'

const FILTER_SPAN: GridColumnProps['span'] = ['12/12', '6/12', '4/12']

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
  const [type, setType] = useState<AuthDelegationType>()

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
  const typeOptions = [
    { label: formatMessage(m.filterTypeAll), value: '' },
    ...uniq(
      [...incoming, ...outgoing].map((d) => delegationTypeGroup(d.type)),
    ).map((value) => ({
      label: formatMessage(delegationTypeMessage(value)),
      value,
    })),
  ]
  const filter = { status, clientId, domainName, type }

  return (
    <Stack space={6}>
      <AlertMessage type="info" message={formatMessage(m.indexNotice)} />

      <GridRow rowGap={2}>
        {domainOptions.length > 1 && (
          <GridColumn span={FILTER_SPAN}>
            <Select
              name="domain"
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.columnDomain)}
              options={domainOptions}
              value={domainOptions.find((o) => o.value === (domainName ?? ''))}
              onChange={(option) => setDomainName(option?.value || undefined)}
            />
          </GridColumn>
        )}
        {clients && (
          <GridColumn span={FILTER_SPAN}>
            <Select
              name="client"
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.filterClient)}
              options={clientOptions}
              value={clientOptions.find((o) => o.value === (clientId ?? ''))}
              onChange={(option) => setClientId(option?.value || undefined)}
            />
          </GridColumn>
        )}
        {typeOptions.length > 2 && (
          <GridColumn span={FILTER_SPAN}>
            <Select
              name="type"
              size="xs"
              backgroundColor="blue"
              label={formatMessage(m.columnType)}
              options={typeOptions}
              value={typeOptions.find((o) => o.value === (type ?? ''))}
              onChange={(option) =>
                setType((option?.value || undefined) as AuthDelegationType)
              }
            />
          </GridColumn>
        )}
        <GridColumn span={FILTER_SPAN}>
          <Select
            name="status"
            size="xs"
            backgroundColor="blue"
            label={formatMessage(m.filterStatus)}
            options={statusOptions}
            value={statusOptions.find((o) => o.value === status)}
            onChange={(option) => setStatus(option?.value ?? 'all')}
          />
        </GridColumn>
      </GridRow>

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
