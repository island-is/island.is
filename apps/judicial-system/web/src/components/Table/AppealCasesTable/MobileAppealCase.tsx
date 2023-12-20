import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  displayFirstPlusRemaining,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import { CategoryCard } from '@island.is/judicial-system-web/src/routes/Shared/Cases/MobileCase'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'

interface Props {
  children: React.ReactNode
  theCase: CaseListEntry
  onClick: () => void
  isLoading?: boolean
}

const MobileAppealCase: React.FC<Props> = ({
  theCase,
  onClick,
  children,
  isLoading = false,
}) => {
  const { formatMessage } = useIntl()

  return (
    <CategoryCard
      heading={displayCaseType(
        formatMessage,
        theCase.type,
        theCase.decision ?? undefined,
      )}
      onClick={onClick}
      tags={[
        <TagAppealState
          appealState={theCase.appealState}
          appealRulingDecision={theCase.appealRulingDecision}
          appealCaseNumber={theCase.appealCaseNumber}
        />,
      ]}
      isLoading={isLoading}
    >
      {theCase.appealCaseNumber && <Text>{theCase.appealCaseNumber}</Text>}
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
      <Box marginTop={1}>{children}</Box>
    </CategoryCard>
  )
}

export default MobileAppealCase
