import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Box, Button, Select } from '@island.is/island-ui/core'
import { useBreakpoint } from '@island.is/island-ui/core'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from './DelegationsHeader.css'

type DomainOpton = {
  label: string
  value: string
}

export const DelegationsHeader = () => {
  useNamespaces('sp.access-control-delegations')
  const [domainName, setDomainName] = useState<string | null>(null)
  const history = useHistory()
  const { formatMessage } = useLocale()
  const { sm } = useBreakpoint()

  const domainOptions = [
    {
      label: formatMessage({
        id: 'sp.access-control-delegations:all-domains',
        defaultMessage: 'Öll kerfi',
      }),
      value: 'all',
    },
    {
      label: 'Island.is',
      value: '0',
    },
    {
      label: 'Landspítalaappið',
      value: '1',
    },
  ]

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
        <Select
          label={formatMessage(m.accessControl)}
          size="xs"
          name="domain"
          id="domain"
          noOptionsMessage="Enginn valmöguleiki"
          defaultValue={domainOptions[0]}
          options={domainOptions}
          onChange={(option) => setDomainName((option as DomainOpton)?.label)}
          placeholder={formatMessage({
            id: 'sp.access-control-delegations:choose-domain',
            defaultMessage: 'Veldu kerfi',
          })}
        />
      </Box>
      <Button
        onClick={onClickHandler}
        variant="utility"
        size="small"
        {...(sm && { icon: 'add', iconType: 'outline' })}
      >
        {formatMessage({
          id: 'sp.access-control-delegations:new-delegation',
          defaultMessage: 'Nýtt umboð',
        })}
      </Button>
    </Box>
  )
}
