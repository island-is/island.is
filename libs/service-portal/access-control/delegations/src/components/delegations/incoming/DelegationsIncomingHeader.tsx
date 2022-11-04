import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DomainOption } from '../../../hooks/useDomains'
import { DelegationsDomainSelect } from '../DelegationsDomainSelect'
import * as styles from './DelegationsIncomingHeader.css'

interface DelegationsIncomingHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
  onSearchChange?(val: string): void
  showCreateButton?: boolean
  showFilter?: boolean
}

export const DelegationsIncomingHeader = ({
  onDomainChange,
}: DelegationsIncomingHeaderProps) => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" alignItems="flexEnd" columnGap={3}>
      <Box className={styles.selectContainer} width="full">
        <DelegationsDomainSelect onDomainChange={onDomainChange} />
      </Box>
      <Button
        onClick={() => console.log('On filter click')}
        size="small"
        variant="utility"
        icon="filter"
      >
        {formatMessage({
          id: 'sp.access-control-delegations:filter',
          defaultMessage: 'Sía',
        })}
      </Button>
    </Box>
  )
}
