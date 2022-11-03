import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DelegationsToMeHeader.css'
import { DomainOption } from '../../hooks/useDomains'
import { DelegationsDomainSelect } from './DelegationsDomainSelect'

interface DelegationsHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
  onSearchChange?(val: string): void
  showCreateButton?: boolean
  showFilter?: boolean
}

export const DelegationsToMeHeader = ({
  onDomainChange,
}: DelegationsHeaderProps) => {
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
