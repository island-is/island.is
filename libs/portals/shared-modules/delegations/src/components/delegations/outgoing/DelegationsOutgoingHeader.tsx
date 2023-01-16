import { useNavigate } from 'react-router-dom-v5-compat'

import { Box, Button, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { DomainOption } from '../../../hooks/useDomains/useDomains'
import { DelegationsDomainSelect } from '../DelegationsDomainSelect'
import * as styles from './DelegationsOutgoingHeader.css'
import { DelegationPaths } from '../../../lib/paths'

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
  const navigate = useNavigate()

  return (
    <Box className={styles.container}>
      <Box className={styles.selectContainer}>
        <DelegationsDomainSelect onDomainChange={onDomainChange} />
      </Box>
      <Box className={styles.searchContainer}>
        <Input
          size="xs"
          type="text"
          placeholder={formatMessage({
            id: 'sp.access-control-delegations:search-placeholder',
            defaultMessage: 'Leita eftir nafni eða kt.',
          })}
          backgroundColor="blue"
          name="search"
          onChange={(e) => onSearchChange(e.target.value)}
          icon="search"
        />
      </Box>
      <Box className={styles.buttonContainer}>
        <Button
          onClick={() => navigate(DelegationPaths.DelegationsGrant)}
          size="small"
          fluid
        >
          {formatMessage({
            id: 'sp.access-control-delegations:new-delegation',
            defaultMessage: 'Nýtt umboð',
          })}
        </Button>
      </Box>
    </Box>
  )
}
