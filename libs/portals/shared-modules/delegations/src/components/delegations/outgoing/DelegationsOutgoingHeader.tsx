import { GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DomainOption } from '../../../hooks/useDomains/useDomains'
import { DelegationsDomainSelect } from '../DelegationsDomainSelect'
import { m } from '../../../lib/messages'

interface DelegationsOutgoingHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
  onSearchChange(val: string): void
}

export const DelegationsOutgoingHeader = ({
  onDomainChange,
  onSearchChange,
}: DelegationsOutgoingHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow alignItems={'flexEnd'}>
      <GridColumn span={['8/8', '4/8', '4/8', '4/8', '3/8']}>
        <DelegationsDomainSelect onDomainChange={onDomainChange} />
      </GridColumn>
      <GridColumn
        span={['8/8', '4/8', '4/8', '4/8', '3/8']}
        offset={['0', '0', '0', '0', '2/8']}
        paddingTop={[2, 0]}
      >
        <Input
          size="xs"
          type="text"
          placeholder={formatMessage(m.searchPlaceholder)}
          backgroundColor="blue"
          name="search"
          onChange={(e) => onSearchChange(e.target.value)}
          icon={{ name: 'search' }}
        />
      </GridColumn>
    </GridRow>
  )
}
