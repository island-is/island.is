import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import { capitalize } from '@island.is/judicial-system/formatters'
import { Case, courtRoles, UserRole } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  userRole?: UserRole
  showAdditionalInfo?: boolean
}

const CaseInfo: React.FC<Props> = ({
  workingCase,
  userRole,
  showAdditionalInfo,
}: Props) => {
  const { formatMessage } = useIntl()

  const renderDefendants = () =>
    workingCase.defendants &&
    workingCase.defendants.length > 0 && (
      <Text fontWeight="semiBold">{`${capitalize(
        formatMessage(core.defendant, {
          suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
        }),
      )}:${workingCase.defendants
        .map((defendant) => ` ${defendant.name}`)
        .toString()
        .replace(/,\s*$/, '')}`}</Text>
    )

  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h2" as="h2">
          {formatMessage(core.caseNumber, {
            caseNumber: userRole
              ? courtRoles.includes(userRole)
                ? workingCase.courtCaseNumber
                : workingCase.policeCaseNumber
              : '',
          })}
        </Text>
      </Box>
      {userRole ? (
        courtRoles.includes(userRole) ? (
          <>
            <Text fontWeight="semiBold">{`${formatMessage(core.prosecutor)}: ${
              workingCase.creatingProsecutor?.institution?.name
            }`}</Text>
            {renderDefendants()}
          </>
        ) : userRole === UserRole.PROSECUTOR && showAdditionalInfo ? (
          <>
            <Text fontWeight="semiBold">{`${formatMessage(core.court)}: ${
              workingCase.court?.name
            }`}</Text>
            {renderDefendants()}
          </>
        ) : null
      ) : null}
    </>
  )
}

export default CaseInfo
