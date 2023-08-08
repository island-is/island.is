import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'

import {
  displayFirstPlusRemaining,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import { TempCaseListEntry as CaseListEntry } from '@island.is/judicial-system-web/src/types'
import { TagCaseState } from '@island.is/judicial-system-web/src/components'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import { CategoryCard } from '@island.is/judicial-system-web/src/components/Table'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { tables } from '@island.is/judicial-system-web/messages'

interface Props {
  theCase: CaseListEntry
  onClick: () => void
  isCourtRole: boolean
}

const MobilePastCase: React.FC<Props> = ({
  theCase,
  onClick,
  isCourtRole,
  children,
}) => {
  const { formatMessage } = useIntl()

  return (
    <CategoryCard
      heading={displayCaseType(formatMessage, theCase.type, theCase.decision)}
      onClick={onClick}
      tags={[
        <TagCaseState
          caseState={theCase.state}
          caseType={theCase.type}
          isCourtRole={isCourtRole}
          isValidToDateInThePast={theCase.isValidToDateInThePast}
          courtDate={theCase.courtDate}
        />,
      ]}
    >
      <Text title={theCase.policeCaseNumbers.join(', ')}>
        {displayFirstPlusRemaining(theCase.policeCaseNumbers)}
      </Text>
      {theCase.courtCaseNumber && <Text>{theCase.courtCaseNumber}</Text>}
      <br />
      {theCase.defendants && theCase.defendants.length > 0 && (
        <>
          <Text>{theCase.defendants[0].name ?? ''}</Text>
          {theCase.defendants.length === 1 ? (
            <Text>
              {formatDOB(
                theCase.defendants[0].nationalId,
                theCase.defendants[0].noNationalId,
              )}
            </Text>
          ) : (
            <Text>{`+ ${theCase.defendants.length - 1}`}</Text>
          )}
        </>
      )}
      {theCase.created && (
        <>
          <br />
          <Text variant="small" fontWeight={'medium'}>
            {`${formatMessage(tables.created)} ${format(
              parseISO(theCase.created),
              'd.M.y',
            )}`}
          </Text>
        </>
      )}
      <Box marginTop={1}>{children}</Box>
    </CategoryCard>
  )
}

export default MobilePastCase
