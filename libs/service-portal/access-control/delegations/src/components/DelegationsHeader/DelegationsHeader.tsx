import { useHistory } from 'react-router-dom'

import { Box, Button, Select, Option } from '@island.is/island-ui/core'
import { useBreakpoint } from '@island.is/island-ui/core'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from './DelegationsHeader.css'
import { ValueType } from 'react-select'

type DelegationsHeaderProps = {
  onSystemChange(id: ValueType<Option>): void
}

export const DelegationsHeader = ({
  onSystemChange,
}: DelegationsHeaderProps) => {
  useNamespaces('sp.access-control-delegations')
  const history = useHistory()
  const { formatMessage } = useLocale()
  const { sm } = useBreakpoint()

  const systemOptions = [
    {
      label: formatMessage({
        id: 'sp.access-control-delegations:all-systems',
        defaultMessage: 'Öll kerfi',
      }),
      value: 'all',
    },
    {
      label: 'Valmöguleiki 1',
      value: '0',
    },
    {
      label: 'Valmöguleiki 2',
      value: '1',
    },
  ]

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
          name="system"
          noOptionsMessage="Enginn valmöguleiki"
          defaultValue={systemOptions[0]}
          options={systemOptions}
          onChange={onSystemChange}
          placeholder={formatMessage({
            id: 'sp.access-control-delegations:choose-system',
            defaultMessage: 'Veldu kerfi',
          })}
        />
      </Box>
      <Button
        onClick={() =>
          history.push(ServicePortalPath.AccessControlDelegationsGrant)
        }
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
