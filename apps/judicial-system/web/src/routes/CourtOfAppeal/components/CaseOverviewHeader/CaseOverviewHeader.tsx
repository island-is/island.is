import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { signedVerdictOverview as m } from '@island.is/judicial-system-web/messages'
import {
  CaseDates,
  CaseTitleInfoAndTags,
  FormContext,
  MarkdownWrapper,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseDecision,
  CaseState,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { courtOfAppealCaseOverviewHeader as strings } from './CaseOverviewHeader.strings'

const AppealResultAccessed = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  if (!workingCase.appealRulingDecision) {
    return null
  }

  if (
    !workingCase.defenceAppealResultAccessDate &&
    !workingCase.prosecutionAppealResultAccessDate &&
    !workingCase.prisonStaffAppealResultAccessDate
  ) {
    return null
  }

  const AppealResultAccessedByRole = ({
    role,
    date,
  }: {
    role: UserRole
    date: string
  }) => (
    <AlertMessage
      message={formatMessage(strings.appealResultOpenedBy, {
        userRole: role,
        when: formatDate(date, 'PPPp'),
      })}
      type="info"
    />
  )

  return (
    <Box>
      {workingCase.defenceAppealResultAccessDate && (
        <AppealResultAccessedByRole
          role={UserRole.DEFENDER}
          date={workingCase.defenceAppealResultAccessDate}
        />
      )}
      {workingCase.prosecutionAppealResultAccessDate && (
        <AppealResultAccessedByRole
          role={UserRole.PROSECUTOR}
          date={workingCase.prosecutionAppealResultAccessDate}
        />
      )}
      {workingCase.prisonStaffAppealResultAccessDate && (
        <AppealResultAccessedByRole
          role={UserRole.PRISON_SYSTEM_STAFF}
          date={workingCase.prisonStaffAppealResultAccessDate}
        />
      )}
    </Box>
  )
}

interface Props {
  alerts?: { message: string }[]
}

const CaseOverviewHeader: FC<Props> = (props) => {
  const { alerts } = props
  const { user } = useContext(UserContext)
  const { workingCase } = useContext(FormContext)

  const { formatMessage } = useIntl()
  const router = useRouter()

  const wasAppealedAfterDeadline =
    workingCase.appealedDate &&
    workingCase.appealDeadline &&
    workingCase.appealedDate > workingCase.appealDeadline

  return (
    <div className={grid({ gap: 5 })}>
      <Box>
        <Button
          variant="text"
          preTextIcon="arrowBack"
          onClick={() => router.push(getStandardUserDashboardRoute(user))}
        >
          {formatMessage(core.back)}
        </Button>
      </Box>
      <Box className={grid({ gap: 2 })}>
        {!workingCase.appealRulingDecision && wasAppealedAfterDeadline && (
          <AlertMessage
            message={formatMessage(strings.appealSentAfterDeadline)}
            type="warning"
          />
        )}
        <AppealResultAccessed />
        {alerts?.map((alert) => (
          <AlertMessage
            key={alert.message}
            message={alert.message}
            type="warning"
            testid="requestAppealRulingNotToBePublished"
          />
        ))}
      </Box>

      <CaseTitleInfoAndTags />
      {isRestrictionCase(workingCase.type) &&
        workingCase.decision !==
          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN &&
        workingCase.state === CaseState.ACCEPTED && (
          <CaseDates workingCase={workingCase} />
        )}
      {workingCase.caseModifiedExplanation && (
        <AlertMessage
          type="info"
          title={formatMessage(m.sections.modifyDatesInfo.title, {
            caseType: workingCase.type,
          })}
          message={
            <MarkdownWrapper
              markdown={workingCase.caseModifiedExplanation}
              textProps={{ variant: 'small' }}
            />
          }
        />
      )}
      {workingCase.rulingModifiedHistory && (
        <AlertMessage
          type="info"
          title={formatMessage(m.sections.modifyRulingInfo.title)}
          message={
            <MarkdownWrapper
              markdown={workingCase.rulingModifiedHistory}
              textProps={{ variant: 'small' }}
            />
          }
        />
      )}
    </div>
  )
}

export default CaseOverviewHeader
