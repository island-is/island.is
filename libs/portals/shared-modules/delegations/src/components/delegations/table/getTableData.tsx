import { AuthDelegationsGroupedByIdentity } from '@island.is/api/schema'
import { AuthDelegationType } from '@island.is/shared/types'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { FormatMessage } from '@island.is/localization'

export const getLegalGuardianTableData = (
  data: AuthDelegationsGroupedByIdentity[],
  switchUser: (nationalId: string, targetLink?: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = [
    formatMessage(m.headerName),
    formatMessage(m.headerDelegationType),
    formatMessage(m.headerDomain),
    '',
  ]
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.nationalId, name: row.name }}
        isExpanded={false}
      />,
      <Text variant="medium">
        {row.type === AuthDelegationType.LegalGuardian
          ? formatMessage(m.legalGuardian)
          : formatMessage(m.legalGuardianMinor)}
      </Text>,
      <Text variant="medium">{formatMessage(m.registry)}</Text>, // Todo: get domain from data
      <Box flexShrink={0}>
        <Button
          variant="text"
          icon="person"
          iconType="outline"
          size="small"
          colorScheme="default"
          onClick={() =>
            switchUser(row.nationalId, 'http://localhost:4200/minarsidur')
          }
        >
          {formatMessage(m.switch)}
        </Button>
      </Box>,
    ]
  })

  return { headerArray, tableData }
}

export const getProcuringHolderTableData = (
  data: AuthDelegationsGroupedByIdentity[],
  switchUser: (nationalId: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = [
    formatMessage(m.headerName),
    formatMessage(m.headerDelegationType),
    formatMessage(m.headerRegisteredDate),
    formatMessage(m.headerDomain),
    '',
  ]
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.nationalId, name: row.name }}
        isExpanded={false}
        icon="briefcase"
      />,
      <Text variant="medium">{formatMessage(m.procurationHolder)}</Text>,
      <Text variant="medium">TODO</Text>, // Todo: check if starting date is available
      <Text variant="medium">{formatMessage(m.registry)}</Text>, // Todo: get domain from data
      <Box flexShrink={0}>
        <Button
          variant="text"
          icon="person"
          iconType="outline"
          size="small"
          colorScheme="default"
          onClick={() => switchUser(row.nationalId)}
        >
          {formatMessage(m.switch)}
        </Button>
      </Box>,
    ]
  })

  return { headerArray, tableData }
}

export const getGeneralMandateTableData = (
  data: AuthDelegationsGroupedByIdentity[],
  switchUser: (nationalId: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = [
    formatMessage(m.headerName),
    formatMessage(m.headerDelegationType),
    formatMessage(m.headerRegisteredDate),
    '',
  ]
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.nationalId, name: row.name }}
        isExpanded={false}
      />,
      <Text variant="medium">
        {formatMessage(m.delegationTypeGeneralMandate)}
      </Text>,
      <Text variant="medium">TODO</Text>, // Todo: check if starting date is available
      <Box flexShrink={0}>
        <Button
          variant="text"
          icon="person"
          iconType="outline"
          size="small"
          colorScheme="default"
          onClick={() => switchUser(row.nationalId)}
        >
          {formatMessage(m.switch)}
        </Button>
      </Box>,
    ]
  })

  return { headerArray, tableData }
}
