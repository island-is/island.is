import { Select, SkeletonLoader } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'
import { useDomains, DomainOption } from '../../hooks/useDomains/useDomains'
import { m } from '../../lib/messages'

interface DelegationsHeaderProps {
  onDomainChange(domainOption: DomainOption): void
}

export const DelegationsDomainSelect = ({
  onDomainChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const { options, selectedOption, loading, updateDomain } = useDomains()

  return loading ? (
    <SkeletonLoader height={71} />
  ) : (
    <Select
      label={formatMessage(m.digitalDelegations)}
      size="xs"
      name="domain"
      backgroundColor="blue"
      id="domain"
      noOptionsMessage="Enginn valmöguleiki"
      options={options}
      value={selectedOption}
      defaultValue={selectedOption}
      onChange={(option) => {
        const opt = option as DomainOption

        if (opt) {
          updateDomain(opt)
          onDomainChange(opt)
        }
      }}
      placeholder={formatMessage(m.chooseDomain)}
    />
  )
}
