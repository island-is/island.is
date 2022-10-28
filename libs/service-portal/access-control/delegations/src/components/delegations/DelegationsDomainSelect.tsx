import { Select, SkeletonLoader } from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useDomains, DomainOption } from '../../hooks'

interface DelegationsHeaderProps {
  onDomainChange(domainOption: DomainOption): void
}

export const DelegationsDomainSelect = ({
  onDomainChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const { domainOptions, defaultDomainOption, loading } = useDomains()

  return loading ? (
    <SkeletonLoader height={71} />
  ) : (
    <Select
      label={formatMessage(m.accessControl)}
      size="xs"
      name="domain"
      backgroundColor="blue"
      id="domain"
      noOptionsMessage="Enginn valmöguleiki"
      options={domainOptions}
      value={defaultDomainOption}
      onChange={(option) => {
        const opt = option as DomainOption

        if (opt) {
          onDomainChange(opt)
        }
      }}
      placeholder={formatMessage({
        id: 'sp.access-control-delegations:choose-domain',
        defaultMessage: 'Veldu kerfi',
      })}
    />
  )
}
