import { ReactElement, useContext, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Button, Text, Tooltip } from '@island.is/island-ui/core'
import {
  APPEAL_ROUTE,
  DEFENDER_APPEAL_ROUTE,
  DEFENDER_STATEMENT_ROUTE,
  STATEMENT_ROUTE,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isDefenceUser,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { appealRuling } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  FormContext,
  Modal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  CaseAppealRulingDecision,
  CaseTransition,
  InstitutionType,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { getAppealActorText, hasSentNotification } from '../../utils'
import useCase from '../useCase'
import * as styles from './useAppealCase.css'

const renderLinkButton = (text: string, href: string) => {
  return (
    <Button
      variant="text"
      size="small"
      onClick={() => {
        router.push(href)
      }}
    >
      {text}
    </Button>
  )
}

export const getAppealDecision = (
  formatMessage: IntlShape['formatMessage'],
  appealRulingDecision?: CaseAppealRulingDecision | null,
) => {
  switch (appealRulingDecision) {
    case CaseAppealRulingDecision.ACCEPTING:
      return formatMessage(appealRuling.decisionAccept)
    case CaseAppealRulingDecision.REPEAL:
      return formatMessage(appealRuling.decisionRepeal)
    case CaseAppealRulingDecision.CHANGED:
    case CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY:
      return formatMessage(appealRuling.decisionChanged)
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
      return formatMessage(appealRuling.decisionDismissedFromCourtOfAppeal)
    case CaseAppealRulingDecision.DISMISSED_FROM_COURT:
      return formatMessage(appealRuling.decisionDismissedFromCourt)
    case CaseAppealRulingDecision.REMAND:
      return formatMessage(appealRuling.decisionRemand)
    case CaseAppealRulingDecision.DISCONTINUED:
      return formatMessage(appealRuling.decisionDiscontinued)
    default:
      return undefined
  }
}

const useAppealCase = () => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, setWorkingCase } =
    useContext(FormContext)
  const { transitionCase } = useCase()

  const [appealModalVisible, setAppealModalVisible] = useState<
    | 'ConfirmAppealAfterDeadline'
    | 'ConfirmStatementAfterDeadline'
    | 'AppealReceived'
    | undefined
  >()

  const handleReceivedTransition = () => {
    transitionCase(
      workingCase.id,
      CaseTransition.RECEIVE_APPEAL,
      setWorkingCase,
    ).then((updatedCase) => {
      if (updatedCase) {
        setAppealModalVisible('AppealReceived')
      }
    })
  }

  const appealRoute = isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE
  const statementRoute = isDefenceUser(user)
    ? DEFENDER_STATEMENT_ROUTE
    : STATEMENT_ROUTE

  let title = ''
  let description: string | undefined = undefined
  let child: ReactElement | null = null

  const {
    appealCase,
    statementDeadline,
    hasBeenAppealed,
    canBeAppealed,
    appealDeadline,
    isAppealDeadlineExpired,
    isStatementDeadlineExpired,
    sharedWithProsecutorsOffice,
  } = workingCase
  const {
    appealState,
    prosecutorStatementDate,
    defendantStatementDate,
    appealReceivedByCourtDate,
    appealRulingDecision,
  } = appealCase ?? {}

  const isSharedWithProsecutor =
    isProsecutionUser(user) &&
    user?.institution?.id === sharedWithProsecutorsOffice?.id

  const hasCurrentUserSentStatement =
    (isProsecutionUser(user) && prosecutorStatementDate) ||
    (isDefenceUser(user) && defendantStatementDate)

  const appealCompletedDate = hasSentNotification(
    NotificationType.APPEAL_COMPLETED,
    workingCase.notifications,
  ).date

  // WITHDRAWN APPEAL BANNER IS HANDLED HERE:
  if (appealState === AppealCaseState.WITHDRAWN) {
    title = 'Úrskurður kærður'
    description = 'Afturkallað'
  }

  // COURT OF APPEALS AND SHARED WITH PROSECUTOR BANNER INFO IS HANDLED HERE
  else if (
    user?.institution?.type === InstitutionType.COURT_OF_APPEALS ||
    isSharedWithProsecutor
  ) {
    if (appealState === AppealCaseState.COMPLETED) {
      title = `Niðurstaða Landsréttar ${formatDate(appealCompletedDate, 'PPP')}`
      description = getAppealDecision(formatMessage, appealRulingDecision)
    } else {
      title = 'Úrskurður kærður'
      description = `Frestur til að skila greinargerð ${
        isStatementDeadlineExpired ? 'rann' : 'rennur'
      } út ${formatDate(statementDeadline, 'PPPp')}`
    }
  }

  // DEFENDER, PROSECUTOR AND DISTRICT COURT BANNER INFO IS HANDLED HERE:
  // When appeal has been received
  else if (appealState === AppealCaseState.RECEIVED) {
    title = 'Úrskurður kærður'
    description = `Frestur til að skila greinargerð ${
      isStatementDeadlineExpired ? 'rann' : 'rennur'
    } út ${formatDate(statementDeadline, 'PPPp')}`
    // if the current user has already sent a statement, we don't want to display
    // the link to send a statement, instead we want to display the date it was sent
    if (hasCurrentUserSentStatement) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {`Greinargerð send ${formatDate(
            isProsecutionUser(user)
              ? prosecutorStatementDate
              : defendantStatementDate,
            'PPPp',
          )}`}
        </Text>
      )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Text variant="small" color="mint800" fontWeight="semiBold">
          {`Tilkynning um móttöku send ${formatDate(
            appealReceivedByCourtDate,
            'PPPp',
          )}`}
        </Text>
      )
    } else {
      child = isStatementDeadlineExpired ? (
        <Button
          variant="text"
          size="small"
          onClick={() => setAppealModalVisible('ConfirmStatementAfterDeadline')}
        >
          Senda greinargerð
        </Button>
      ) : (
        renderLinkButton(
          'Senda greinargerð',
          isDefenceUser(user)
            ? `${DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`
            : `${STATEMENT_ROUTE}/${workingCase.id}`,
        )
      )
    }
  } else if (appealState === AppealCaseState.COMPLETED) {
    title = `Niðurstaða Landsréttar ${formatDate(appealCompletedDate, 'PPP')}`
    description = getAppealDecision(formatMessage, appealRulingDecision)
  }
  // When case has been appealed by prosecutor or defender
  else if (hasBeenAppealed) {
    title = 'Úrskurður kærður'
    description = getAppealActorText(workingCase)
    if (isProsecutionUser(user) || isDefenceUser(user)) {
      child = hasCurrentUserSentStatement
        ? (child = (
            <Text variant="small" color="mint800" fontWeight="semiBold">
              {`Greinargerð send ${formatDate(
                isProsecutionUser(user)
                  ? prosecutorStatementDate
                  : defendantStatementDate,
                'PPPp',
              )}`}
            </Text>
          ))
        : renderLinkButton(
            'Senda greinargerð',
            `${
              isDefenceUser(user) ? DEFENDER_STATEMENT_ROUTE : STATEMENT_ROUTE
            }/${workingCase.id}`,
          )
    } else if (isDistrictCourtUser(user)) {
      child = (
        <Box>
          <Button
            variant="text"
            size="small"
            onClick={handleReceivedTransition}
          >
            {'Senda tilkynningu um kæru til Landsréttar'}
          </Button>
          <span className={styles.tooltipContainer}>
            <Tooltip text="Tilkynning um móttöku kæru og frest til að skila greinargerð sendist á Landsrétt og aðila málsins" />
          </span>
        </Box>
      )
    }
  }
  // When case can be appealed
  else if (canBeAppealed) {
    title = `Kærufrestur ${
      isAppealDeadlineExpired ? 'rann' : 'rennur'
    } út ${formatDate(appealDeadline, 'PPPp')}`
    child = isAppealDeadlineExpired ? (
      <Button
        variant="text"
        size="small"
        onClick={() => setAppealModalVisible('ConfirmAppealAfterDeadline')}
      >
        Senda inn kæru
      </Button>
    ) : (
      renderLinkButton(
        'Senda inn kæru',
        `${isDefenceUser(user) ? DEFENDER_APPEAL_ROUTE : APPEAL_ROUTE}/${
          workingCase.id
        }`,
      )
    )
  }

  const appealModals = (
    <>
      {appealModalVisible === 'ConfirmAppealAfterDeadline' && (
        <Modal
          title="Kærufrestur er liðinn"
          text="Viltu halda áfram og senda kæru?"
          primaryButton={{
            text: 'Já, senda kæru',
            onClick: () => router.push(`${appealRoute}/${workingCase.id}`),
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
      {appealModalVisible === 'ConfirmStatementAfterDeadline' && (
        <Modal
          title="Frestur til að skila greinargerð er liðinn"
          text="Viltu halda áfram og senda greinargerð?"
          primaryButton={{
            text: 'Já, senda greinargerð',
            onClick: () => router.push(`${statementRoute}/${workingCase.id}`),
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
      {appealModalVisible === 'AppealReceived' && (
        <Modal
          title="Tilkynningar sendar á málsaðila"
          text="Kæra hefur borist Landsrétti. Aðilar máls hafa fengið tilkynningu um frest til að skila greinargerð."
          primaryButton={{
            text: 'Loka glugga',
            onClick: () => setAppealModalVisible(undefined),
          }}
        />
      )}
    </>
  )

  const appealBanner =
    isLoadingWorkingCase || (!title && !description) ? null : (
      <AlertBanner variant="warning" title={title} description={description}>
        {child}
      </AlertBanner>
    )

  return {
    appealBanner,
    appealModals,
  }
}

export default useAppealCase
