import {
  AuthGeneralMandate,
  AuthLegalGuardianDelegation,
  AuthLegalGuardianMinorDelegation,
  AuthProcuringHolderDelegation,
} from '@island.is/api/schema'
import { AuthDelegationType } from '@island.is/shared/types'
import { IdentityInfo } from './IdentityInfo/IdentityInfo'
import { Button, Text } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'
import { FormatMessage } from '@island.is/localization'

export const getLegalGuardianTableData = (
  data: AuthLegalGuardianDelegation[] | AuthLegalGuardianMinorDelegation[],
  switchUser: (nationalId: string, targetLink?: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = ['Nafn', 'Tegund umboðs', 'Stofnun', '']
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.from.nationalId, name: row.from.name }}
        isExpanded={false}
      />,
      <Text variant="medium">
        {row.type === AuthDelegationType.LegalGuardian
          ? formatMessage(m.legalGuardian)
          : formatMessage(m.legalGuardianMinor)}
      </Text>,
      <Text variant="medium">{formatMessage(m.registry)}</Text>, // Todo: get domain from data
      <Button
        variant="text"
        icon="person"
        iconType="outline"
        size="small"
        colorScheme="default"
        onClick={() =>
          switchUser(row.from.nationalId, 'http://localhost:4200/minarsidur')
        }
      >
        {formatMessage(m.switch)}
      </Button>,
    ]
  })

  return { headerArray, tableData }
}

export const getProcuringHolderTableData = (
  data: AuthProcuringHolderDelegation[],
  switchUser: (nationalId: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = ['Nafn', 'Tegund umboðs', 'Dags. skráð', 'Stofnun', '']
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.from.nationalId, name: row.from.name }}
        isExpanded={false}
        icon="briefcase"
      />,
      <Text variant="medium">{formatMessage(m.procurationHolder)}</Text>, // Todo: translate
      <Text variant="medium">TODO</Text>, // Todo: check if starting date is available
      <Text variant="medium">{formatMessage(m.registry)}</Text>, // Todo: get domain from data
      <Button
        variant="text"
        icon="person"
        iconType="outline"
        size="small"
        colorScheme="default"
        onClick={() => switchUser(row.from.nationalId)}
      >
        {formatMessage(m.switch)}
      </Button>,
    ]
  })

  return { headerArray, tableData }
}

export const getGeneralMandateTableData = (
  data: AuthGeneralMandate[],
  switchUser: (nationalId: string) => void,
  formatMessage: FormatMessage,
) => {
  const headerArray = ['Nafn', 'Tegund umboðs', 'Dags. skráð', '']
  const tableData = data.map((row) => {
    return [
      <IdentityInfo
        identity={{ nationalId: row.from.nationalId, name: row.from.name }}
        isExpanded={false}
      />,
      <Text variant="medium">
        {formatMessage(m.delegationTypeGeneralMandate)}
      </Text>, // Todo: translate
      <Text variant="medium">TODO</Text>, // Todo: check if starting date is available
      <Button
        variant="text"
        icon="person"
        iconType="outline"
        size="small"
        colorScheme="default"
        onClick={() => switchUser(row.from.nationalId)}
      >
        {formatMessage(m.switch)}
      </Button>,
    ]
  })

  return { headerArray, tableData }
}
