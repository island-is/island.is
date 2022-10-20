import { useHistory } from 'react-router-dom'

import { Box, Button, Select, SkeletonLoader } from '@island.is/island-ui/core'
import { useBreakpoint } from '@island.is/island-ui/core'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DelegationsHeader.css'
import { useDomains } from '../../hooks/useDomains'

export type DomainOption = {
  label: string
  value: string
}

interface DelegationsHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
}

export const DelegationsHeader = ({
  domainName,
  onDomainChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const { sm } = useBreakpoint()
  const { domainOptions, defaultDomainOption, loading } = useDomains(domainName)

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
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="flexEnd"
      className={styles.container}
    >
      <Box className={styles.selectContainer}>
        {loading ? (
          <SkeletonLoader height={71} />
        ) : (
          <Select
            label={formatMessage(m.accessControl)}
            size="xs"
            name="domain"
            id="domain"
            noOptionsMessage="Enginn valmöguleiki"
            defaultValue={defaultDomainOption}
            options={domainOptions}
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
        )}
      </Box>
      <Button onClick={onClickHandler} size="small">
        {formatMessage({
          id: 'sp.access-control-delegations:new-delegation',
          defaultMessage: 'Nýtt umboð',
        })}
      </Button>
    </Box>
  )
}
