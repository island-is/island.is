import { AuthDelegationsGroupedByIdentity } from '@island.is/api/schema'
import { AuthDelegationType } from '@island.is/shared/types'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { Box, Button, IconProps, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { FormatMessage } from '@island.is/localization'

export type MobileRowData = {
  identity: { nationalId: string; name: string }
  icon?: IconProps['icon']
  dataRows: { label: string; content: string }[]
  action: React.ReactElement
}

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

  const mobileRows: MobileRowData[] = data.map((row) => ({
    identity: { nationalId: row.nationalId, name: row.name },
    dataRows: [
      {
        label: formatMessage(m.headerDelegationType),
        content:
          row.type === AuthDelegationType.LegalGuardian
            ? formatMessage(m.legalGuardian)
            : formatMessage(m.legalGuardianMinor),
      },
      {
        label: formatMessage(m.headerDomain),
        content: formatMessage(m.registry),
      },
    ],
    action: (
      <Button
        variant="ghost"
        icon="person"
        iconType="outline"
        size="small"
        colorScheme="default"
        fluid
        onClick={() =>
          switchUser(row.nationalId, 'http://localhost:4200/minarsidur')
        }
      >
        {formatMessage(m.switch)}
      </Button>
    ),
  }))

  return { headerArray, tableData, mobileRows }
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

  const mobileRows: MobileRowData[] = data.map((row) => ({
    identity: { nationalId: row.nationalId, name: row.name },
    icon: 'briefcase' as const,
    dataRows: [
      {
        label: formatMessage(m.headerDelegationType),
        content: formatMessage(m.procurationHolder),
      },
      {
        label: formatMessage(m.headerRegisteredDate),
        content: 'TODO', // Todo: check if starting date is available
      },
      {
        label: formatMessage(m.headerDomain),
        content: formatMessage(m.registry),
      },
    ],
    action: (
      <Button
        variant="ghost"
        icon="person"
        iconType="outline"
        fluid
        size="small"
        colorScheme="default"
        onClick={() => switchUser(row.nationalId)}
      >
        {formatMessage(m.switch)}
      </Button>
    ),
  }))

  return { headerArray, tableData, mobileRows }
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

  const mobileRows: MobileRowData[] = data.map((row) => ({
    identity: { nationalId: row.nationalId, name: row.name },
    dataRows: [
      {
        label: formatMessage(m.headerDelegationType),
        content: formatMessage(m.delegationTypeGeneralMandate),
      },
      {
        label: formatMessage(m.headerRegisteredDate),
        content: 'TODO', // Todo: check if starting date is available
      },
    ],
    action: (
      <Button
        variant="ghost"
        icon="person"
        iconType="outline"
        fluid
        size="small"
        colorScheme="default"
        onClick={() => switchUser(row.nationalId)}
      >
        {formatMessage(m.switch)}
      </Button>
    ),
  }))

  return { headerArray, tableData, mobileRows }
}
