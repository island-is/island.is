import { FC, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  TrackedNotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useAppealCase,
  useCase,
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  appendAppealCaseIdQuery,
  applyAppealCaseUpdate,
  hasSentNotification,
  isReopenedCOACase,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtOfAppealCaseStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { CaseNumberInput } from '../components'
import { useAppealCaseUsersQuery } from './appealCaseUsers.generated'
import { appealCase as strings } from './AppealCase.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type AssistantSelectOption = ReactSelectOption & { assistant: User }

type Assignees = 'assistant' | 'judge1' | 'judge2' | 'judge3'

const assignees: Record<Assignees, { id: string; assignee: string }> = {
  assistant: { id: 'appealAssistantId', assignee: 'appealAssistant' },
  judge1: { id: 'appealJudge1Id', assignee: 'appealJudge1' },
  judge2: { id: 'appealJudge2Id', assignee: 'appealJudge2' },
  judge3: { id: 'appealJudge3Id', assignee: 'appealJudge3' },
}

const AppealCase: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()
  const { sendNotification, sendNotificationError, isSendingNotification } =
    useCase()
  const { updateAppealCase } = useAppealCase()

  const { formatMessage } = useIntl()
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const { data: usersData } = useAppealCaseUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const assistants = (usersData?.users ?? [])
    .filter((user: User) => user.role === UserRole.COURT_OF_APPEALS_ASSISTANT)
    .map((assistant: User) => {
      return { label: assistant.name ?? '', value: assistant.id, assistant }
    })

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.COURT_OF_APPEALS_JUDGE &&
        targetAppealCase?.appealJudge1?.id !== user.id &&
        targetAppealCase?.appealJudge2?.id !== user.id &&
        targetAppealCase?.appealJudge3?.id !== user.id,
    )
    .map((judge: User) => {
      return { label: judge.name ?? '', value: judge.id, judge }
    })

  const defaultJudges: { key: Assignees; judge: User | undefined | null }[] = [
    { key: 'judge1', judge: targetAppealCase?.appealJudge1 },
    { key: 'judge2', judge: targetAppealCase?.appealJudge2 },
    { key: 'judge3', judge: targetAppealCase?.appealJudge3 },
  ]

  const defaultAssistant = assistants?.find(
    (assistant: AssistantSelectOption) =>
      assistant.value === targetAppealCase?.appealAssistant?.id,
  )

  const sendNotifications = () => {
    return sendNotification(
      workingCase.id,
      TrackedNotificationType.APPEAL_JUDGES_ASSIGNED,
    )
  }

  const previousUrl = appendAppealCaseIdQuery(
    `${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`,
    targetAppealCase?.id,
  )
  const handleNavigationTo = async (destination: keyof stepValidationsType) => {
    setNavigateTo(destination)

    if (
      hasSentNotification(
        TrackedNotificationType.APPEAL_JUDGES_ASSIGNED,
        workingCase.notifications,
      ).hasSent ||
      isReopenedCOACase(
        targetAppealCase?.appealState,
        workingCase.notifications,
      )
    ) {
      router.push(
        appendAppealCaseIdQuery(
          `${destination}/${workingCase.id}`,
          targetAppealCase?.id,
        ),
      )
    } else {
      await sendNotifications()
      setModalVisible(true)
    }
  }

  const handleChangedAssignee = async (
    key: 'assistant' | 'judge1' | 'judge2' | 'judge3',
    assignee: User,
  ) => {
    if (targetAppealCase?.id) {
      const updatedAppealCase = await updateAppealCase(
        workingCase.id,
        targetAppealCase.id,
        { [assignees[key].id]: assignee.id },
      )

      if (!updatedAppealCase) {
        return
      }

      setWorkingCase((prev) =>
        applyAppealCaseUpdate(prev, targetAppealCase.id, {
          [assignees[key].assignee]: assignee,
        }),
      )
    }
  }

  return (
    <>
      <PageLayout
        workingCase={workingCase}
        isLoading={false}
        notFound={false}
        onNavigationTo={handleNavigationTo}
      >
        <PageHeader title={formatMessage(strings.title)} />
        <FormContentContainer>
          <PageTitle>{formatMessage(strings.title)}</PageTitle>
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(core.appealCaseNumberHeading)}
            />
            <CaseNumberInput />
          </Box>

          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(core.appealAssistantHeading)}
            />
            <Select
              name="assistant"
              label={formatMessage(strings.assistantLabel)}
              placeholder={formatMessage(strings.assistantPlaceholder)}
              value={defaultAssistant}
              options={assistants}
              onChange={(selectedOption) => {
                handleChangedAssignee(
                  'assistant',
                  (selectedOption as AssistantSelectOption).assistant,
                )
              }}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <SectionHeading title={formatMessage(core.appealJudgesHeading)} />
            <BlueBox>
              {defaultJudges.map(({ key, judge }, index) => (
                <Box marginBottom={2} key={`${index}`}>
                  <Select
                    name="judge"
                    label={formatMessage(
                      index === 0
                        ? strings.judgeForepersonLabel
                        : strings.judgeLabel,
                    )}
                    placeholder={formatMessage(
                      index === 0
                        ? strings.judgeForepersonPlaceholder
                        : strings.judgePlaceholder,
                    )}
                    value={
                      judge?.id
                        ? { label: judge.name ?? '', value: judge.id }
                        : undefined
                    }
                    options={judges}
                    onChange={(selectedOption) => {
                      handleChangedAssignee(
                        key,
                        (selectedOption as JudgeSelectOption).judge,
                      )
                    }}
                    required
                  />
                </Box>
              ))}
            </BlueBox>
          </Box>
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={previousUrl}
            nextButtonIcon="arrowForward"
            onNextButtonClick={() => {
              handleNavigationTo(constants.COURT_OF_APPEAL_RULING_ROUTE)
            }}
            nextButtonText={formatMessage(strings.nextButtonText)}
            nextIsDisabled={!isCourtOfAppealCaseStepValid(targetAppealCase)}
          />
        </FormContentContainer>
      </PageLayout>
      <AnimatePresence>
        {modalVisible && (
          <Modal
            title={formatMessage(
              sendNotificationError
                ? strings.notificationsFailedModalHeading
                : strings.modalHeading,
            )}
            text={formatMessage(
              sendNotificationError
                ? strings.notificationsFailedModalMessage
                : strings.modalMessage,
            )}
            primaryButton={{
              text: formatMessage(strings.modalPrimaryButton),
              onClick: () =>
                router.push(
                  appendAppealCaseIdQuery(
                    `${navigateTo}/${workingCase.id}`,
                    targetAppealCase?.id,
                  ),
                ),
            }}
            secondaryButton={
              sendNotificationError
                ? {
                    text: formatMessage(
                      strings.notificationFailedModalSecondaryButton,
                    ),
                    onClick: () => {
                      sendNotifications()
                    },
                    isLoading: isSendingNotification,
                  }
                : undefined
            }
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default AppealCase
