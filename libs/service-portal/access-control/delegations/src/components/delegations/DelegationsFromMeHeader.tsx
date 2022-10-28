import { useHistory } from 'react-router-dom'

import { Box, Button, Input } from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DelegationsFromMeHeader.css'
import { useDomains, DomainOption } from '../../hooks'
import { DelegationsDomainSelect } from './DelegationsDomainSelect'

interface DelegationsHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
  onSearchChange(val: string): void
}

export const DelegationsFromMeHeader = ({
  onDomainChange,
  onSearchChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const { domainName } = useDomains()

  const onClickHandler = () => {
    const query = new URLSearchParams()

    if (domainName) {
      query.append('domain', domainName)
    }

    const queryString = query.toString()

    const url = `${ServicePortalPath.AccessControlDelegationsGrant}${
      queryString ? `?${queryString}` : ''
    }`

    history.push(url)
  }

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
        <Button onClick={onClickHandler} size="small" fluid>
          {formatMessage({
            id: 'sp.access-control-delegations:new-delegation',
            defaultMessage: 'Nýtt umboð',
          })}
        </Button>
      </Box>
    </Box>
  )
}
