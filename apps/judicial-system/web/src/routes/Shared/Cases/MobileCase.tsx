import { FC, PropsWithChildren, ReactNode } from 'react'
import { useIntl } from 'react-intl'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { AnimatePresence } from 'framer-motion'

import { Box, FocusableBox, Text } from '@island.is/island-ui/core'
import {
  displayFirstPlusRemaining,
  districtCourtAbbreviation,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'
import { TagCaseState } from '@island.is/judicial-system-web/src/components'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCaseList } from '@island.is/judicial-system-web/src/utils/hooks'

import { displayCaseType } from './utils'
import * as styles from './MobileCase.css'

interface CategoryCardProps {
  heading: string | ReactNode
  tags?: ReactNode
  onClick: () => void
  isLoading?: boolean
}

export const CategoryCard: FC<PropsWithChildren<CategoryCardProps>> = ({
  heading,
  onClick,
  tags,
  children,
  isLoading = false,
}) => {
  const { LoadingIndicator } = useCaseList()

  return (
    <FocusableBox
      className={styles.card}
      height="full"
      width="full"
      component="button"
      aria-disabled={isLoading}
      onClick={onClick}
    >
      <Box>
        <Text variant="h3" as="h3" color={'blue400'} marginBottom={1}>
          {heading}
        </Text>
        {children}
        <Box marginTop={3}>{tags}</Box>
      </Box>
      <AnimatePresence>{isLoading && <LoadingIndicator />}</AnimatePresence>
    </FocusableBox>
  )
}

interface Props {
  theCase: CaseListEntry
  onClick: () => void
  isCourtRole: boolean
  isLoading?: boolean
}

const MobileCase: FC<PropsWithChildren<Props>> = ({
  theCase,
  onClick,
  isCourtRole,
  children,
  isLoading = false,
}) => {
  const { formatMessage } = useIntl()
  const courtAbbreviation = districtCourtAbbreviation(theCase.court?.name)

  return (
    <CategoryCard
      heading={displayCaseType(formatMessage, theCase.type, theCase.decision)}
      onClick={onClick}
      tags={[
        <TagCaseState
          key={theCase.id}
          caseState={theCase.state}
          caseType={theCase.type}
          isCourtRole={isCourtRole}
          isValidToDateInThePast={theCase.isValidToDateInThePast}
          courtDate={theCase.courtDate}
          indictmentRulingDecision={theCase.indictmentRulingDecision}
          indictmentDecision={theCase.indictmentDecision}
          defendants={theCase.defendants}
        />,
      ]}
      isLoading={isLoading}
    >
      <Text title={theCase.policeCaseNumbers?.join(', ')}>
        {displayFirstPlusRemaining(theCase.policeCaseNumbers)}
      </Text>
      {theCase.courtCaseNumber && (
        <Text>{`${courtAbbreviation ? `${courtAbbreviation}: ` : ''}${
          theCase.courtCaseNumber
        }`}</Text>
      )}
      {theCase.defendants && theCase.defendants.length > 0 && (
        <Box marginTop={3}>
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
        </Box>
      )}
      {theCase.caseSentToCourtDate && (
        <Box marginTop={3}>
          <Text variant="small" fontWeight="medium">
            {`${formatMessage(tables.sentToCourtDate)} ${format(
              parseISO(theCase.caseSentToCourtDate),
              'd.M.y',
            )}`}
          </Text>
        </Box>
      )}
      <Box marginTop={1}>{children}</Box>
    </CategoryCard>
  )
}

export default MobileCase
